import { useState, useEffect } from "react";

import randomizer from "./randomizer";

const App = () => {
    const [currentNumber, setCurrentNumber] = useState(null);
    const [toOut, setToOut] = useState(Array.from({ length: 90 }, (_, index) => index + 1));
    const [toCame, setToCame] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleClick = () => {
        let ramdon = randomizer(toOut);
        setToOut(ramdon);
        setIsDisabled(true)

        let numberToShow = null;
        let interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * toOut.length);
            numberToShow = toOut[randomIndex];
            setCurrentNumber(numberToShow);
        }, 100);

        const audio = new Audio('https://res.cloudinary.com/dnnigh3iz/video/upload/v1717185478/Bingo/nloy39hxszb1dzwwxzhl.ogg');
        audio.play();

        setTimeout(() => {
            clearInterval(interval);
            let number = toOut.pop();
            sessionStorage.setItem('toOut', JSON.stringify(toOut));
            if (toOut.length) {
                setCurrentNumber(number);
                sessionStorage.setItem('currentNumber', JSON.stringify(number));
                setToCame(prevToCame => {
                    const updatedToCame = [...prevToCame, number];
                    sessionStorage.setItem('toCame', JSON.stringify(updatedToCame));
                    return updatedToCame;
                });
                sessionStorage.setItem('toCame', JSON.stringify(toCame));
                setIsDisabled(false);
            } else {
                setCurrentNumber("No hay más números");
            }
        }, 8000);

    };

    const handleReset = () => {
        sessionStorage.removeItem('currentNumber');
        sessionStorage.removeItem('toCame');
        sessionStorage.removeItem('toOut');
        setCurrentNumber(null);
        setToOut(Array.from({ length: 90 }, (_, index) => index + 1));
        setToCame([]);
    };

    useEffect(()=>{
        const sessionCurrentNumber = sessionStorage.getItem('currentNumber');
        if(sessionCurrentNumber){
            setCurrentNumber(sessionCurrentNumber)
        };
        const sessionTocame = sessionStorage.getItem('toCame');
        if(sessionTocame){
            setToCame(JSON.parse(sessionTocame))
        };
        const sessionToOut = sessionStorage.getItem('toOut');
        if(sessionToOut){
            setToOut(JSON.parse(sessionToOut))
        };
    },[]);
    
    return (
        <div className="flex flex-col justify-center items-center w-[80%] m-auto gap-y-20 mt-20">
            <h1 className=" text-start">Bingo Machine</h1>
            <h2 className="rounded-full bg-gradient-to-br from-white via-gray-800 to-black px-4 py-6">
                <span className={`rounded-full bg-white text-4xl ${currentNumber?.toString().length == 2 ? 'px-3 py-2 ' : 'px-5 py-2 '}`}>
                    {currentNumber === null ? "Bingo!" : currentNumber}
                </span>
            </h2>

            <button onClick={handleClick} disabled={isDisabled} className=" text-cyan-50 " >Click</button>
            <button onClick={handleReset} disabled={isDisabled} >Reset</button>

            <h2>Numeros que salieron!</h2>
            <ul className="flex flex-wrap text-pretty gap-3">
                {
                    toCame.map((n) => (
                        <li className="rounded-full bg-gradient-to-br from-white via-gray-800 to-black px-3 py-5" key={n}>
                            <span className={`rounded-full bg-white  ${n.toString().length === 2 ? ' px-2 py-1 ' : 'px-4 py-1 '} text-3xl`}>{n}</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default App;

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
                setCurrentNumber("No more numbers");
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
        setIsDisabled(false)
    };

    useEffect(() => {
        const sessionCurrentNumber = sessionStorage.getItem('currentNumber');
        if (sessionCurrentNumber) {
            setCurrentNumber(sessionCurrentNumber)
        };
        const sessionTocame = sessionStorage.getItem('toCame');
        if (sessionTocame) {
            setToCame(JSON.parse(sessionTocame))
        };
        const sessionToOut = sessionStorage.getItem('toOut');
        if (sessionToOut) {
            setToOut(JSON.parse(sessionToOut))
        };
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-[90%] m-auto gap-y-20 mt-20 ">
            <h2 className="rounded-full bg-gradient-to-br from-white via-gray-800 to-black px-4 py-6">
                {
                    currentNumber === null ?
                        <span className="rounded-full bg-white text-5xl text-white font-extrabold px-5 py-1"  style={{ WebkitTextStroke: '0.5px black' }}> Bingo Machine! </span>
                        :

                        <span className={`${currentNumber === 'No more numbers'? 'rounded-full bg-white text-3xl text-black font-extrabold px-5 py-1': 'rounded-full bg-white text-5xl'} ${currentNumber?.toString().length == 2 ? 'px-3 py-2 ' : 'px-5 py-2 '}`}>{currentNumber}</span>
                }
            </h2>

            <section className=" flex flex-col gap-y-9">
                <button onClick={handleClick} disabled={isDisabled} className=" text-white text-2xl font-bold " style={{ WebkitTextStroke: '0.5px black' }} >Click to Start</button>
                <button onClick={handleReset} className=" text-white text-2xl font-bold"style={{ WebkitTextStroke: '0.5px black' }} >Reset</button>
            </section>

            <section className="flex flex-col items-center gap-y-5 h-[53vh]">
                <h2 className=" text-white text-3xl font-bold " style={{ WebkitTextStroke: '0.5px black' }}> Drawn numbers!</h2>
                <ul className="flex flex-wrap text-pretty justify-center gap-3 overflow-auto">
                    {
                        toCame.sort((a, b) => a - b).map((n) => (
                            <li className="rounded-full bg-gradient-to-br from-white via-gray-800 to-black px-3 py-5" key={n}>
                                <span className={`rounded-full bg-white  ${n.toString().length === 2 ? ' px-3 py-2 ' : 'px-4 py-1 '} text-3xl`}>{n}</span>
                            </li>
                        ))
                    }
                </ul>
            </section>
        </div>
    );
};

export default App;

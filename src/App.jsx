import { useState } from "react";

const App = () => {
    const [currentNumber, setCurrentNumber] = useState(null);
    const [toOut, setToOut] = useState(Array.from({ length: 90 }, (_, index) => index + 1));
    const [toCame, setToCame] = useState([]);

    const randomizer = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleClick = () => {
        let ramdon = randomizer(toOut);
        setToOut(ramdon);

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
            if (toOut.length) {
                setCurrentNumber(number);
                setToCame([...toCame, number]);
            } else {
                setCurrentNumber("No hay más números");
            }
        }, 8000);
    };
    const handleReset = ()=>{
        setCurrentNumber(null)
        setToOut(Array.from({ length: 90 }, (_, index) => index + 1))
        setToCame([])
    };
    return (
        <div className="flex flex-col justify-center items-center w-[80%] m-auto gap-y-20 mt-20">
            <h1 className=" text-start">Bingo Machine</h1>
            <h2 className="rounded-full bg-gradient-to-br from-white via-gray-800 to-black px-4 py-6">
                <span className="rounded-full bg-white px-3 py-2 text-4xl">
                    {currentNumber === null? "Bingo!": currentNumber}
                </span>
            </h2>

            <button onClick={handleClick}>Click</button>
            <button onClick={handleReset}>Reset</button>
            
            <h2>Numeros que salieron!</h2>
            <ul className="flex flex-wrap text-pretty gap-3">
                {
                    toCame.map((n) => (
                        <li className="rounded-full bg-gradient-to-br from-white via-gray-800 to-black px-3 py-5" key={n}>
                            <span className="rounded-full bg-white px-2 py-1 text-3xl">{n}</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default App;

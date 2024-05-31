import { useState } from "react";

const App = () => {

    const [currentNumber, setCurrentNumber] = useState(null);

    const [toOut, setToOut] = useState([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89, 90
    ]);

    const [toCame, setToCame] = useState([]);

    const randomizer = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        };
        return array;
    };

    const handleClick = () => {
        let ramdon = randomizer(toOut);
        setToOut(ramdon);
        let number = toOut.pop();
        setCurrentNumber(number);
        setToCame([...toCame, number]);
    };

    return (
        <div className="flex flex-col justify-center items-center w-[80%] m-auto gap-y-20 mt-20">
            <ul className=" flex flex-wrap text-pretty gap-3">
                {toOut.length ? toOut.map((n) => {
                    return (
                        <li className=" rounded-full  bg-gradient-to-br from-white via-gray-800 to-black px-3 py-4" key={n}>
                            <span className=" rounded-full bg-white px-2 py-1">
                                {n}
                            </span>
                        </li>
                    )
                }) : "Los numeros que saliero estarna aqui"}
            </ul>
            <h1>{currentNumber === null ? "Tu numero aparecera aqui" : currentNumber}</h1>

            <button onClick={handleClick}> Click </button>
            <ul className=" flex flex-wrap text-pretty gap-3">
                {toCame.length ? toCame.map((n) => {
                    return (
                        <li className=" rounded-full bg-black px-3 py-4" key={n}>
                            <span className=" rounded-full bg-white px-2 py-1">
                                {n}
                            </span>
                        </li>
                    )
                }) : "Los numeros qe saliero estarna aqui"}
            </ul>
        </div>
    )
}

export default App

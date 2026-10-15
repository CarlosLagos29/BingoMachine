import { useState } from "react";

import randomizer from "./randomizer";
import ballsSound from "./assets/balls.mp3";

const fromSession = (key, fallback) => JSON.parse(sessionStorage.getItem(key)) ?? fallback;

const RING = 'rounded-full bg-linear-to-br from-white via-gray-800 to-black';

const Ball = ({ className, textClassName, children }) => (
    <div className={`${RING} ${className}`}>
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span className={`leading-none text-black ${textClassName}`}>{children}</span>
        </div>
    </div>
);

const App = () => {
    const [currentNumber, setCurrentNumber] = useState(() => fromSession('currentNumber', null));
    const [remaining, setRemaining] = useState(() => fromSession('remaining', Array.from({ length: 90 }, (_, index) => index + 1)));
    const [drawn, setDrawn] = useState(() => fromSession('drawn', []));
    const [isDisabled, setIsDisabled] = useState(false);

    const handleClick = () => {
        setRemaining(randomizer(remaining));
        setIsDisabled(true)

        let interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * remaining.length);
            setCurrentNumber(remaining[randomIndex]);
        }, 100);

        const audio = new Audio(ballsSound);
        audio.play().catch(() => {});

        setTimeout(() => {
            clearInterval(interval);
            let number = remaining.pop();
            sessionStorage.setItem('remaining', JSON.stringify(remaining));
            setCurrentNumber(number);
            sessionStorage.setItem('currentNumber', JSON.stringify(number));
            setDrawn(prevDrawn => {
                const updatedDrawn = [...prevDrawn, number];
                sessionStorage.setItem('drawn', JSON.stringify(updatedDrawn));
                return updatedDrawn;
            });
            setIsDisabled(false);
        }, 9000);

    };

    const handleReset = () => {
        sessionStorage.removeItem('currentNumber');
        sessionStorage.removeItem('drawn');
        sessionStorage.removeItem('remaining');
        setCurrentNumber(null);
        setRemaining(Array.from({ length: 90 }, (_, index) => index + 1));
        setDrawn([]);
        setIsDisabled(false)
    };

    const lastDrawn = drawn.at(-1);

    return (
        <>
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.28)_100%)]" />

            <div className="relative flex flex-col items-center gap-6 w-[90%] max-w-md md:max-w-2xl mx-auto h-dvh pt-8 pb-5">
                {
                    currentNumber === null ?
                        <div className={`${RING} p-5.5 shadow-[0_12px_28px_rgba(0,0,0,0.4)]`}>
                            <div className="h-21 rounded-full bg-white px-6 flex items-center justify-center">
                                <span className="text-[34px] md:text-5xl text-black leading-none whitespace-nowrap pt-1.5">Bingo Machine!</span>
                            </div>
                        </div>
                        :
                        <Ball className="w-32 h-32 p-5.5 shadow-[0_12px_28px_rgba(0,0,0,0.4)]" textClassName="text-5xl pt-1.5">
                            {currentNumber}
                        </Ball>
                }

                <section className="flex flex-col items-center gap-3.5">
                    <button onClick={handleClick} disabled={isDisabled || !remaining.length} className={`${RING} p-1.25 shadow-[0_6px_16px_rgba(0,0,0,0.35)] disabled:opacity-60 disabled:cursor-not-allowed`}>
                        <span className="block rounded-full bg-white px-8 pt-3.5 pb-2.5 text-2xl text-black">{remaining.length ? 'Click to Start' : 'No more numbers'}</span>
                    </button>
                    <button onClick={handleReset} disabled={isDisabled} className="text-xl text-white px-4 py-2 min-h-11 text-outline">Reset</button>
                </section>

                <section className="w-full flex-1 min-h-0 bg-black/30 border border-white/15 rounded-[20px] px-3.5 py-4 flex flex-col items-center gap-3.5 overflow-auto">
                    <div className="flex items-baseline gap-2.5">
                        <h2 className="text-[26px] md:text-3xl text-white text-outline">Drawn numbers!</h2>
                        <span className="text-lg text-white text-outline">{drawn.length}/90</span>
                    </div>
                    {
                        drawn.length ?
                            <ul className="grid grid-cols-5 md:grid-cols-8 gap-x-1.5 gap-y-2.5 justify-items-center w-full">
                                {
                                    [...drawn].sort((a, b) => a - b).map((n) => (
                                        <li key={n}>
                                            <Ball className={`w-14.5 h-14.5 p-2 shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${n === lastDrawn ? 'outline-3 outline-white outline-offset-2' : ''}`} textClassName="text-[22px] pt-1">
                                                {n}
                                            </Ball>
                                        </li>
                                    ))
                                }
                            </ul>
                            :
                            <p className="text-base text-white text-outline text-center">Press Click to Start!</p>
                    }
                </section>
            </div>
        </>
    );
};

export default App;

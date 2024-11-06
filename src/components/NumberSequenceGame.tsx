import React, { useState, useEffect } from "react";

const Game = () => {
  const [points, setPoints] = useState(5);
  const [numbers, setNumbers] = useState<any[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [timer, setTimer] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [status, setStatus] = useState("LET'S PLAY");
  const [isRunning, setIsRunning] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [fadingNumbers, setFadingNumbers] = useState({});
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (autoPlay && currentNumber <= points) {
      const timer = setTimeout(() => handleNumberClick(currentNumber), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentNumber, autoPlay]);

  const generateRandomPositions = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      num: i + 1,
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 80}%`,
    }));
  };

  const startGame = () => {
    setNumbers(generateRandomPositions(points));
    setCurrentNumber(1);
    setTimer(0);
    setStatus("LET'S PLAY");
    setIsRunning(true);
    setAutoPlay(false);
    setIsPlay(true);
    setFadingNumbers({});
    setCountdowns({});
  };

  const restartGame = () => {
    setNumbers(generateRandomPositions(points));
    setCurrentNumber(1);
    setTimer(0);
    setStatus("LET'S PLAY");
    setIsRunning(true);
    setAutoPlay(false);
    setFadingNumbers({});
    setCountdowns({});
  };

  const toggleAutoPlay = () => {
    setAutoPlay((prevAutoPlay) => !prevAutoPlay);
    setIsRunning(true);
  };

  const handleNumberClick = (number) => {
    if (number === currentNumber) {
      setFadingNumbers((prev) => ({ ...prev, [number]: true }));
      setCountdowns((prev) => ({ ...prev, [number]: 3 }));

      const countdownInterval = setInterval(() => {
        setCountdowns((prev) => {
          const updatedCountdowns = { ...prev };
          if (updatedCountdowns[number] > 1) {
            updatedCountdowns[number] -= 1;
          } else {
            clearInterval(countdownInterval);
          }
          return updatedCountdowns;
        });
      }, 1000);

      setTimeout(() => {
        setNumbers((prev) => prev.filter((num) => num.num !== number));
        setFadingNumbers((prev) => {
          const updated = { ...prev };
          delete updated[number];
          return updated;
        });
        setCountdowns((prev) => {
          const updated = { ...prev };
          delete updated[number];
          return updated;
        });
      }, 3000);

      setCurrentNumber(currentNumber + 1);

      if (currentNumber === points) {
        setStatus("ALL CLEARED");
        setIsRunning(false);
        setAutoPlay(false);
      }
    } else {
      setStatus("GAME OVER");
      setIsRunning(false);
      setAutoPlay(false);
    }
  };

  return (
    <div className="w-[500px] h-[700px] border p-5">
      <h2
        className={`${status === "ALL CLEARED" && "text-green-500"} ${
          status === "GAME OVER" && "text-red-500"
        } font-semibold`}
      >
        {status}
      </h2>
      <div className="flex items-center gap-10">
        Points:
        <input
          type="number"
          className="p-1 border w-[50px]"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          disabled={isRunning}
        />
      </div>
      <div className="flex items-center gap-10">
        Time: <p>{timer.toFixed(1)}s</p>
      </div>
      {isPlay ? (
        <div className="space-x-4">
          <button
            className="border bg-slate-200 px-2.5 py-1"
            onClick={restartGame}
          >
            Restart
          </button>
          {status === `LET'S PLAY` ? (
            <button
              className="border bg-slate-200 px-2.5 py-1"
              onClick={toggleAutoPlay}
            >
              Auto Play {autoPlay ? "ON" : "OFF"}
            </button>
          ) : null}
        </div>
      ) : (
        <button className="border bg-slate-200 px-2.5 py-1" onClick={startGame}>
          Play
        </button>
      )}

      <div className="w-[460px] h-[500px] mt-5 border relative">
        {numbers.map(({ num, top, left }) => (
          <div
            key={num}
            style={{
              top,
              left,
              background: fadingNumbers[num] ? "red" : "white",
              opacity: fadingNumbers[num] ? 0 : 1,
              transition: fadingNumbers[num]
                ? "opacity 3s ease, color 1s"
                : "none",
            }}
            className="absolute size-8 bg-[#f4f4f4] rounded-full border flex flex-col items-center justify-center cursor-pointer"
            onClick={() => handleNumberClick(num)}
          >
            {num}

            <p className="absolute -bottom-1 text-[8px]">{countdowns[num]}</p>
          </div>
        ))}
      </div>
      <div>Next: {currentNumber}</div>
    </div>
  );
};

export default Game;

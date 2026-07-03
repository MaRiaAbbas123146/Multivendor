import React, { useState } from 'react'
import { useEffect } from 'react';

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(data.Finish_Date) - +new Date();
    if (difference <= 0) return {};

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {         // setInterval instead of setTimeout
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);        // clean up on unmount
  }, [data.Finish_Date]);                     // re-run only if the target date changes

  const timerComponents = Object.keys(timeLeft).map((interval) => (
    <span key={interval} className="text-[25px] text-[#475ad2]">
      {String(timeLeft[interval]).padStart(2, "0")} {interval}{" "}  {/* pad zeros */}
    </span>
  ));

  return (
    <div>
      {timerComponents.length ? timerComponents : (
        <span className="text-red-500 text-[25px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown
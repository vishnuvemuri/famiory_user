import React, { useState, useEffect } from 'react';
import { calculateCountdown } from '../utils/dateUtils';
import { CountdownTime } from '../types';

interface CountdownTimerProps {
  targetDate: Date | null;
  targetTime?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, targetTime }) => {
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const updateCountdown = () => {
      const newCountdown = calculateCountdown(targetDate, targetTime);
      setCountdown(newCountdown);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  const formatValue = (value: number): string => {
    return targetDate ? value.toString() : '--';
  };

  return (
    <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white rounded-lg p-6 mb-8 shadow-lg">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">Countdown to the Wedding</h2>
      </div>
      
      <div className="flex justify-around text-center">
        <div className="p-4">
          <div className="text-4xl font-bold text-yellow-400 mb-2">{formatValue(countdown.days)}</div>
          <div className="text-sm uppercase tracking-wide opacity-80">Days</div>
        </div>
        <div className="p-4">
          <div className="text-4xl font-bold text-yellow-400 mb-2">{formatValue(countdown.hours)}</div>
          <div className="text-sm uppercase tracking-wide opacity-80">Hours</div>
        </div>
        <div className="p-4">
          <div className="text-4xl font-bold text-yellow-400 mb-2">{formatValue(countdown.minutes)}</div>
          <div className="text-sm uppercase tracking-wide opacity-80">Minutes</div>
        </div>
        <div className="p-4">
          <div className="text-4xl font-bold text-yellow-400 mb-2">{formatValue(countdown.seconds)}</div>
          <div className="text-sm uppercase tracking-wide opacity-80">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
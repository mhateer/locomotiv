import React, { useState, useEffect } from 'react';

const TimeZoneClock = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const options = {
        timeZone: 'America/New_York',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      };
      setCurrentTime(new Date().toLocaleTimeString('en-US', options));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div className="current-time">{currentTime || 'Loading...'}</div>;
};

export default TimeZoneClock;

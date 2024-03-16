import React, { useState, useEffect } from 'react';
import './Timetable.css';

const Timetable = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [pause, setPause] = useState(false);
  const [stopped, setStopped] = useState(true);
  const [started, setStarted] = useState(false);
  const [weeklyTime, setWeeklyTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalTimeTracked, setTotalTimeTracked] = useState(0);
  const [secondsEnabled, setSecondsEnabled] = useState(false);

  const enableSeconds = () => {
    setSecondsEnabled(!secondsEnabled);
  };

  const handleStart = () => {
    if (!pause && !started) {
      setStarted(true);
      setStopped(false);
    }
  };

  const handlePause = () => {
    setPause(!pause);
  };

  const handleStop = () => {
    setStopped(true);
    setStarted(false);
    setPause(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  useEffect(() => {
    let timer;
    if (!stopped && !pause) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds >= 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes >= 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              } else {
                return prevMinutes + 1;
              }
            });
            return 0;
          } else {
            return prevSeconds + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stopped, pause]);

  return (
    <div className='timetableWrap'>
      <header className='headerWrap'>
        <h1>My Timetable</h1>
        <p>You've worked {weeklyTime} hours this week!</p>
      </header>
      <div className='currentWrap'>
        <h3>Current work period:</h3>
      </div>
      <div className='timeWrap'>
        <h2>{hours} hours</h2>
        <h2>{minutes} minutes</h2>
        {secondsEnabled && <h2>{seconds} seconds</h2>}
      </div>
      <div className='buttonWrap'>
        <button onClick={handleStart}>Clock in</button>
        <button onClick={handlePause}>{pause ? 'Unpause time' : 'Pause time'}</button>
        <button onClick={handleStop}>Clock out</button>
      </div>
      <div className='settingsButton'>
        <button onClick={() => setOpenMenu(!openMenu)}>{openMenu ? 'Close settings' : 'Settings'}</button>
      </div>
      <div className={`settingsWrap ${openMenu ? 'active' : 'inactive'}`}>
        <div className='settingsContent1'>
          <div className='enableSeconds'>
            Enable seconds <input type='checkbox' checked={secondsEnabled} onChange={enableSeconds} />
          </div>
          <div className='changeTime'>
            Manually change time
            <div className='changeHours'>
              <input placeholder='hours' className='hoursInput' />
              hours
            </div>
            <div className='changeMinutes'>
              <input placeholder='minutes' className='minutesInput' />
              minutes
            </div>
            <div className='changeButtons'>
              <button className='hoursButton'>Add hours</button>
              <button className='minutesButton'>Subtract hours</button>
            </div>
          </div>
        </div>
        <div className='settingsContent2'>
          <div className='resetButton'>
            <button onClick={() => setStopped(true)}>Reset time</button>
            {stopped && (
              <div className='areYouSure'>
                <p>Are you sure? This will reset your week's hours so far.</p>
                <button onClick={() => setTotalTimeTracked(0)}>Yes</button>
                <button onClick={() => setStopped(false)}>No</button>
              </div>
            )}
          </div>
          <div className='timeTracked'>
            Total time tracked: <span>{totalTimeTracked}</span> hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;

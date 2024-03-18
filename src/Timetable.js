import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from "./store/hooks.ts";
import './Timetable.css';

const Timetable = () => {
  const {weeklyTime, totalTime, currentTime } = useStoreState((store) => store)
  //set time
  const [trackWeeklyTime, setTrackWeeklyTime] = useState(0);
  const [trackTotalTime, setTrackTotalTime] = useState(0);
  const [ trackCurrentTime, setTrackCurrentTime] = useState(0);
  const { updateDataThunk } = useStoreActions((store) => store);
  //menu stuff
  const [openMenu, setOpenMenu] = useState(false);
  const [refreshed, setRefreshed] = useState(false)
  const [pause, setPause] = useState(false);
  const [stopped, setStopped] = useState(true);
  const [started, setStarted] = useState(false);
  const [secondsEnabled, setSecondsEnabled] = useState(
  localStorage.getItem('secondsEnabled') === 'true');
  const [reset, setReset ] = useState(false);
  //time logic
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [storedTime, setStoredTime] = useState(null);

  useEffect(() => {
    const myStoredTime = localStorage.getItem('timerState');
  }, []);

  useEffect(() => {
    localStorage.setItem('secondsEnabled', secondsEnabled);
  }, [secondsEnabled]);

  const setTimeTracked = () => {
    updateDataThunk({
      weeklyTime: trackWeeklyTime,
      totalTime: trackTotalTime,
      currentTime: trackCurrentTime,
    })
  }

  const enableSeconds = () => {
    setSecondsEnabled(!secondsEnabled);
  };

  const handleStart = () => {
    if (!pause && stopped) {
      setStopped(false);
    } else if (pause || !stopped){
      return;
    }
  };

  const handlePause = () => {
    setPause(!pause);
  };

  const handleStop = () => {
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    setTrackWeeklyTime(prevWeeklyTime => prevWeeklyTime + totalMinutes);
    setTrackWeeklyTime(prevTotalTime => prevTotalTime + totalMinutes);
    setTimeTracked();
    console.log(totalTime)
    // Reset other states
    setStopped(true);
    setStarted(false);
    setPause(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const shownWeeklyTime = weeklyTime / 60;
  const shownTotalTime = weeklyTime / 60;

  const handleRestore = () => {
    if (storedTime) {
      const { savedHours, savedMinutes, savedSeconds } = JSON.parse(storedTime);
      setHours(savedHours);
      setMinutes(savedMinutes);
      setSeconds(savedSeconds);
    }
  };

  const handleErase = () => {
    localStorage.removeItem('timerState');
    setStoredTime(null);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  useEffect(()=> {
    let timer;
    if(!stopped && !pause){
      timer = setInterval(()=> {
        const totalMinutes = hours * 60 + minutes + seconds / 60;
        setTrackCurrentTime(prevCurrentTime => prevCurrentTime + totalMinutes)
        setTrackWeeklyTime(prevWeeklyTime => prevWeeklyTime + totalMinutes)
        setTrackTotalTime(prevTotalTime => prevTotalTime + totalMinutes)
        setTimeTracked();
      }, 1000)
    }
    return () => clearInterval(timer);
  }, [stopped, pause])

  useEffect(() => {
    let timer;
    const timerState = JSON.stringify({ savedHours: hours, savedMinutes: minutes, prevSeconds: seconds });
    localStorage.setItem('timerState', timerState);
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

  const resetWeek = () => {
    setTrackWeeklyTime(0)
    setTimeTracked()
    setReset(false)
  }

  return (
    <div className='timetableWrap'>
      <header className='headerWrap'>
        <h1>My Timetable</h1>
        <p>You've worked {Math.floor(shownWeeklyTime)} hours this week!</p>
      </header>
      <div className='currentWrap'>
        <h3>Current work period:</h3>
      </div>
      <div className='timeWrap'>
        <h2>{hours} hours</h2>
        <h2>{minutes} minutes</h2>
        <h2 style={{
          display:
          secondsEnabled ? 'block' : 'none'
        }}>{seconds} seconds</h2>
      </div>
      <div className='buttonWrap'>
        <button onClick={handleStart}>Clock in</button>
        <button onClick={handlePause}>{pause ? 'Unpause time' : 'Pause time'}</button>
        <button onClick={handleStop}>Clock out</button>
      </div>
      <div className='settingsButton'>
        <button onClick={() => setOpenMenu(!openMenu)}>{openMenu ? 'Close settings' : 'Settings'}</button>
      </div>
      <button onClick={handleRestore}>Restore</button>
      <button onClick={handleErase}>Erase</button>
      {refreshed &&<button>Close modal</button>}
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
            <button onClick={() => setReset(true)}>Reset time</button>
            {reset && (
              <div className='areYouSure'>
                <p>Are you sure? This will reset your week's hours so far.</p>
                <button onClick={() => resetWeek()}>Yes</button>
                <button onClick={() => setReset(false)}>No</button>
              </div>
            )}
          </div>
          <div className='timeTracked'>
            Total time tracked: <span>{Math.floor(shownTotalTime)}</span> hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
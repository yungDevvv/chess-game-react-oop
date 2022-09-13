import React, { FC, useEffect, useRef, useState } from 'react'
import { Colors } from '../models/Colors';
import { Player } from '../models/Player';

interface TimerComponentProps {
   restart(): void;
   currentPlayer: Player;
}

const TimerComponent: FC <TimerComponentProps> = ({restart, currentPlayer}) => {
  const [blackTime, setBlackTime] = useState(2000);
  const [whiteTime, setWhiteTime] = useState(2000);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null)

   useEffect(() => {
      startTimer()
   }, [currentPlayer])

   useEffect(() => {
      if(whiteTime < 0 || blackTime < 0) {
         alert(`Time is up, winner: ${currentPlayer.color === Colors.BLACK ? 'White Player' : 'Black Player'}`)
         restart();
         setBlackTime(2000)
         setWhiteTime(2000)
      }
   }, [whiteTime, blackTime])

   function startTimer() {
      if(timer.current) {
         clearInterval(timer.current)
      }
      const callback = currentPlayer.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer
      timer.current = setInterval(callback, 1000)
   }
   function decrementBlackTimer() {
      setBlackTime(prev => prev - 1)
   }
   function decrementWhiteTimer() {
      setWhiteTime(prev => prev - 1)
   }

   const handleRestart = () => {
      if(window.confirm('Are you sure?')) {
         restart();
         setBlackTime(2000)
         setWhiteTime(2000)
      }
   }
   
  return (
    <div className='timer-block'>
      <p>Black player: {blackTime} sec</p>
      <p>White player: {whiteTime} sec</p>
      <button onClick={() => handleRestart()}>Restart game</button>
    </div>
  )
}

export default TimerComponent
import React, {FC} from 'react'

interface StartScreenComponentProps {
   setStartScreenOpen: (state: boolean) => void;
}

const StartScreenComponent: FC <StartScreenComponentProps> = ({setStartScreenOpen}) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      <button onClick={() => setStartScreenOpen(false)} className='start-button button-grad'>START GAME</button>
      <ul className='startscreen-list'>
        <li><span style={{color: 'red'}}>ATTENTION!</span> You will not be able to play on mobile devices because different screen resolutions are not configured</li>
        <li>When the opponent makes a mistake and does not close his king from the check, then when the king is eaten, a window pops up "Game is over!" </li>
        <li>I know inline styles are bad practice, but the whole idea is logic :)</li>
        <li>The King cannot move on potential lost moves, they are highlighted with red circles</li>
        <li>When the opponent is put in check, a warning window is displayed</li>
      </ul>
    </div>
  )
}

export default StartScreenComponent
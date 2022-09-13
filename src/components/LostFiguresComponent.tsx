import React, { FC } from 'react'
import { Figure } from '../models/Figure';

interface LostFiguresProps {
   title: string;
   figures: Figure[];
}

export const LostFiguresComponent: FC <LostFiguresProps> = ({title, figures}) => {
  return (
    <div className='lostfigures-block'>
      <h3 style={{fontSize: '20px', marginBottom: '5px', textAlign: 'center', color: 'black'}}>{title}</h3>
      <div className='lostfigures-list'>{figures.map(item => <p key={item.id} style={{display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '6px 9px'}}><img width={30} height={30} src={item.logo} alt={item.logo} /><span>{item.name}</span></p>)}</div>
      
    </div>
  )
}


export default LostFiguresComponent
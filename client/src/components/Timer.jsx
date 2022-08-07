import React, { useContext } from 'react'
import { AppContext } from "../App";

function Timer() {
  const { timeGame } = useContext(AppContext);
  return (
    <div className='timer'>{timeGame}</div>
  )
}

export default Timer
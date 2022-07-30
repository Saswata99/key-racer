import { useContext } from 'react'
import { AppContext } from '../App';

function InputBox() {

  const { inputValue, handleInput } = useContext(AppContext) 

  return (
    <input 
      type='input'
      onChange={e => handleInput(e)}
      value={inputValue}
      style={{
        flexGrow: 1,
        margin: '5px'
      }}
    />
  )
}

export default InputBox
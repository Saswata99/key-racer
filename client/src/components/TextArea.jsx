import React, { useContext } from 'react'
import { AppContext } from '../App'

function TextArea() {
  
  const { 
    wordsArray, 
    currentIndex, 
    inputValue 
  } = useContext(AppContext)

  return (
    <div className='text-area'>
      {wordsArray.map((word, wordIndex) =>
        <span
        key={wordIndex}
        className={
          currentIndex===wordIndex ? "underline": ""}
        >
          {word.split('').map((letter, letterIndex) =>
            <span
            key={letterIndex}
            className={
              wordIndex <= currentIndex ?
                wordIndex === currentIndex ?
                  inputValue[letterIndex] ?
                    word.substring(0, letterIndex+1)===inputValue.substring(0, letterIndex+1) ? 
                      "green"
                      : "red"
                    : ""
                  : "green"  
                : ""
            }
            >
              {letter}
            </span>
          )}
        </span>
      )}
    </div>
  )
}

export default TextArea
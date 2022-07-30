import { useContext } from 'react'
import { AppContext } from '../App'

function ProgressBar() {

  const {
    wordsArray,
    currentIndex
  } = useContext(AppContext)
  
  const temp = currentIndex / wordsArray.length * 100
  const progress = isNaN(temp)? 0 : temp

  return (
    <progress 
      id="file" 
      max="100" 
      value= {progress}
    />
  )
}

export default ProgressBar
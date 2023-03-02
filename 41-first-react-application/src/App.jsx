import { useState } from 'react'
import Clicker from './Clicker'

export default function App() {
  const [ hasClicker, setHasClicker ] = useState(true)

  const toggleClickerClick = () => {
    setHasClicker(!hasClicker)
  }

  return <>
    <button onClick={ toggleClickerClick }>{ hasClicker ? 'Clear' : 'Show' } Clicker</button>
    { hasClicker ? <Clicker /> : null }
  </>
}

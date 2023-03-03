import { useState } from 'react'
import Clicker from './Clicker'

export default function App({ children }) {
  const [ hasClicker, setHasClicker ] = useState(true)
  const [ count, setCount ] = useState(0)

  const toggleClickerClick = () => {
    setHasClicker(!hasClicker)
  }

  const increment = () => {
    setCount(count + 1)
  }

  return <>
    { children }

    <div>Total count: { count }</div>

    <button onClick={ toggleClickerClick }>{ hasClicker ? 'Clear' : 'Show' } Clicker</button>
    { hasClicker && <>
      <Clicker increment={ increment } keyName="countA" color={ `hsl(${ Math.random() * 360 }deg, 100%, 30%)` } />
      <Clicker increment={ increment } keyName="countB" color={ `hsl(${ Math.random() * 360 }deg, 100%, 30%)` } />
      <Clicker increment={ increment } keyName="countC" color={ `hsl(${ Math.random() * 360 }deg, 100%, 30%)` } />
    </> }
  </>
}

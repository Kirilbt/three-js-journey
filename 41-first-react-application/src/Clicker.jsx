import { useState, useEffect } from 'react'

export default function Clicker({ increment, keyName, color }) {
  const [ count, setCount ] = useState(parseInt(localStorage.getItem(keyName) ?? 0))

  useEffect(() => {
    return () => {
      localStorage.removeItem(keyName)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(keyName, count)
  }, [ count ])

  const buttonCLick = () => {
    setCount(count + 1)
    increment()
  }

  return <div>
    <div style={{ color: color }}>Clicks count: { count }</div>
    <button onClick={ buttonCLick }>Click me</button>
  </div>
}

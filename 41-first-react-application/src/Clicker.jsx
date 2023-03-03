import { useState, useEffect } from 'react'

export default function Clicker({ keyName, color = 'darkORchid' }) {
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
  }

  return <div>
    <div style={{ color: color }}>Clicks count: { count }</div>
    <button onClick={ buttonCLick }>Click me</button>
  </div>
}

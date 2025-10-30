import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import JsonViewer from './components/JsonViewer.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <JsonViewer />
    </>
  )
}

export default App

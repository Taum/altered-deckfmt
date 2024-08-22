import { useCallback, useState } from 'react'
import './App.css'
import React from 'react'

function App() {
  const [textList, setTextList] = useState("")
  const [encodedList, setEncodedList] = useState("")

  const doEncode = useCallback(() => {
    setEncodedList(encodeList(textList))
  }, [])

  return (
    <>
      <h1>Encode a deck list</h1>

      <div className="">
        <div className="">
          <textarea id="encodeDecklist" rows={30} cols={40}></textarea>
        </div>
        <button type="button" onClick={doEncode}>encode</button>
        - tests:
        <button type="button" onClick={testYzmir}>Yzmir</button>
        <p className="result mono">
          {encodedList}
        </p>
      </div>
    </>
  )
}

export default App

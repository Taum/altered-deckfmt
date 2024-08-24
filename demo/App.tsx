import { useCallback, useEffect, useState } from 'react'
import './App.css'
import React from 'react'

import { decodeList } from '../src/index'

function App() {
  const [textList, setTextList] = useState("")
  const [encodedList, setEncodedList] = useState("")

  // const doEncode = useCallback(() => {
  //   setEncodedList(encodeList(textList))
  // }, [])

  // const testYzmir = useCallback(() => {
    
  // })

  useEffect(() => {
    // An simple Yzmir decklist with no uniques
    const enc = "ECAk0jEoUoInItIlUqUkUmErEuYwKLkyGxo2E4Y+E+QEuLhK1TpMGMRNlOCPRfpOROUA"
    setEncodedList(enc)
    const decodedList = decodeList(enc)
    setTextList(decodedList)
  }, [])

  return (
    <>
      <h1>Encode a deck list</h1>

      <div className="">
        <div className="">
          <textarea id="encodeDecklist" rows={30} cols={40} value={textList} readOnly={true}></textarea>
        </div>
        <p className="result mono">
          {encodedList}
        </p>
      </div>
    </>
  )
}

export default App

import { useEffect, useState } from "react"
import React from 'react'

import { decodeList } from '../../src/index'

export default function DecodeTest() {

  const [textList, setTextList] = useState("")
  const [encodedList, setEncodedList] = useState("ECAk0jEoUoInItIlUqUkUmErEuYwKLkyGxo2E4Y+E+QEuLhK1TpMGMRNlOCPRfpOROUA")

  useEffect(() => {
    try {
      const decodedList = decodeList(encodedList)
      setTextList(decodedList)
    } catch (e) {
      setTextList("Error: " + e.message)
    }
  }, [encodedList])

  useEffect(() => {
    // Init with a test list

    // An simple Yzmir decklist with no uniques
    setEncodedList("ECAk0jEoUoInItIlUqUkUmErEuYwKLkyGxo2E4Y+E+QEuLhK1TpMGMRNlOCPRfpOROUA")
  }, [])

  return (
    <>
      <h2>Decode a deck list</h2>
      <div className="">
        <p>Encoded value:</p>
        <p>
          <input
            id="decodeInput"
            type="text"
            defaultValue={encodedList}
            onChange={(e) => setEncodedList(e.target.value)}
            />
        </p>
        <p>Result</p>
        <textarea id="decodeResult" rows={30} cols={40} value={textList} readOnly={true}></textarea>
      </div>
    </>
  )
}
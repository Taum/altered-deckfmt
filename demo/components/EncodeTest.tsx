import { useEffect, useState } from "react"
import React from 'react'

import { encodeList } from '../../src/index'

export default function EncodeTest() {

  const [textList, setTextList] = useState("")
  const [encodedList, setEncodedList] = useState("ECAk0jEoUoInItIlUqUkUmErEuYwKLkyGxo2E4Y+E+QEuLhK1TpMGMRNlOCPRfpOROUA")
  const [error, setError] = useState<Error | undefined>(undefined)

  const initialList = "1 ALT_CORE_B_YZ_02_C\n3 ALT_CORE_B_LY_28_C\n2 ALT_CORE_B_NE_1_C"

  useEffect(() => {
    try {
      const encoded = encodeList(textList)
      setEncodedList(encoded)
    } catch (e) {
      setError(e)
    }
  }, [textList])

  useEffect(() => {
    // Init with a test list

    // An simple Yzmir decklist with no uniques
    setTextList(initialList)
  }, [])

  return (
    <>
      <h2>Encode a deck list</h2>
      <div className="">
        <p>Decklist:</p>
        <p>
          <textarea id="encodeInput" rows={20} cols={40}
          defaultValue={initialList}
          onChange={(e) => setTextList(e.target.value)}></textarea>
        </p>
        <p>Result</p>
        {!error &&
          <p className="result mono">
            {encodedList}
          </p>
        }
        {error && 
          <p className="error mono">
            Error: {error.message}
          </p>
        }
      </div>
    </>
  )
}
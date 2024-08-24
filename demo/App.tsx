import { useCallback, useEffect, useState, ChangeEvent } from 'react'
import './App.css'
import React from 'react'
import DecodeTest from './components/DecodeTest'
import EncodeTest from './components/EncodeTest'

function App() {
  return (
    <>
      <EncodeTest />
      <DecodeTest />
    </>
  )
}

export default App

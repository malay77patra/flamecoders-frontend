import React from 'react'
import Navbar from '@/components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Auth from '@/pages/Auth'

export default function App() {
  return (
    <>
      <Navbar />
      <div className='p-4'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </>
  )
}

import React from 'react'
import Navbar from '@/components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Auth from '@/pages/Auth'
import Verify from './pages/Verify'
import Admin from './pages/Admin'

export default function App() {
  return (
    <>
      <Navbar />
      <div className='p-2 md:p-4'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </>
  )
}

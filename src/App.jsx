import React from 'react'
import Navbar from '@/components/ui/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Settings from './pages/Settings'
import Post from './pages/Post'

export default function App() {
  return (
    <>
      <Navbar />
      <div className='p-2 md:p-4'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/post/:id" element={<Post />} />
        </Routes>
      </div>
    </>
  )
}

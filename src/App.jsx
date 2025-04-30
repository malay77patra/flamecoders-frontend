import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Settings from '@/pages/Settings'
import Post from '@/pages/Post'
import Dashboard from '@/pages/Dashboard'
import DefaultLayout from '@/layouts/DefaultLayout'
import BackLayout from '@/layouts/BackLayout'
import AuthorizedLayout from '@/layouts/AuthorizedLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<BackLayout />}>
        {/* Public routes  */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<DefaultLayout />}>
        {/* Public routes  */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />

        {/* Protected routes  */}
        <Route element={<AuthorizedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

    </Routes>
  );
}

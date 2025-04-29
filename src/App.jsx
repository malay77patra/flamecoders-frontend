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
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default options that apply to all queries
      staleTime: 0, // Consider data stale immediately (good for your use case)
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnMount: true, // Refetch when component mounts
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

import React from 'react'
import RLoader from '@/components/RLoader'

export default function Loading() {
  return (
    <div className='flex justify-center pt-[30vh]'>
        <RLoader size='3rem' />
    </div>
  )
}

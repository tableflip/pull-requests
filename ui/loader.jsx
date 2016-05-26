import React from 'react'

export default function ({ loading }) {
  if (!loading) return null
  return (
    <div className='browser-screen-loading-content m-b-1'>
      <div className='loading-dots dark-gray'>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  )
}

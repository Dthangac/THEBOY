import React from 'react'

const Title = ({text1,text2,text3}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500'>{text1} <span className='text-gray-700 font-medium'>{text2}</span> {text3}</p>
      
    </div>
  )
}

export default Title

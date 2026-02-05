import React from 'react'
import Header from '../Header/Header.jsx'
const LoyOut = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default LoyOut
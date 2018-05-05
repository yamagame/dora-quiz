import React from 'react'

export default function({ style, children, ...props }) {
  return (
    <div className="App-Row" style={ { flex:1, ...style } }>
      { children }
    </div>
  )
}

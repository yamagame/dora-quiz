import React from 'react'

export default function({ title, disabled, fontSize, onClick, style }) {
  return (!disabled) ? (
    <div>
      <button style={{
        margin: (fontSize/2<15) ? 15 : fontSize/2,
        fontSize: fontSize*0.5,
        height: fontSize,
        width: fontSize,
        ...style,
      }}
      onClick={onClick}
      disabled> { title } </button>
    </div>
  ) : (
    <div>
      <button style={{
        margin: (fontSize/2<15) ? 15 : fontSize/2,
        fontSize: fontSize*0.5,
        height: fontSize,
        width: fontSize,
        ...style,
      }}
      onClick={onClick}> { title } </button>
    </div>
  )
}

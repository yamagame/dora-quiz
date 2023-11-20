import React from "react";

export default function PageButton({ title, disabled, fontSize, onClick, style }) {
  const margin = fontSize / 2 < 15 ? 15 : fontSize / 2;
  return !disabled ? (
    <div>
      <button
        style={{
          marginTop: margin,
          marginLeft: margin,
          marginRight: margin,
          fontSize: fontSize * 0.5,
          height: fontSize,
          width: fontSize,
          ...style,
        }}
        onClick={onClick}
        disabled
      >
        {" "}
        {title}{" "}
      </button>
    </div>
  ) : (
    <div>
      <button
        style={{
          marginTop: margin,
          marginLeft: margin,
          marginRight: margin,
          fontSize: fontSize * 0.5,
          height: fontSize,
          width: fontSize,
          ...style,
        }}
        onClick={onClick}
      >
        {" "}
        {title}{" "}
      </button>
    </div>
  );
}

import React from "react";

export default function Column({ style, children, ...props }) {
  return (
    <div className="App-Column" style={{ flex: 1, ...style }}>
      {children}
    </div>
  );
}

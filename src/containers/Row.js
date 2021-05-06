import React from "react";

export default function ({ style, children, flex = true, ...props }) {
  if (flex) {
    return (
      <div className="App-Row" style={{ flex: 1, ...style }}>
        {children}
      </div>
    );
  }
  return <div style={{ ...style }}>{children}</div>;
}

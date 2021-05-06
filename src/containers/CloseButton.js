import React, { Component } from "react";

class CloseButton extends Component {
  render() {
    return (
      <div
        style={{ position: "absolute", top: 0, right: 5 }}
        onClick={() => window.close()}
      >
        <svg
          width={17}
          height={12}
          viewport="0 0 12 12"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="1"
            y1="11"
            x2="11"
            y2="1"
            stroke="#A0A0A0"
            strokeWidth="2"
          />
          <line
            x1="1"
            y1="1"
            x2="11"
            y2="11"
            stroke="#A0A0A0"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }
}

CloseButton.defaultProps = {};

export default CloseButton;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { fontSize } from '../reducers'

class Bar extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const {
      width,
      height,
      value,
      minValue,
      maxValue,
      color,
      bgColor,
      label,
      fontSize,
    } = this.props;
    const maxRange = maxValue-minValue;
    return (
      <div style={{ margin: 8, }}>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          <rect
            x={0}
            y={height*(1-maxRange/maxRange)}
            width={width}
            height={height*maxRange/maxRange}
            style={{ fill: bgColor, strokeWidth: 0, }}
          />
          <rect
            x={0}
            y={height*(1-(value-minValue)/maxRange)}
            width={width}
            height={height*(value-minValue)/maxRange}
            style={{ fill: color, strokeWidth: 0, }}
          />
        </svg>
        <p style={{ fontSize, margin: 0, padding: 0, }}> { label } </p>
        <p style={{ fontSize, margin: 0, padding: 0, }}> { value } </p>
      </div>
    )
  }
}

Bar.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  style: {},
  width: 100,
  height: 200,
  minValue: 0,
  maxValue: 200,
  value: 0,
  bgColor: 'lightgray',
  color: '#FF0000',
  label: '',
}

export default Bar;

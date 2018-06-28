import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fontSize } from '../reducers'

class Button extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.state.fade = false
    this.state.pushed = false
    this.fadingDone = this.fadingDone.bind(this)
  }

  componentDidMount () {
    const elm = this.button
    elm.addEventListener('animationend', this.fadingDone)
  }

  componentWillUnmount () {
    const elm = this.button
    elm.removeEventListener('animationend', this.fadingDone)
  }

  fadingDone () {
    this.setState({fade: false})
  }

  onClick = () => {
    // this.setState({fade: true});
    if (this.props.onClick) this.props.onClick();
  }

  onMouseDown = () => {
    this.setState({pushed: true});
  }

  onMouseEnter = () => {
    this.setState({pushed: false});
  }
  
  onMouseLeave = () => {
    this.setState({pushed: false});
  }

  onMouseUp = () => {
    this.setState({pushed: false});
  }

  backgroundColor = () => {
    if (this.state.pushed) return this.props.selectedColor;
    if (this.props.selected) return this.props.selectedColor;
    if (this.props.buttonStyle == 'article') {
      return 'white';
    }
    return '#CDF';
  }

  render() {
    const fade = this.state.fade
    const scale = this.props.fontScale || 1;
    const fontSize = this.props.fontSize;
    const height = (this.props.height) ? this.props.height+fontSize*2/4+10 : null;
    const containerStyle = {
      zIndex: this.props.correct ? 2 : 1,
      paddingBottom: fontSize*1/4,
    }
    if (height) containerStyle.height = height;
    return (
      <div className="Button-Container" style={containerStyle}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {/* this.props.children */}
        <div style={{ height: '100%' }}>
          <div className={['Button-Key', fade ? 'Button-Key-Fade' : '', this.props.correct ? 'Button-Key-Correct' : ''].join(' ')}
            ref={ bt => this.button = bt }
            type="button"
            style={ {
              fontSize: `${parseInt(fontSize*scale, 10)}px`,
              backgroundColor: this.backgroundColor(),
              height: this.props.height,
              paddingTop: this.props.paddingTop,
              margin: this.props.margin,
              marginTop: 0,
              textAlign: (this.props.buttonStyle === 'article') ? 'left' : 'center',
            }}
          >
            {this.props.children}
            {/* <span
              style={{ position: 'relative', top: '0%', }} >
                {this.props.value}
            </span> */}
          </div>
        </div>
      </div>
    )
  }
}

Button.defaultProps = {
  // width: window.innerWidth,
  // height: window.innerHeight,
  selectedColor: '#a9ff00',
  selected: false,
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  height: null,
  paddingTop: null,
  margin: null,
  correct: false,
  fontScale: 1,
  buttonStyle: 'normal',
}

export default connect(
  state => ({
    fontSize: state.app.fontSize,
    // width: state.app.width,
    // height: state.app.height,
  })
)(Button);

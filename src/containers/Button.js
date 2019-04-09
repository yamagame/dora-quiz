import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fontSize } from '../reducers'

const notSelectable = {
  userSelect: 'none',
}

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
    if (this.state.pushed) return (this.props.pushedColor) ? this.props.pushedColor : this.props.selectedColor;
    if (this.props.selected) return this.props.selectedColor;
    if (this.props.buttonStyle == 'article') {
      return 'white';
    }
    return this.props.buttonBaseColor;
  }

  render() {
    const fade = this.state.fade
    const fontScale = this.props.fontScale || 1;
    const fontSize = this.props.fontSize;
    const height = (this.props.height) ? this.props.height : null;
    const containerStyle = {
      zIndex: this.props.correct ? 2 : 1,
      paddingBottom: (this.props.paddingBottom!==null)?this.props.paddingBottom:(fontSize*1/4),
    }
    //if (height) containerStyle.height = height;
    const style = {
      fontSize: `${parseInt(fontSize*fontScale, 10)}px`,
      backgroundColor: this.backgroundColor(),
      color: this.props.fontColor,
      height: this.props.height,
      paddingTop: this.props.paddingTop,
      paddingBottom: this.props.paddingBottom,
      margin: this.props.margin,
      marginTop: 0,
      textAlign: (this.props.buttonStyle === 'article') ? 'left' : 'center',
      ...notSelectable,
    }
    if (this.props.imageButton) {
      delete style.fontSize;
    }
    return (
      <div className="Button-Container" style={containerStyle}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {/* this.props.children */}
        <div style={{ /*height: '100%'*/ }}>
          <div className={['Button-Key', fade ? 'Button-Key-Fade' : '', this.props.correct ? 'Button-Key-Correct' : ''].join(' ')}
            ref={ bt => this.button = bt }
            style={style}
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
  pushedColor: null,
  selectedColor: '#a9ff00',
  selected: false,
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  height: null,
  paddingTop: 5,
  paddingBottom: 5,
  margin: null,
  correct: false,
  fontScale: 1,
  buttonStyle: 'normal',
  imageButton: false,
  fontColor: 'black',
  buttonBaseColor: '#CDF',
}

export default connect(
  state => ({
    fontSize: state.app.fontSize,
    // width: state.app.width,
    // height: state.app.height,
  })
)(Button);

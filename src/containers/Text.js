import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Text extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fontSize: this.props.fontSize,
      fontScale: 1,
      update: false,
    }
    this.resizeTimeout = null;
    //this.resize();
  }

  componentDidMount() {
    this.setState({
      update: false,
    }, () => {
      this.resize();
    });
  }

  componentWillReceiveProps(nextProps) {
    var doResize = false;
    var update = true;
    if (this.props.value !== nextProps.value) {
      doResize = true;
      update = false;
    }
    if (this.props.fontSize !== nextProps.fontSize) {
      doResize = true;
    }
    if (this.props.container !== nextProps.container) {
      // doResize = true;
      // update = true;
    }
    if (doResize) {
      this.setState({
        update,
        fontSize: this.props.fontSize,
      }, () => {
        this.resize();
      });
    }
  }

  _resize(container) {
    if (this.textLabel) {
      const box = ReactDOM.findDOMNode(this.textLabel).getBBox();
      const resize = () => {
        if (box.width < container.offsetWidth) {
          this.setState({
            update: true,
            fontScale: 1,
          });
        } else {
          this.setState({
            update: true,
            fontScale: 0.7,
          });
        }
      }
      if (container) {
        resize();
      }
    }
  }

  resize() {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this._resize(this.props.container);
    }, 100);
  }

  render() {
    const fontSize = this.state.fontSize*this.state.fontScale;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height={(this.props.container) ? this.props.container.offsetHeight: null}>
        {
          (this.state.update) ? <foreignObject x="0" y="0" width="100%" height="100%">
            <div style={{ width: "100%", textAlign: 'left', fontSize, }}>{ this.props.value }</div>
            <div style={{ width: "100%", textAlign: 'left', fontSize: fontSize*0.7, }}> { this.props.comment } </div>
          </foreignObject> : null
        }
        {
          <text ref={ t => this.textLabel = t } style={{ stroke: '#FF0000' }}x="0" y={ -this.props.fontSize } fontSize={ this.props.fontSize }>
            { this.props.value } { this.props.comment }
          </text>
        }
      </svg>
    )
  }
}

Text.defaultProps = {
  value: '',
  comment: '',
  style: {},
  fontSize: 12,
}

export default Text;

import React, { Component } from 'react';
import loadScript from 'load-script'

const SCRIPT = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_HTMLorMML';

let loaded = false;
let timeout = null;
export const update = () => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    (loaded) ? window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]) : loadScript(SCRIPT, this.onLoad);
  }, 100);
}

export const check = (value) => {
  return (value && value.match(/\\\(.+\\\)/));
}

class MathJax extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      value: props.value,
      target: props.target,
    }
  }

  onLoad = (err) => {
    this.setState({
        loaded: true
    })
    loaded = true;
    if (err)
      console.log(err)
    else {
      window.MathJax.Hub.Config({
        showMathMenu: true,
        //tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] },
      })
      update(this.props.target)
    }
  }

  componentDidMount() {
    this.preview.innerText = this.props.value;
    if (check(this.props.value)) {
      this.state.loaded? update(this.props.target): loadScript(SCRIPT, this.onLoad);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.value) return false
    return nextProps.value !== this.state.value
  }

  componentDidUpdate(prevProps, prevState) {
    this.preview.innerText = this.props.value;
    if (check(this.props.value)) {
      this.state.loaded? update(this.props.target) : loadScript(SCRIPT, this.onLoad);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    })
  }

  offsetHeight() {
    return this.preview.offsetHeight;
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={d => {this.preview = d}}
        style={this.props.style}
      >
      </div>
    )
  }
}

export default MathJax;

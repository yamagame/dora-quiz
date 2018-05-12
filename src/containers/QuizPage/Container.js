import React, { Component } from 'react';

class Container extends Component {
  componentDidMount() {
    this.props.onUpdate(this.box());
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    this.props.onUpdate(null);
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.props.onUpdate(this.box());
  }

  box() {
    return {
      offsetWidth: this.container.offsetWidth,
      offsetHeight: this.container.offsetHeight,
    }
  }

  render() {
    return <div ref={ d => this.container = d } style={{ ...this.props.style }}>
      { this.props.children }
    </div>
  }
}

export default Container;

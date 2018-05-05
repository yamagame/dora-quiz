import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fontSize, fontScale, } from '../reducers'

class MenuButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentDidMount() {
    this.setState({
      value: this.props.value,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  handleChange = () => {
  }

  render() {
    return (
      <div className="MenuButton-Container" style={ {...this.props.style} } >
        <input className="MenuButton-Key"
          type={this.props.type}
          value={this.state.value}
          onClick={this.props.onClick}
          onChange={this.handleChange}
          style={ {fontSize: `${fontScale(24)}px` }}
        />
      </div>
    )
  }
}

MenuButton.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
  value: '',
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
}

export default connect(
  state => ({
    fontSize: state.app.fontSize,
    width: state.app.width,
    height: state.app.height,
  })
)(MenuButton);

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';

const m = function() {
  let res = {};
  for (let i = 0; i < arguments.length; ++i) {
    if (arguments[i]) assign(res, arguments[i]);
  }
  return res;
};

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      isNoImage: false,
    };
    this.resizeImage = this.resizeImage.bind(this);
    this.showNoImage = this.showNoImage.bind(this);
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.resizeImage();
  }

  resizeImage() {
    if (ReactDOM.findDOMNode(this.refs.image) == null) {
      return;
    }
    const originalWidth = ReactDOM.findDOMNode(this.refs.image).naturalWidth;
    const originalHeight = ReactDOM.findDOMNode(this.refs.image).naturalHeight;
    const widthRatio = this.props.width / originalWidth;
    const heightRatio = this.props.height / originalHeight;
    const aspectRatio = originalWidth / originalHeight;

    if (originalWidth > originalHeight) {
      this.setState({
        ratio: aspectRatio,
        width: originalWidth * widthRatio,
        height: originalHeight * widthRatio,
      });
    } else {
      this.setState({
        ratio: aspectRatio,
        width: originalWidth * heightRatio,
        height: originalHeight * heightRatio,
      });
    }
  }

  showNoImage() {
    if (this.props.noImageSrc == undefined) {
      return;
    }
    this.setState({
      isNoImage: true,
    });
  }

  render() {
    var marginTop = 0;
    const style = {
      wrapper: {
        position: 'relative',
        width: this.props.width,
        height: this.props.height,
        backgroundColor: this.props.backgroundColor,
      },
      image: {
        position: 'absolute',
        display: 'block',
        left: (this.props.width - this.state.width) / 2,
        top: (this.props.height - this.state.height) / 2,
        width: this.state.width,
        height: this.state.height,
      },
    };
    if (this.state.isNoImage) {
      return (
        <div style={m(this.props.style, style.wrapper)}>
          <img
            ref="image" src={this.props.noImageSrc} height='100%'
            onLoad={this.resizeImage}
          />
        </div>
      );
    } else {
      const ratio = (this.state.ratio) ? this.state.ratio : 1;
      var width = ratio*this.props.height;
      if (width > this.props.width) {
        width = this.props.width;
        marginTop = (this.props.height - this.state.height) / 2;
      }
      return (
        <div style={{ width: width, ...this.props.style, marginTop, }}>
          <img ref="image" src={this.props.src} width={ width } height='100%'
            onLoad={this.resizeImage}
            onError={this.showNoImage}
          />
        </div>
      )
    }
  }
}

Image.defaultProps = {
  style: {},
}

export default Image;

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { fontSize } from "../reducers";
import MathJax from "./MathJax";

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startResize: true,
      fontSize: this.props.fontSize,
      fontScale: 1,
      fontHeight: 100,
      maxHeight: props.maxHeight,
      minHeight: props.minHeight,
    };
    this.resizeTimeout = null;
  }

  onResize = () => {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.resize();
    }, 100);
  };

  componentDidMount() {
    window.addEventListener("resize", this.onResize, false);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  componentDidUpdate(nextProps) {
    if (
      this.props.value !== nextProps.value ||
      this.props.comment !== nextProps.comment ||
      this.props.fontSize !== nextProps.fontSize
    ) {
      this.setState(
        {
          fontScale: 1,
          startResize: true,
        },
        () => {
          if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
          this.resizeTimeout = setTimeout(() => {
            this.resize();
          }, 100);
        }
      );
    }
    if (this.props.maxHeight !== nextProps.maxHeight) {
      this.setState(
        {
          maxHeight: nextProps.maxHeight,
          startResize: true,
        },
        () => {
          if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
          this.resizeTimeout = setTimeout(() => {
            this.resize();
          }, 100);
        }
      );
    }
    if (this.props.minHeight !== nextProps.minHeight) {
      this.setState(
        {
          minHeight: nextProps.minHeight,
          startResize: true,
        },
        () => {
          if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
          this.resizeTimeout = setTimeout(() => {
            this.resize();
          }, 100);
        }
      );
    }
  }

  resize() {
    this.setState(
      {
        startResize: true,
        fontSize: fontSize({
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      },
      () => {
        const fontScale = this.state.fontScale;
        const fontSize = this.state.fontSize * this.state.fontScale;
        const offsetHeight =
          this.valueText.offsetHeight + this.commentText.offsetHeight;
        if (this.state.maxHeight < offsetHeight) {
          const scale = Math.max(this.state.maxHeight / offsetHeight, 0.8);
          this.setState(
            {
              fontScale: this.state.fontScale * scale,
              fontHeight: offsetHeight,
            },
            () => {
              if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
              this.resizeTimeout = setTimeout(() => {
                this.resize();
              }, 100);
            }
          );
        } else {
          this.setState(
            {
              fontHeight: offsetHeight + fontSize,
              startResize: false,
            },
            () => {
              if (this.props.onLayout) this.props.onLayout();
            }
          );
        }
      }
    );
  }

  render() {
    const fontSize = this.state.fontSize * this.state.fontScale;
    const height =
      this.state.fontHeight < this.state.minHeight
        ? this.state.minHeight
        : this.state.fontHeight;
    const { textAlign } = this.props.style;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height={this.props.maxHeight}
      >
        {
          <foreignObject
            x="0"
            y={this.state.startResize ? height : 0}
            width="100%"
            height="100%"
          >
            <div
              ref={t => (this.valueText = t)}
              style={{ width: "100%", textAlign, fontSize }}
            >
              <MathJax value={this.props.value} />
            </div>
            <div
              ref={t => (this.commentText = t)}
              style={{ width: "100%", textAlign, fontSize: fontSize * 0.7 }}
            >
              <MathJax value={this.props.comment} />
            </div>
          </foreignObject>
        }
      </svg>
    );
  }
}

Text.defaultProps = {
  value: "",
  comment: "",
  minHeight: 300,
  maxHeight: 300,
  style: {},
  fontSize: 12,
  onLayout: () => { },
};

export default Text;

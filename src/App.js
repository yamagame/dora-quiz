import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  QuizPage,
  CloseButton,
} from './containers';
import logo from './logo.svg';
import './App.css';
import {
  changeLayout,
} from './reducers'
import { getHost } from './utils';

function SlideCache({ cacheSlide, width, height, }) {
  return <div style={{ visibility: 'hidden', position: 'absolute', }}>
    {
      cacheSlide.map( (v,i) => <img key={i} style={{ visibility: 'hidden', margin: 0, padding: 0, }} width={width/(cacheSlide.length+1)} height={height/(cacheSlide.length+1)} src={ getHost(null, v) } />)
    }
  </div>
}

class App extends Component {
  constructor(props) {
    super(props);
    document.title = props.quizMode;
  }

  onResize = () => {
    this.props.onLayout({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.quizMode !== this.props.quizMode) {
      document.title = (!nextProps.quizMode) ? 'Quiz Robo' : nextProps.quizMode;
    }
  }

  render() {
    const bgStyle = {}
    if ('backgroundImage' in this.props && this.props.backgroundImage != null) bgStyle.backgroundImage = `url(${this.props.backgroundImage})`;
    if ('backgroundColor' in this.props && this.props.backgroundColor != null) bgStyle.backgroundColor = this.props.backgroundColor;
    return (
      <div style={{
        height: '100%',
      }}>
        <div id="bg" style={bgStyle} />
        {
          this.props.closeButton ? <CloseButton /> : null
        }
        <SlideCache
          cacheSlide={ this.props.cacheSlide }
          width={ this.props.width }
          height={ this.props.height }
        />
        <QuizPage
          width={ this.props.width }
          height={ this.props.height }
          quizMode={ this.props.quizMode }
        />
      </div>
    )
  }
}

App.defaultProps = {
  quizMode: null,
}

export default connect(
  state => {
    return {
      width: state.app.width,
      height: state.app.height,
      cacheSlide: state.app.cacheSlide,
      backgroundImage: state.app.backgroundImage,
      backgroundColor: state.app.backgroundColor,
      quizMode: state.app.quizMode,
      closeButton: state.app.closeButton,
    }
  },
  dispatch => ( {
    onLayout: (size) => dispatch( changeLayout(size) ),
  })
)(App);

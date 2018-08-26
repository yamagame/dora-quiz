import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  QuizPage,
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

  render() {
    return (
      <div style={{
        height: '100%',
      }}>
        <SlideCache
          cacheSlide={ this.props.cacheSlide }
          width={ this.props.width }
          height={ this.props.height }
        />
        <QuizPage
          width={ this.props.width }
          height={ this.props.height }
        />
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      width: state.app.width,
      height: state.app.height,
      cacheSlide: state.app.cacheSlide,
    }
  },
  dispatch => ( {
    onLayout: (size) => dispatch( changeLayout(size) ),
  })
)(App);

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

class App extends Component {
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
      <QuizPage />
    );
  }
}

export default connect(
  state => ( {
  } ),
  dispatch => ( {
    onLayout: (size) => dispatch( changeLayout(size) ),
  })
)(App);

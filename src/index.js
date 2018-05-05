import React from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import ReactDOM from 'react-dom';
import {
  loadInitialData,
  quizCommand,
  quizShuffle,
  sendEntry,
  reducers,
  loadQuizAnswers,
} from './reducers'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import io from 'socket.io-client'

const socket = io();

let store = createStore(reducers, applyMiddleware(thunk))

var params = {};

if (window.location.search) {
    var parts = window.location.search.substring(1).split('&');

    for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
        params[nv[0]] = nv[1] || true;
    }
}

console.log(params);
if (params._quizId) {
  params._quizId = decodeURIComponent(params._quizId);
}
if (params._playerName) {
  params._playerName = decodeURIComponent(params._playerName);
}

store.dispatch(loadInitialData(params, socket));

socket.on('connect', () => {
  console.log('conncted');
  store.dispatch(sendEntry());
});

socket.on('init', (state) => {
  console.log(state);
});

socket.on('quiz-reload-entry', () => {
  store.dispatch(sendEntry());
});

socket.on('quiz', (msg) => {
  console.log(msg);
  if (msg.action === 'entry') {
    delete msg.action;
  }
  if (msg.action === 'quiz-shuffle') {
    delete msg.action;
    if (!msg.initializeLoad) {
      store.dispatch(quizShuffle(msg));
    }
    return;
  }
  if (msg.action === 'quiz-start') {
    delete msg.pageNumber;
  }
  if (msg.action === 'refresh') {
    store.dispatch(loadQuizAnswers());
    return;
  }
  store.dispatch(quizCommand(msg));
});

socket.on('sheet', (msg) => {
  store.dispatch(quizCommand(msg));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

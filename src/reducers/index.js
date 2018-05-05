import { combineReducers } from 'redux'
import uuid from 'uuid'
import 'whatwg-fetch'

var socket = null;

const AsyncStorage = {
  getItem: function(key, defaultValue) {
    const value = localStorage.getItem(key);
    return (value !== null) ? JSON.parse(value).data : defaultValue;
  },
  setItem: function(key, value) {
    localStorage.setItem(key, JSON.stringify({ data: value }));
  },
}

export const fontSize = (payload) => {
  var size = (payload.width < payload.height) ? payload.width : payload.height;
  return parseInt(size*0.6/10, 10);
}

export const fontScale = (size) => {
  if (window.innerWidth > window.innerHeight) {
    return size;
  }
  return size*window.devicePixelRatio;
}

const initialState = {
  action: 'wait',
  question: '',
  choices: [],
  time: 5,
  name: '',
  clientId: '',
  answer: '',
  title: '',
  answers: [],
  messages: [],
  links: [],
  entry: {},
  photo: '',
  pages: [],
  sideImage: null,
  pageNumber: 0,
  playerAnswers: {},
  quizAnswers: {},
  members: [],
  quizId: '',
  quizStartTime: 0,
  quizOrder: [0,1,2,3],
  sumQuestions: null,
  showSum: false,
}

export const types = {
  PARAMS: 'PARAMS',
  LAYOUT: 'LAYOUT',
}

const setValues = (state = {}, action) => {
  if (action.type === types.PARAMS) {
    return {
      ...state,
      ...action.payload,
    }
  }
  if (action.type === types.LAYOUT) {
    return {
      ...state,
      ...action.payload,
    }
  }
  return state;
}

export const reducers = combineReducers({
  app: setValues,
})

export const loadInitialData = (params, socketIO) => async (dispatch, getState) => {
  const payload = {
    ...initialState,
    ...params,
    width: window.innerWidth,
    height: window.innerHeight,
  }
  payload.fontSize = fontSize(payload);
  socket = socketIO;
  await Promise.all(Object.keys(initialState).map(async (key) => {
    payload[key] = await AsyncStorage.getItem(key, payload[key]);
  }));
  payload.clientId = await AsyncStorage.getItem('clientId', uuid.v4());
  await AsyncStorage.setItem('clientId', payload.clientId);
  if (payload.mode == 'admin-result') {
    const  { _quizId, _startTime, _playerName } = payload;
    let response = await fetch('/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'answers',
        quizId: _quizId,
        startTime: _startTime,
      })
    })
    let data = await response.json();
    payload.result = {
      quizId: _quizId,
      startTime: _startTime,
      playerName: _playerName,
      data,
    }
  }
  dispatch({
    type: types.PARAMS,
    payload,
  });
}

export const changeLayout = (payload) => async (dispatch, getState) => {
  dispatch({
    type: types.LAYOUT,
    payload: {
      ...payload,
      fontSize: fontSize(payload),
    },
  });
}

export const setParams = (payload, callback) => async (dispatch, getState) => {
  await Promise.all(Object.keys(payload).map(async (key) => {
    await AsyncStorage.setItem(key, payload[key]);
  }));
  dispatch({
    type: types.PARAMS,
    payload,
  });
  if (callback) callback();
}

export const quizShuffle = (payload, callback) => async (dispatch, getState) => {
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
  const {  } = getState().app;
  let count = 4;
  // pages.forEach( v => {
  //   if (v.action === 'quiz') count ++;
  // });
  const quizOrder = [];
  for (var i=0;i<count;i++) {
    quizOrder.push(i);
  }
  for (var i=0;i<8;i++) {
    const a = getRndInteger(0, quizOrder.length);
    const b = getRndInteger(0, quizOrder.length);
    const v = quizOrder[a];
    quizOrder[a] = quizOrder[b];
    quizOrder[b] = v;
  }
  await AsyncStorage.setItem('quizOrder', quizOrder);
  dispatch({
    type: types.PARAMS,
    payload: {
      quizOrder: [ ...quizOrder ],
    },
  });
  if (callback) callback();
}

export const quizCommand = (payload, callback) => async (dispatch, getState) => {
  const { app: { name, } } = getState();
  payload = ((obj) => {
    const t = {};
    [
      'type',
      'action',
      'time',
      'pages',
      'sideImage',
      'choices',
      'fontScale',
      'question',
      'answers',
      'messages',
      'links',
      'entry',
      'title',
      'photo',
      'name',
      'pageNumber',
      'quizAnswers',
      'quizId',
      'quizStartTime',
      'sheet',
      'members',
      'showSum',
    ].forEach( key => {
      if (typeof obj[key] !== 'undefined') {
        t[key] = obj[key];
      }
    })
    return t;
  })(payload);
  if(payload.action == 'quiz-init') {
    await AsyncStorage.setItem(`sumQuestions`, {});
    payload.sumQuestions = {};
  }
  if (!payload.name || payload.name == name) {
    await Promise.all(Object.keys(payload).map(async (key) => {
      await AsyncStorage.setItem(key, payload[key]);
    }));
    dispatch({
      type: types.PARAMS,
      payload,
    });
  }
  if (callback) callback();
}

export const sendAnswer = (question, answer, callback) => async (dispatch, getState) => {
  const { app: { name, clientId, quizId, playerAnswers, quizStartTime } } = getState();
  const payload = {
    name,
    quizId,
    question,
    answer,
    clientId,
    time: new Date(),
    quizStartTime,
  }
  socket.emit('quiz', payload);
  const answers = { ...playerAnswers };
  answers[question] = answer;
  await AsyncStorage.setItem(`playerAnswers`, answers);
  dispatch({
    type: types.PARAMS,
    payload: {
      playerAnswers: answers,
    },
  });
  if (callback) callback();
}

export const sendEntry = (callback) => async (dispatch, getState) => {
  const { app: { name, clientId, } } = getState();
  const payload = {
    name,
    clientId,
    time: new Date(),
  }
  socket.emit('quiz', payload);
  dispatch({
    type: types.PARAMS,
    payload: {
    },
  });
  if (callback) callback();
}

export const loadQuizAnswers = () => async (dispatch, getState) => {
  const { app: { quizId, quizStartTime, pageNumber, pages, showSum } } = getState();
  let response = await fetch('/result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'answers',
      quizId,
      startTime: quizStartTime,
    })
  })
  let data = await response.json();
  const sumQuestions = {};
  pages.forEach( page => {
    if (page.action === 'quiz') {
      const r = {}
      const t = data.answers[page.question];
      Object.keys(t).forEach(key => {
        if (typeof r[t[key].answer] === 'undefined') r[t[key].answer] = 0;
        r[t[key].answer] ++;
      });
      sumQuestions[page.question] = r;
    }
  });
  await AsyncStorage.setItem(`sumQuestions`, sumQuestions);
  dispatch({
    type: types.PARAMS,
    payload: {
      sumQuestions,
      showSum,
    },
  });
}
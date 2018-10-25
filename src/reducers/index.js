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
  area: [],
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
  speechButton: false,
  noSave: false,
  imageServer: null,
  backgroundImage: null,
  backgroundColor: null,
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

export const loadInitialData = (params, socketIO, callback) => async (dispatch, getState) => {
  const payload = {
    ...initialState,
    ...params,
    width: window.innerWidth,
    height: window.innerHeight,
  }
  let signature = null;
  let user_id = null;
  payload.fontSize = fontSize(payload);
  socket = socketIO;
  await Promise.all(Object.keys(initialState).map(async (key) => {
    payload[key] = await AsyncStorage.getItem(key, payload[key]);
  }));
  payload.clientId = await AsyncStorage.getItem('clientId', uuid.v4());
  await AsyncStorage.setItem('clientId', payload.clientId);
  {
    let response = await fetch('/login-quiz-player', {
      method: 'POST',
    });
    if (response.ok) {
    } else {
      console.log('ERROR');
    }
  }
  {
    let response = await fetch('/access-token', {
      method: 'POST',
    });
    if (response.ok) {
      let data = await response.json();
      signature = data.signature;
      user_id = data.user_id;
      dispatch({
        type: types.PARAMS,
        payload: {
          user_id,
          signature,
        },
      });
    } else {
      console.log('ERROR');
    }
  }
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
        signature,
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
  if (callback) callback();
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

export const quizShuffle = (payload, reset, callback) => async (dispatch, getState) => {
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
  const {  } = getState().app;
  let count = 4;
  const quizOrder = [];
  for (var i=0;i<count;i++) {
    quizOrder.push(i);
  }
  if (!reset) {
    for (var i=0;i<8;i++) {
      const a = getRndInteger(0, quizOrder.length);
      const b = getRndInteger(0, quizOrder.length);
      const v = quizOrder[a];
      quizOrder[a] = quizOrder[b];
      quizOrder[b] = v;
    }
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
      'options',
      'selects',
      'speech',
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
      'area',
      'pageNumber',
      'quizAnswers',
      'quizId',
      'quizStartTime',
      'sheet',
      'members',
      'showSum',
      'speechButton',
      'noSave',
      'backgroundImage',
      'backgroundColor',
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
  const { app: {
    name,
    clientId,
    quizId,
    playerAnswers,
    quizStartTime,
    showSum,
    speechButton,
    noSave,
    user_id,
    signature,
  }} = getState();
  const payload = {
    name,
    quizId,
    question,
    answer,
    clientId,
    showSum,
    speechButton,
    noSave,
    time: new Date(),
    quizStartTime,
    user_id,
    signature,
  }
  console.log(JSON.stringify(payload));
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

export const sendSpeech = (speech, callback) => async (dispatch, getState) => {
  const { app: { signature, } } = getState();
  let response = await fetch('/command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'speech',
      speech,
      signature,
    })
  })
  if (response.ok) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.includes("application/json")) {
      let data = await response.json();
      if (callback) callback(null, data);
      return;
    }
  }
  if (callback) callback();
}

export const startButtonPushed = (callback) => async (dispatch, getState) => {
  const { app: { signature, } } = getState();
  let response = await fetch('/command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'cancel',
      signature,
    })
  })
  if (response.ok) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.includes("application/json")) {
      let data = await response.json();
      if (callback) callback(null, data);
      return;
    }
  }
  if (callback) callback();
}

export const sendEntry = (callback) => async (dispatch, getState) => {
  const { app: { name, clientId, user_id, signature, } } = getState();
  const payload = {
    name,
    clientId,
    time: new Date(),
    user_id,
    signature,
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
  const { app: {
    quizId,
    quizStartTime,
    pageNumber,
    pages,
    showSum,
    signature,
  }} = getState();
  let response = await fetch('/result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'answers',
      quizId,
      startTime: quizStartTime,
      showSum,
      signature,
    })
  })
  let data = await response.json();
  const sumQuestions = {};
  pages.forEach( page => {
    if (page.action === 'quiz') {
      const r = {}
      const t = data.answers[page.question];
      if (typeof t !== 'undefined') {
        Object.keys(t).forEach(key => {
          if (typeof r[t[key].answer] === 'undefined') r[t[key].answer] = 0;
          r[t[key].answer] ++;
        });
        sumQuestions[page.question] = r;
      }
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

export const imageServers = (imageServers) => async (dispatch, getState) => {
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
  const keys = Object.keys(imageServers);
  const server = (imageServers && keys.length > 0) ? imageServers[keys[getRndInteger(0, keys.length)]] : null;
  if (server === null) {
    dispatch({
      type: types.PARAMS,
      payload: {
        imageServer: null,
      },
    });
    return;
  }
  dispatch({
    type: types.PARAMS,
    payload: {
      imageServer: `${server.protocol}://${server.host}:${server.port}/`,
    },
  });
}

export const preloadSlideImage = (photo, params={}) => async (dispatch, getState) => {
  const { app: { cacheSlide, } } = getState();
  if (!cacheSlide.some( v => {
    return (v === photo);
  })) {
    const r = [ ...cacheSlide ];
    r.push(photo);
    if (typeof params.cacheSize !== 'undefined') {
      r.splice(0, r.length-params.cacheSize);
    }
    dispatch({
      type: types.PARAMS,
      payload: {
        cacheSlide: r,
      },
    });
  }
}

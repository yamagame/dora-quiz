import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import ReactDOM from "react-dom";
import {
  loadInitialData,
  quizCommand,
  quizShuffle,
  sendEntry,
  reducers,
  loadQuizAnswers,
  imageServers,
  preloadSlideImage,
} from "./reducers";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import io from "socket.io-client";

const socket = io();

let store = createStore(reducers, applyMiddleware(thunk));

var params = {
  cacheSlide: [],
};

let speechRef = null
let speechFlag = false

function Speech() {
  if (speechRef) return speechRef
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  speechRef = new SpeechRecognition();
  speechRef.onresult = (event) => {
    const resultText = event.results[0][0].transcript
    console.log(resultText)
    fetch(`/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: resultText }),
    })
  }
  speechRef.addEventListener("error", (event) => {
    let text = "timeout"
    switch (event.error) {
      case "aborted":
        speechFlag = false
        return
      case "no-speech":
        break;
      default:
        console.error(`音声認識エラーが発生しました: ${event.error}`);
        text = "error"
        break;
    }
    console.log("ERROR", event.error, new Date())
    if (!speechFlag) return
    speechFlag = false
    fetch(`/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
  });
  speechRef.addEventListener("end", (event) => {
    console.log("END", event, new Date())
    if (!speechFlag) return
    speechRef.start()
  });

  return speechRef
}

store.dispatch(
  loadInitialData(params, socket, () => {
    socket.on("connect", () => {
      console.log("conncted");
      store.dispatch(sendEntry());
    });

    socket.on("init", state => {
      console.log(state);
    });

    socket.on("quiz-reload-entry", msg => {
      store.dispatch(sendEntry());
    });

    socket.on("quiz", msg => {
      if (!msg.quizMode) {
        msg.quizMode = "Quiz Robo";
      }
      if (!msg.closeButton) {
        msg.closeButton = false;
      }
      if (msg.action === "entry") {
        delete msg.action;
      }
      if (msg.action === "quiz-shuffle") {
        delete msg.action;
        if (!msg.initializeLoad) {
          store.dispatch(quizShuffle(msg, msg.reset));
        }
        return;
      }
      if (msg.action === "quiz-start") {
        delete msg.pageNumber;
      }
      if (msg.action === "refresh") {
        store.dispatch(loadQuizAnswers());
        return;
      }
      if (msg.action === "preload") {
        store.dispatch(preloadSlideImage(msg.photo, msg.params));
        return;
      }
      store.dispatch(quizCommand(msg));
    });

    socket.on("imageServers", msg => {
      store.dispatch(imageServers(msg));
    });

    socket.on("sheet", msg => {
      store.dispatch(quizCommand(msg));
    });

    socket.on("startRecording", msg => {
      console.log("startRecording", new Date())
      speechFlag = true
      Speech().start();
    });

    socket.on("stopRecording", msg => {
      console.log("stopRecording")
      speechFlag = false
      Speech().abort();
    });

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById("root")
    );
    registerServiceWorker();
  })
);

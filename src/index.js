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

store.dispatch(
  loadInitialData(params, socket, () => {
    socket.on("connect", () => {
      console.log("conncted");
      store.dispatch(sendEntry());
    });

    socket.on("init", (state) => {
      console.log(state);
    });

    socket.on("quiz-reload-entry", (msg) => {
      store.dispatch(sendEntry());
    });

    socket.on("quiz", (msg) => {
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

    socket.on("imageServers", (msg) => {
      store.dispatch(imageServers(msg));
    });

    socket.on("sheet", (msg) => {
      store.dispatch(quizCommand(msg));
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

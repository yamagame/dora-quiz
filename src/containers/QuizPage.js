import React, { Component } from 'react';
import { connect } from 'react-redux'
import Button from './Button';
import MenuButton from './MenuButton';
import Row from './Row';
import Text from './Text';
import Column from './Column';
import Bar from './Bar';
import PageButton from './PageButton';
import {
  fontSize,
  fontScale,
  sendAnswer,
  sendEntry,
  setParams,
} from '../reducers'
import Image from './Image';
import AdminResult from './QuizPage/AdminResult';
import Wait from './QuizPage/Wait';
import Title from './QuizPage/Title';
import Message from './QuizPage/Message';
import Entry from './QuizPage/Entry';
import Ranking from './QuizPage/Ranking';
import Slide from './QuizPage/Slide';
import Select from './QuizPage/Select';
import Result from './QuizPage/Result';

class QuizPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.props.sendEntry();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action !== this.props.action) {
      if ((nextProps.action === 'question' && this.props.action === 'wait') || nextProps.action === 'quiz-init') {
        this.props.setParams({ answer: '', playerAnswers: {}, pageNumber: 0, });
      }
    }
    if (nextProps.name !== this.props.name) {
      this.props.sendEntry();
    }
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
      if (this.imageView) {
        this.imageView.resizeImage();
      }
      if (this.titleText) {
        this.titleText.resize();
      }
    }
  }

  buttonHandller = (question, answer) => {
    return () => {
      if (this.props.action === 'start' || this.props.action === 'quiz-start') {
        const t = (this.props.playerAnswers[this.checkPage(this.props.pages,this.props.pageNumber).question] == null);
        this.props.sendAnswer(question, answer, () => {
          if (t) {
            this.openPageHandller(+1)();
          }
        });
      }
    }
  }

  isAnswered = (question) => {
    return (this.props.playerAnswers[question]);
  }

  selectedHandller = (answer, choice) => {
    return (answer !== '' && answer === choice)
  }

  startQuiz = (name) => {
    if (name.trim() !== '') {
      this.props.setParams({ name: name.trim() }, () => {
        this.setState({
          changeName: false,
        }, () => {
          this.props.sendEntry();
        });
      });
    }
  }

  changeName = () => {
    this.setState({
      changeName: true,
    }, () => {
      //this.entryName.value = this.props.name;
    });
  }

  openPageHandller = (dx) => {
    return () => {
      if (typeof this.props.pages !== 'undefined') {
        if (this.props.pageNumber+dx >= 0 && this.props.pageNumber+dx < this.props.pages.length) {
          this.props.setParams({ pageNumber: this.props.pageNumber+dx });
        }
      }
    }
  }

  prevButtonStatus = () => {
    return (this.props.pageNumber > 0);
  }

  nextButtonStatus = () => {
    return (this.props.pageNumber < this.props.pageCount-1);
  }

  checkPage(pages, number) {
    if (!pages || pages.length <= 0) return {};
    if (pages.length > number) return pages[number];
    return pages[0];
  }

  render() {
    if (this.props.mode == 'admin-result') {
      return this.renderAdminResult(this.props.result);
    }
    const pageNumber = (typeof this.props.pageNumber === 'undefined') ? 0 : this.props.pageNumber;
    if (this.props.action == 'quiz-init'
     || this.props.action == 'quiz-start'
     || this.props.action == 'quiz-stop'
     || this.props.action == 'quiz-answer') {
      if (this.props.pages && this.props.pages.length > 0) {
        return this.renderPages(this.checkPage(this.props.pages,pageNumber));
      } else {
        return this.renderSelect(this.props);
      }
    }
    return this.renderPages(this.props);
  }

  renderAdminResult(result) {
    return <AdminResult result={result} />
  }

  renderPages(page) {
    const pageNumber = (typeof this.props.pageNumber === 'undefined') ? 0 : this.props.pageNumber;
    if (typeof page == 'undefined') {
      return this.renderPages({});
    }
    if (typeof this.props.name === 'undefined' || this.props.name === '' || this.props.name.length <= 1 || this.state.changeName) {
      return this.renderTitle(page);
    }
    if (page.action == 'quiz') {
      return this.renderSelect(page);
    }
    if (page.action == 'quiz-init'
     || page.action == 'quiz-start'
     || page.action == 'quiz-stop'
     || page.action == 'quiz-answer') {
      if (page.pages && page.pages.length > 0) {
        return this.renderPages(this.checkPage(page.pages,pageNumber));
      } else {
        return this.renderSelect(page);
      }
    }
    if (page.action == 'quiz-entry') {
      return this.renderEntry(page);
    }
    if (page.action == 'question') {
      return this.renderSelect(page);
    }
    if (page.action == 'message') {
      return this.renderMessage(page);
    }
    if (page.action == 'start') {
      return this.renderSelect(page);
    }
    if (page.action == 'time') {
      return this.renderSelect(page);
    }
    if (page.action == 'stop') {
      return this.renderSelect(page);
    }
    if (page.action == 'answer') {
      return this.renderSelect(page);
    }
    if (page.action == 'reset') {
      return this.renderTitle(page);
    }
    if (page.action == 'slide') {
      return this.renderSlide(page);
    }
    if (page.action == 'result') {
      if (this.props.name !== '_quiz_master_') {
        return this.renderResult(page);
      } else {
        return this.renderMessage({
          title: 'みなさんの成績を表示しています',
          fontScale: 1,
        });
      }
    }
    if (page.action == 'sheet') {
      return this.renderSheet(page);
    }
    if (page.action == 'quiz-ranking') {
      return this.renderRanking(page);
    }
    return this.renderWait(page);
  }

  renderWait({}) {
    return <Wait
      fontSize={this.props.fontSize}
      name={this.props.name}
      onChangeName={this.changeName}
    />
  }

  renderTitle({}) {
    return <Title
      fontSize={this.props.fontSize}
      members={this.props.members}
      name={this.props.name}
      onStartQuiz={this.startQuiz}
    />
  }
  
  renderSelect({
    action,
    time,
    host,
    sideImage,
    question,
    comment,
    choices,
    answers,
    layout,
    fontScale,
  }) {
    return <Select
      fontSize={this.props.fontSize}
      action={this.props.action}
      time={this.props.time}
      host={host}
      sideImage={sideImage}
      question={question}
      comment={comment}
      choices={choices}
      answers={answers}
      layout={layout}
      fontScale={fontScale}
      quizOrder={this.props.quizOrder}
      pageCount={this.props.pageCount}
      height={this.props.height}
      playerAnswers={this.props.playerAnswers}
      selectedHandller={this.selectedHandller}
      buttonHandller={this.buttonHandller}
      openPageHandller={this.openPageHandller}
      prevButtonStatus={this.prevButtonStatus}
      nextButtonStatus={this.nextButtonStatus}
      isAnswered={this.isAnswered}
      sumQuestions={this.props.sumQuestions}
      quizMaster={(this.props.name === '_quiz_master_')}
      showSum={this.props.showSum}
    />
  }

  renderMessage({
    title,
    fontScale,
    messages,
    links,
  }) {
    return <Message
      fontSize={this.props.fontSize}
      title={title}
      fontScale={fontScale}
      messages={messages}
      links={links}
    />
  }

  renderResult({
    title,
    messages,
    links,
  }) {
    return <Result
      fontSize={this.props.fontSize}
      time={this.props.time}
      title={title}
      messages={messages}
      links={links}
      name={this.props.name}
      action={this.props.action}
      pages={this.props.pages}
      playerAnswers={this.props.playerAnswers}
      pageCount={this.props.pageCount}
      prevButtonStatus={this.prevButtonStatus}
      nextButtonStatus={this.nextButtonStatus}
      openPageHandller={this.openPageHandller}
    />
  }

  renderEntry({
    title,
    messages,
    links,
    entry,
  }) {
    return <Entry
      fontSize={this.props.fontSize}
      title={title}
      messages={messages}
      links={links}
      entry={entry}
    />
  }

  renderSlide({
    host,
    photo,
  }) {
    return <Slide
      fontSize={this.props.fontSize}
      host={host}
      photo={photo}
      width={this.props.width}
      height={this.props.height}
      pageCount={this.props.pageCount}
      host={this.props.host}
      photo={this.props.photo}
      prevButtonStatus={this.prevButtonStatus}
      nextButtonStatus={this.nextButtonStatus}
      openPageHandller={this.openPageHandller}
    />
  }

  renderRanking() {
    return <Ranking
      fontSize={this.props.fontSize}
      quizStartTime={this.props.quizStartTime}
      pages={this.props.pages}
      quizAnswers={this.props.quizAnswers}
      height={this.props.height}
    />
  }

  renderQuiz(props) {
    return this.renderSelect(props);
  }

  renderSheet(props) {
    return (
      <div className="App">
        <div style={{ height: '100%', }}>
          <Column style={{ height: '100%', }}>
            <div style={{ padding: 16, margin: 'auto', }} >
              <Row>
                {
                  Object.keys(props.sheet).map( (key, i) => {
                    const sheet = props.sheet[key];
                    return <Bar key={i} label={`${key}`} maxValue={-100} value={sheet.state === 'on' ? -100 : 0} />
                  })
                }
              </Row>
            </div>
          </Column>
        </div>
      </div>
    )
  }

}

QuizPage.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  sheet: {},
}

export default connect(
  state => {
    const pageCount = (typeof state.app.pages !== 'undefined') ? state.app.pages.length: 0;
    return {
      action: state.app.action,
      question: state.app.question,
      choices: state.app.choices,
      time: state.app.time,
      title: state.app.title,
      photo: state.app.photo,
      sideImage: state.app.sideImage,
      messages: state.app.messages,
      links: state.app.links,
      entry: state.app.entry,
      pages: state.app.pages,
      answer: state.app.answer,
      answers: state.app.answers,
      fontSize: state.app.fontSize,
      width: state.app.width,
      height: state.app.height,
      name: state.app.name,
      pageCount,
      pageNumber: (state.app.pageNumber >= pageCount) ? 0 : state.app.pageNumber,
      playerAnswers: state.app.playerAnswers,
      quizAnswers: state.app.quizAnswers,
      quizStartTime: state.app.quizStartTime,
      quizOrder: state.app.quizOrder,
      sheet: state.app.sheet,
      members: state.app.members,
      mode: state.app.mode,
      result: state.app.result,
      sumQuestions: state.app.sumQuestions,
      showSum: state.app.showSum,
    }
  },
  dispatch => ({
    sendAnswer: (question, answer, callback) => dispatch( sendAnswer(question, answer, callback) ),
    sendEntry: (callback) => dispatch( sendEntry(callback) ),
    setParams: (payload, callback) => dispatch( setParams(payload, callback) ),
  })
)(QuizPage);
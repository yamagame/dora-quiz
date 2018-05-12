import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';
import Row from '../Row';
import Text from '../Text';
import PageButton from '../PageButton';
import Image from '../Image';
import Button from '../Button';
import Bar from '../Bar';
import Container from './Container';

function buttonValue(v, height, host) {
  if (typeof v !== 'object') {
    return <p> { v } </p>;
  }
  if (v.image) {
    return <div style={{ marginTop: 10, }} ><img style={{ margin: 'auto', padding: 0, pointerEvents: 'none', }} height={height-4} src={(host) ? host+v.image : v.image} /></div>
  }
  return <p> { v.value } </p>;
}


class Select extends Component {
  constructor (props) {
    super(props);
    this.state = {}
  }

  timeStr = () => {
    if (this.props.action == 'question' || this.props.action == 'quiz-init') {
      return `回答時間は ${this.props.time} 秒です`;
    } else {
      if (this.props.time == 0) {
        return `タイムアップ`;
      } else {
        return `あと ${this.props.time} 秒です`;
      }
    }
  }

  barColor = (maxnum, i) => {
    if (maxnum == 2) {
      const tbl = ['#00A2FF', '#FF3399'];
      return tbl[i];
    }
    return 'cyan';
  }

  render() {
    if (this.props.showSum && this.props.quizMaster && this.props.sumQuestions) {
      return this.renderSum()
    } else
    if (this.props.showSum) {
      return this.renderTwoChoices()
    } else {
      return this.renderChoices()
    }
  }

  renderChoices() {
    const {
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
    } = this.props;
    const shuffleChoices = (this.props.quizOrder) ? this.props.quizOrder.map( v => choices[v] ) : choices;
    console.log(answers);
    console.log(shuffleChoices);
    return (
      <div className="App">
        <Row style={{ height: '99%', }}>
          {/*
            (sideImage) ? <div style={{ width: sideImage.aspect*this.props.height }}>
              <img src={sideImage.url}  width={ sideImage.aspect*this.props.height } height='100%' />
            </div> : null
          */}
          <Column style={{ margin: 8, marginTop: 16, }}>
            <Container ref={ d => this.titleContainer = d } style={{ height: '25%', }} onUpdate={ box => this.setState({ titleContainer: box }) }>
              <div style={{
                display: 'flex',
                //margin: 8,
                //height: '100%',
              }}>
                {
                  (this.props.pageCount>1) ? <PageButton
                    title="＜"
                    disabled={this.props.prevButtonStatus()}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(-1)}
                  /> : <div style={{ display: 'inline', width: this.props.fontSize, }} > </div>
                }
                <div style={{
                  width: '100%',
                  overflow: 'auto',
                }}>
                  <Text
                    ref={ text => this.titleText = text }
                    style={{
                      textAlign: 'left',
                    }}
                    container={ this.state.titleContainer }
                    fontSize={ this.props.fontSize }
                    value={ question }
                    comment={ comment }
                  />
                  {/*
                    <p ref={ p => this.titleText = p } style={{
                      fontSize: this.props.fontSize,
                      textAlign: 'center',
                    }}> { question } </p>
                  */}
                </div>
                {
                  (this.props.pageCount>1) ? <PageButton
                    title="＞"
                    disabled={this.props.nextButtonStatus() && this.props.isAnswered(question)}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(+1)}
                  /> : <div style={{ display: 'inline', width: this.props.fontSize, }} > </div>
                }
              </div>
            </Container>
            <Row style={{ height: '99%', }}>
            {
              (sideImage) ? <Image src={(host) ? host+sideImage.url : sideImage.url} height={ this.props.height-((this.state.titleContainer) ? this.state.titleContainer.offsetHeight : 0) } /> : null
            }
            <div style={{ margin: 8, width: '100%', }}>
            {
              (this.props.time !== null) ? <p style={{
                overflow: 'hidden',
                fontSize: this.props.fontSize*0.5,
                textAlign: 'center',
                margin: this.props.fontSize/2,
                //marginBottom: this.props.fontSize*3/4,
                height: this.props.fontSize,
              }}> { this.timeStr() } </p> : null
            }
            {
              (layout) ?
              <div>
                <Row style={{ height: '99%', }}>
                  {
                    (shuffleChoices) ? shuffleChoices.filter(v => v).map( (v,i) => (
                      ((i % 2) == 0) ? 
                        <Button
                          key={i}
                          fontScale={fontScale}
                          correct={(answers && (this.props.action === 'quiz-answer' || this.props.action === 'answer')) ? answers.some( t => t === ((typeof v !== 'object') ? v : v.value)) : false}
                          selected={this.props.selectedHandller(this.props.playerAnswers[question], (typeof v !== 'object') ? v : v.value )}
                          onClick={this.props.buttonHandller(question, (typeof v !== 'object') ? v : v.value)}
                        >
                          {
                            buttonValue(v, this.props.fontSize*4, host)
                          }
                        </Button> : null
                    )) : null
                  }
                </Row>
                <Row style={{ height: '99%', }}>
                  {
                    (shuffleChoices) ? shuffleChoices.filter(v => v).map( (v,i) => (
                      ((i % 2) == 1) ? 
                        <Button
                          key={i}
                          fontScale={fontScale}
                          correct={(answers && (this.props.action === 'quiz-answer' || this.props.action === 'answer')) ? answers.some( t => t === ((typeof v !== 'object') ? v : v.value)) : false}
                          selected={this.props.selectedHandller(this.props.playerAnswers[question], (typeof v !== 'object') ? v : v.value )}
                          onClick={this.props.buttonHandller(question, (typeof v !== 'object') ? v : v.value)}
                        >
                          {
                            buttonValue(v, this.props.fontSize*4, host)
                          }
                        </Button> : null
                    )) : null
                  }
                </Row>
              </div>
              :
              <div>
              {
                (shuffleChoices) ? shuffleChoices.filter(v => v).map( (v,i) => (
                  <Button
                    key={i}
                    fontScale={fontScale}
                    correct={(answers && (this.props.action === 'quiz-answer' || this.props.action === 'answer')) ? answers.some( t => t === ((typeof v !== 'object') ? v : v.value)) : false}
                    selected={this.props.selectedHandller(this.props.playerAnswers[question], (typeof v !== 'object') ? v : v.value )}
                    onClick={this.props.buttonHandller(question, (typeof v !== 'object') ? v : v.value)}
                  >
                    {
                      buttonValue(v, this.props.fontSize, host)
                    }
                  </Button>
                )) : null
              }
              </div>
            }
            </div>
            </Row>
          </Column>
        </Row>
      </div>
    )
  }

  renderTwoChoices() {
    const {
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
    } = this.props;
    const shuffleChoices = choices;
    return (
      <div className="App">
        <Row style={{ height: '99%', }}>
          {/*
            (sideImage) ? <div style={{ width: sideImage.aspect*this.props.height }}>
              <img src={sideImage.url}  width={ sideImage.aspect*this.props.height } height='100%' />
            </div> : null
          */}
          <Column style={{ margin: 8, marginTop: 16, }}>
            <Container ref={ d => this.titleContainer = d } style={{ height: '25%', }} onUpdate={ box => this.setState({ titleContainer: box }) }>
              <div style={{
                margin: this.props.fontSize/2,
                display: 'flex',
                //margin: 8,
                //height: '100%',
              }}>
                {
                  (this.props.pageCount>1) ? <PageButton
                    title="＜"
                    disabled={this.props.prevButtonStatus()}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(-1)}
                  /> : <div style={{ display: 'inline', width: this.props.fontSize, }} > </div>
                }
                <div style={{
                  width: '100%',
                  overflow: 'auto',
                }}>
                  <Text
                    ref={ text => this.titleText = text }
                    style={{
                      textAlign: 'left',
                    }}
                    container={ this.state.titleContainer }
                    fontSize={ this.props.fontSize }
                    value={ question }
                    comment={ comment }
                  />
                  {/*
                    <p ref={ p => this.titleText = p } style={{
                      fontSize: this.props.fontSize,
                      textAlign: 'center',
                    }}> { question } </p>
                  */}
                </div>
                {
                  (this.props.pageCount>1) ? <PageButton
                    title="＞"
                    disabled={this.props.nextButtonStatus() && this.props.isAnswered(question)}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(+1)}
                  /> : <div style={{ display: 'inline', width: this.props.fontSize, }} > </div>
                }
              </div>
            </Container>
            {
              (sideImage) ? <Image src={(host) ? host+sideImage.url : sideImage.url} height={ this.props.height-((this.state.titleContainer) ? this.state.titleContainer.offsetHeight : 0) } /> : null
            }
            {
              (this.props.time !== null) ? <p style={{
                overflow: 'hidden',
                fontSize: this.props.fontSize*0.5,
                textAlign: 'center',
                margin: this.props.fontSize/2,
                //marginBottom: this.props.fontSize*3/4,
                height: this.props.fontSize,
              }}> { this.timeStr() } </p> : null
            }
            <Row style={{ height: '99%', }}>
            {
              (shuffleChoices) ? shuffleChoices.map( (v,i) => (
                (v) ? <Button
                  key={i}
                  fontScale={fontScale}
                  height={this.props.fontSize*5}
                  margin={this.props.fontSize*0.5}
                  paddingTop={this.props.fontSize*3}
                  correct={(answers && (this.props.action === 'quiz-answer' || this.props.action === 'answer')) ? answers.some( t => t === ((typeof v !== 'object') ? v : v.value)) : false}
                  selected={this.props.selectedHandller(this.props.playerAnswers[question], (typeof v !== 'object') ? v : v.value )}
                  onClick={this.props.buttonHandller(question, (typeof v !== 'object') ? v : v.value)}
                >
                  {
                    buttonValue(v, this.props.fontSize*4, host)
                  }
                </Button> : null
              )) : null
            }
            {/* <div style={{ margin: 8, width: '100%', }}></div> */}
            </Row>
          </Column>
        </Row>
      </div>
    )
  }

  renderSum() {
    const {
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
    } = this.props;
    let maxValue = 10;
    const shuffleChoices = choices;
    if (this.props.sumQuestions) {
      (shuffleChoices) ? shuffleChoices.forEach( (v,i) => {
        if (typeof v === 'undefined') return;
        const q = this.props.sumQuestions[this.props.question];
        if (q) {
          const w = q[v];
          if (maxValue < w) maxValue = w+5;
        }
      }) : null
    }
    const shuffleChoicesLength = shuffleChoices.filter( v => {
      return (v);
    }).length;
    return (
      <div className="App">
        <Row style={{ height: '99%', }}>
          {/*
            (sideImage) ? <div style={{ width: sideImage.aspect*this.props.height }}>
              <img src={sideImage.url}  width={ sideImage.aspect*this.props.height } height='100%' />
            </div> : null
          */}
          <Column style={{ margin: 8, marginTop: 16, }}>
            <Container ref={ d => this.titleContainer = d } style={{ height: '10%', }} onUpdate={ box => this.setState({ titleContainer: box }) }>
              <div style={{
                display: 'flex',
                margin: this.props.fontSize/2,
                //margin: 8,
                //height: '100%',
              }}>
                {
                  (this.props.pageCount>1) ? <PageButton
                    title="＜"
                    disabled={this.props.prevButtonStatus()}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(-1)}
                  /> : <div style={{ display: 'inline', width: this.props.fontSize, }} > </div>
                }
                <div style={{
                  width: '100%',
                  overflow: 'auto',
                }}>
                  <Text
                    ref={ text => this.titleText = text }
                    style={{
                      textAlign: 'left',
                    }}
                    container={ this.state.titleContainer }
                    fontSize={ this.props.fontSize }
                    value={ question }
                    comment={ comment }
                  />
                  {/*
                    <p ref={ p => this.titleText = p } style={{
                      fontSize: this.props.fontSize,
                      textAlign: 'center',
                    }}> { question } </p>
                  */}
                </div>
                {
                  (this.props.pageCount>1) ? <PageButton
                    title="＞"
                    disabled={this.props.nextButtonStatus() && this.props.isAnswered(question)}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(+1)}
                  /> : <div style={{ display: 'inline', width: this.props.fontSize, }} > </div>
                }
              </div>
            </Container>
            {
              (this.props.sumQuestions) ? (
              <div style={{ padding: 16, margin: 'auto', }} >
                <Row>
                  {
                    (shuffleChoices) ? shuffleChoices.filter(v => v).map( (v,i) => {
                      if (typeof v === 'undefined') return null;
                      return <Bar
                                key={i}
                                maxValue={maxValue}
                                label={v}
                                value={(this.props.sumQuestions[this.props.question]) ? this.props.sumQuestions[this.props.question][v] : 0}
                                fontSize={this.props.fontSize}
                                width={this.props.fontSize*4}
                                height={this.props.height*0.4}
                                color={this.barColor(shuffleChoicesLength, i)}
                              />;
                    }) : null
                  }
                </Row>
              </div>) :null
            }
          </Column>
        </Row>
      </div>
    )
  }
}

Select.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  quizOrder: null,
  action: '',
  time: null,
  host: null,
  sideImage: null,
  question: null,
  comment: null,
  choices: null,
  answers: null,
  layout: null,
  fontScale: null,
  pageCount: 0,
  height: 0,
  playerAnswers: [],
  sumQuestions: {},
  showSum: false,
  quizMaster: false,

  selectedHandller: null,
  buttonHandller: null,
  openPageHandller: null,
  prevButtonStatus: null,
  nextButtonStatus: null,
  isAnswered: null,
}

export default Select;

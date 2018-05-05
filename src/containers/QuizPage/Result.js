import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';
import Row from '../Row';
import PageButton from '../PageButton';

class Result extends Component {
  constructor (props) {
    super(props);
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

  render() {
    const { title, messages, links } = this.props;
    const resultCount = this.props.pages.map( v => v.action == 'quiz' ? ( v.answers.some( w => w == this.props.playerAnswers[v.question] ) ? 1 : 0 ) : 0 ).reduce( (a,b) => a+b );
    const quizCount = this.props.pages.map( v => v.action == 'quiz' ? 1 : 0 ).reduce( (a,b) => a+b );
    const resultMessage = (() => {
      if (resultCount === quizCount) return '全問正解、おめでとう！';
      if (resultCount > 0) return '間違ったところは、学生講師から教えてもらってね！';
      return '学生講師から教えてもらってね！';
    })();
    const resultFontSize = (() => {
      if (resultCount === quizCount) return this.props.fontSize;
      return this.props.fontSize*0.7;
    })();
    return (
      <div className="App">
        <div style={{ height: '99%', }}>
          <div style={{ padding: 16, height: '90%', }} >
            <Row style={{ height: '90%', }}>
              {
                (this.props.pageCount>1) ? <PageButton
                title="＜"
                disabled={this.props.prevButtonStatus()}
                fontSize={this.props.fontSize}
                onClick={this.props.openPageHandller(-1)}/> : null
              }
              <div style={{ width: '100%', margin: 'auto', }}>
              {
                (this.props.action !== 'quiz-answer') ? (
                  <div>
                    {
                      <p style={{
                        overflow: 'hidden',
                        fontSize: this.props.fontSize*0.5,
                        textAlign: 'center',
                        margin: 32,
                        height: '5%',
                      }}> { this.timeStr() } </p>
                    }
                    <p style={{
                      overflow: 'hidden',
                      fontSize: this.props.fontSize*0.7,
                    }}>
                      { '解答まで、しばらくお待ちください' }
                    </p>
                    <p style={{
                      overflow: 'hidden',
                      fontSize: this.props.fontSize*0.4,
                      marginTop: 10,
                    }}>
                      { '※左上のボタンで解答のやりなおしができます' }
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="Result-Item" style={{
                      overflow: 'hidden',
                      fontSize: this.props.fontSize,
                    }}> { this.props.name }さんは、{
                      quizCount
                    }問中、{
                      resultCount
                    }問正解でした </p>
                    <p className="Result-Item" style={{
                      marginTop: 30,
                      overflow: 'hidden',
                      fontSize: resultFontSize,
                    }}> { resultMessage } </p>
                  </div>
                )
              }
              </div>
              {
                (this.props.pageCount>1) ? <PageButton
                title="＞"
                disabled={this.props.nextButtonStatus()}
                fontSize={this.props.fontSize}
                onClick={this.props.openPageHandller(+1)}/> : null
              }
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

Result.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  title: '',
  messages: [],
  links: [],
  name: '',
  action: '',
  pages: [],
  playerAnswers: [],
  pageCount: 0,
  time: 0,

  prevButtonStatus: null,
  nextButtonStatus: null,
  openPageHandller: null,
}

export default Result;

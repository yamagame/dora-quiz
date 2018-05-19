import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';
import Row from '../Row';

function resultTimeStr(msec) {
  const min = parseInt(msec / (1000*60));
  const sec = (msec - min * (1000*60))/1000;
  if (min <= 0) {
    return `${sec}秒`;
  } else {
    return `${min}分${sec}秒`;
  }
}

function limitScale(col, scale) {
  return scale*4/col;
}

function RankingTable({ ranking, fontSize, startTime }) {
  if (!ranking || ranking.length <= 0) return null;
  const top = ranking.slice(0,3);
  const others = [];
  const len = ranking.length-top.length;
  let n = 5;
  if (len > 10) n = 9;
  ranking.slice(3).forEach( (d, i) => {
    const col = parseInt(i/n);
    if (typeof others[col] === 'undefined') {
      others[col] = [];
    }
    others[col].push(d);
  });
  if (others.length > 0) {
    while (n > 0) {
      if (others[others.length-1].length < n) {
        others[others.length-1].push({
        });
      } else {
        break;
      }
    }
  }
  const topScale = [
    1,
    0.9,
    0.8,
    0.75
  ]
  const topColor = [
    '#FF004E',
    '#FF00C3',
    '#9D65FF',
    '#3D50FF',
  ]
  return (
    <Column style={{width:'100%'}}>
      <Column style={{width:'100%'}}>
        {
          top.slice(0,3).map( (d,i) => {
            return (
              <p
                className="Ranking-Item"
                key={i}
                style={{
                  fontSize: fontSize*topScale[i],
                  background: topColor[i],
                }}
              > 
                {i+1}位 { d.name }さん { resultTimeStr((d.time.getTime() - startTime.getTime())) }
              </p>
            )
          })
        }
      </Column>
      <Row style={{width:'100%'}}>
        {
          (others.length > 0) ? others.map( (ranking, col) => {
            return (
              <Column>
                {
                  (ranking.length > 0) ? ranking.map( (d,i) => {
                    if (d.name) {
                      const s = `${i+4+col*n}位 ${d.name}さん ${resultTimeStr((d.time.getTime() - startTime.getTime()))}`;
                      return (
                        <p
                          className="Ranking-Item"
                          key={i+4+col*n}
                          style={{
                            fontSize: fontSize*limitScale(n, topScale[3]),
                            background: topColor[3],
                            border: 'solid 0px',
                          }}
                        >
                          {s}
                        </p>
                      )
                    } else {
                      return (
                        <p
                          className="Ranking-Item"
                          key={i+4+col*n}
                          style={{
                            fontSize: fontSize*limitScale(n, topScale[3]),
                            background: topColor[3],
                            border: 'solid 0px',
                          }}
                        >
                          　
                        </p>
                      )
                    }
                  }) : null
                }
              </Column>
            )
          }) : null
        }
      </Row>
    </Column>
  )
}

class Ranking extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const quizStartTime = this.props.quizStartTime
    const startTime = new Date(quizStartTime);
    var result = {};
    let quizCount = 0;
    try {
      const answerCheck = (question, answer) => {
        return this.props.pages.some( page => {
          if (typeof page.question !== 'undefined' && page.question === question) {
            return page.answers.some( a => a == answer);
          }
        });
      }
      quizCount = this.props.pages.filter( a => a.action == 'quiz').length;
      Object.keys(this.props.quizAnswers).forEach( question => {
        const players = this.props.quizAnswers[question];
        Object.keys(players).forEach( clientId => {
          const name = players[clientId].name;
          const answer = players[clientId].answer;
          const time = new Date(players[clientId].time);
          if (result[name] == null) {
            result[name] = { time, answer, point: 0 };
          } else
          if (result[name].time.getTime() < time.getTime()) {
            result[name] = { time, answer, point: result[name].point };
          }
          if (answerCheck(question, answer)) {
            result[name].point ++;
          }
        });
      });
    } catch(e) {
    }
    const ranking = Object.keys(result).map( name => {
                                          return {
                                            name: name,
                                            time: result[name].time,
                                            answer: result[name].answer,
                                            point: result[name].point,
                                          }})
                                       .filter( p => p.point == quizCount )
                                       .sort( (a,b) => {
                                          const at = new Date(a.time).getTime();
                                          const bt = new Date(b.time).getTime();
                                          return (at < bt) ? -1 : ((at > bt) ? 1 : 0) ;
                                        } )
    return (
      <div className="App">
        <div style={{ height: '99%', }}>
          <div style={{ padding: 16, height: this.props.height-32, }} >
            <Row style={{ height: '100%', }}>
              <div style={{ width: '100%', margin: 'auto', }}>
                <p className="Ranking-Title" style={{
                  fontSize: this.props.fontSize*1.2,
                }}> 早押しランキング </p>
                <div className="Ranking-Container">
                <RankingTable ranking={ranking} startTime={startTime} fontSize={this.props.fontSize} />
                </div>
                {
                  (ranking && ranking.length <= 0) ? <div className="Ranking-Container">
                      <p className="Ranking-Result-Item" style={{ fontSize: this.props.fontSize, }}> 全問正解者はいませんでした！ </p>
                      <p className="Ranking-Result-Item" style={{ fontSize: this.props.fontSize, }}> もっとがんばりましょう！ </p>
                  </div> : null
                }
                {
                  (ranking && ranking.length == 1) ? <div className="Ranking-Container">
                      <p className="Ranking-Result-Item" style={{ fontSize: this.props.fontSize, }}> 全問正解者は、{ranking[0].name}さん一人でした！ </p>
                      <p className="Ranking-Result-Item" style={{ fontSize: this.props.fontSize, }}> おめでとう！ </p>
                  </div> : null
                }
                {
                  (ranking && ranking.length > 1) ? <div className="Ranking-Container">
                      <p className="Ranking-Result-Item" style={{ fontSize: this.props.fontSize, }}> １位は {ranking[0].name}さんでした！ </p>
                      <p className="Ranking-Result-Item" style={{ fontSize: this.props.fontSize, }}> おめでとう！ </p>
                  </div> : null
                }
              </div>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

Ranking.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  quizStartTime: 0,
  pages: [],
  quizAnswers: [],
  height: 0,
}

export default Ranking;

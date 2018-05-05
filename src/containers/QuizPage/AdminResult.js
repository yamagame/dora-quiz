import React, { Component } from 'react';
import { fontSize } from '../../reducers'

function dateStr(datestring) {
  const d = new Date(datestring);
  //d.setHours(d.getHours()-9);
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}時`;
}

class AdminResult extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const { result } = this.props;
    if (result.quizId) {
      if (result.startTime) {
        const answers = Object.keys(result.data.answers).sort();
        function resultItemStyle(str, q) {
          function checkItem() {
            if (result.data.question) {
              const { quiz } = result.data.question;
              if (quiz) {
                return quiz[q].answers.some( v => {
                  return (v == str)
                });
              }
              return null;
            }
          }
          const r = checkItem();
          if (r === true) {
            return {};
          } else
          if (r === false) {
            return {backgroundColor: '#ffdde3'};
          } else {
            return {};
          }
        }
        const playerName = (result.playerName) ? result.playerName : null;
        const startTime = result.startTime;
        return (
          //クイズ回答一覧
          <div className="Result">
            <p>
            {
              (playerName) ? <a href={`/?mode=admin-result&_quizId=${result.quizId}&_startTime=${startTime}`}> BACK </a> :  <a href={`/?mode=admin-result&_quizId=${result.quizId}`}> BACK </a>
            }
            </p>
            {
              answers.map( (q, i) => {
                return (
                  <div key={i}>
                      <p className="ResultTitle"> { q } : { (()=> {
                        const p = result.data.answers[q];
                        const total = Object.keys(p).length;
                        let collect = 0;
                        Object.keys(p).filter( clientId => {
                          if (typeof resultItemStyle(p[clientId].answer, q).backgroundColor === 'undefined') {
                            collect ++;
                          }
                        });
                        return `正答数 ${collect} / ${total} : 正答率 ${parseInt(collect*100/total)}%`;
                      })() } </p>
                      {
                        Object.keys(result.data.answers[q]).sort().filter( clientId => {
                          const name = result.data.answers[q][clientId].name;
                          return (playerName) ? (name === playerName) : true;
                        }).map( clientId => {
                          const name = result.data.answers[q][clientId].name;
                          return (
                            <p className="ResultItem" style={resultItemStyle(result.data.answers[q][clientId].answer, q)}>
                            <a style={{ width: 200, display: 'inline-block' }} href={`/?mode=admin-result&_quizId=${encodeURIComponent(result.quizId)}&_startTime=${startTime}&_playerName=${encodeURIComponent(name)}`}> {name} </a> :  <span> {result.data.answers[q][clientId].answer} </span>
                            </p>
                          )
                        })
                      }
                  </div>
                )
              })
            }
          </div>
        )
      } else {
        //クイズ時間一覧
        return (
          <div className="Result">
            <p> <a href="/?mode=admin-result"> BACK </a> </p>
            <p> {result.quizId} </p>
            {
              result.data.startTimes.map( (startTime, i) => {
                return (
                  <p key={i}>
                  <a style={{ width: 150, display: 'inline-block', }} href={`/?mode=admin-result&_quizId=${encodeURIComponent(result.quizId)}&_startTime=${startTime}`}> { `${dateStr(startTime)}` } </a>
                  <span> ({ startTime }) </span>
                  </p>
                )
              })
            }
          </div>
        )
      }
    } else {
      //クイズ一覧
      return (
        <div className="Result">
          {
            result.data.quizIds.map( (quizId, i) => {
              return (
                <p key={i}>
                <a href={`/?mode=admin-result&_quizId=${encodeURIComponent(quizId)}`}> { quizId } </a>
                </p>
              )
            })
          }
        </div>
      )
    }
  }
}

AdminResult.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  result: {},
}

export default AdminResult;

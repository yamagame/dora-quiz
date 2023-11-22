import React, { Component } from "react";
import { fontSize } from "../../reducers";
import Row from "../Row";
import PageButton from "../PageButton";
import Radar from "../Radar";

class Result extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.radarView) {
      setTimeout(() => {
        if (this.radarView) {
          this.radarView.initializeSVG();
        }
      }, 100);
    }
  }

  timeStr = () => {
    const _timeStr = (sec) => {
      if (sec <= 60) {
        return `${sec}秒 `;
      } else {
        if (this.getOption("minute-mode")) {
          return `${parseInt(sec / 60)}分 `;
        }
      }
      return `${sec}秒 `;
    };
    if (this.props.action === "question" || this.props.action === "quiz-init") {
      return `回答時間は ${_timeStr(this.props.time)}です`;
    } else {
      if (this.props.time === 0) {
        return `タイムアップ`;
      } else {
        return `あと ${_timeStr(this.props.time)}です`;
      }
    }
  };

  getOption = (key) => {
    const { options } = this.props;
    return options.indexOf(key) >= 0;
  };

  render() {
    const { title, messages, links, options } = this.props;
    const resultCount = this.props.pages
      .map((v) =>
        v.action === "quiz"
          ? v.answers.some((w) => w === this.props.playerAnswers[v.question])
            ? 1
            : 0
          : 0
      )
      .reduce((a, b) => a + b);
    const quizCount = this.props.pages
      .map((v) => (v.action === "quiz" ? 1 : 0))
      .reduce((a, b) => a + b);
    const resultMessage = (() => {
      if (resultCount === quizCount && quizCount !== 0)
        return "全問正解、おめでとう！";
      if (resultCount > 0)
        return "間違ったところは、学生講師から教えてもらってね！";
      return "学生講師から教えてもらってね！";
    })();
    const resultFontSize = (() => {
      if (resultCount === quizCount) return this.props.fontSize;
      return this.props.fontSize * 0.7;
    })();
    const quizPages = this.props.pages.filter((v) => v.action === "quiz");
    const categories = {};
    quizPages.forEach((v) => {
      if (v.category) {
        if (categories[v.category] == null) {
          categories[v.category] = {
            sum: 1,
            point: 0,
          };
        } else {
          categories[v.category].sum++;
        }
        if (v.answers.some((w) => w === this.props.playerAnswers[v.question])) {
          categories[v.category].point++;
        }
      }
    });
    const legend = Object.keys(categories).sort();
    const radar = {
      legend,
      data: legend.map((v) => {
        const cat = categories[v];
        if (cat && cat.sum > 0) {
          return cat.point / cat.sum;
        }
        return 0;
      }),
    };
    console.log(JSON.stringify(radar));
    console.log(JSON.stringify(this.props.pages));
    return (
      <div className="App">
        <div style={{ height: "99%" }}>
          <div style={{ padding: 16, height: "90%" }}>
            <Row style={{ height: "90%" }}>
              {this.props.pageCount > 1 ? (
                <PageButton
                  title="＜"
                  disabled={this.props.prevButtonStatus()}
                  fontSize={this.props.fontSize}
                  onClick={this.props.openPageHandller(-1)}
                />
              ) : null}
              <div style={{ width: "100%", margin: "auto" }}>
                {this.props.action !== "quiz-answer" ? (
                  <div>
                    {
                      <p
                        style={{
                          overflow: "hidden",
                          fontSize: this.props.fontSize * 0.5,
                          textAlign: "center",
                          margin: 32,
                          height: "5%",
                        }}
                      >
                        {" "}
                        {this.timeStr()}{" "}
                      </p>
                    }
                    <p
                      style={{
                        overflow: "hidden",
                        fontSize: this.props.fontSize * 0.7,
                      }}
                    >
                      {"解答まで、しばらくお待ちください"}
                    </p>
                    <p
                      style={{
                        overflow: "hidden",
                        fontSize: this.props.fontSize * 0.4,
                        marginTop: 10,
                      }}
                    >
                      {"※左上のボタンで解答のやりなおしができます"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p
                      className="Result-Item"
                      style={{
                        overflow: "hidden",
                        fontSize: this.props.fontSize * 1,
                      }}
                    >
                      {" "}
                      {this.props.name}さんは、{quizCount}問中、{resultCount}
                      問正解でした{" "}
                    </p>
                    {!this.getOption("hide-result-message") ? (
                      <p
                        className="Result-Item"
                        style={{
                          marginTop: this.props.fontSize * 0.1,
                          overflow: "hidden",
                          fontSize: resultFontSize * 1,
                        }}
                      >
                        {" "}
                        {resultMessage}{" "}
                      </p>
                    ) : null}
                    {this.getOption("radar-chart") ? (
                      <Radar
                        ref={(d) => (this.radarView = d)}
                        style={{
                          marginTop: this.props.fontSize,
                          height: this.props.height / 2,
                        }}
                        legend={radar.legend}
                        data={radar.data}
                      />
                    ) : null}
                  </div>
                )}
              </div>
              {this.props.pageCount > 1 ? (
                <PageButton
                  title="＞"
                  disabled={this.props.nextButtonStatus()}
                  fontSize={this.props.fontSize}
                  onClick={this.props.openPageHandller(+1)}
                />
              ) : null}
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

Result.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  width: 0,
  height: 0,
  title: "",
  messages: [],
  links: [],
  options: [],
  name: "",
  action: "",
  pages: [],
  playerAnswers: {},
  pageCount: 0,
  time: 0,

  prevButtonStatus: null,
  nextButtonStatus: null,
  openPageHandller: null,
};

export default Result;

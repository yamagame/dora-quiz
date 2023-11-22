import React, { Component } from "react";
import { fontSize } from "../../reducers";
import Column from "../Column";
import Row from "../Row";
import Text from "../Text";
import PageButton from "../PageButton";
import Image from "../Image";
import Button from "../Button";
import Bar from "../Bar";
import Container from "./Container";
import MathJax, {
  update as MathJaxUpdate,
  check as MathJaxCheck,
} from "../MathJax";

function buttonValue(v, width, height, host) {
  const style = {
    fontSize: "100%",
    marginTop: 0,
    pointerEvents: "none",
    height,
    verticalAlign: "middle",
  };
  if (typeof v !== "object") {
    return (
      <div style={style}>
        {" "}
        <MathJax value={v} />{" "}
      </div>
    );
  }
  if (v.image) {
    return (
      <div style={{ width: "100%" }}>
        <Image
          style={{
            margin: "auto",
            pointerEvents: "none",
            userSelect: "none",
          }}
          width={width}
          height={height + 10}
          src={host ? host + v.image : v.image}
        />
      </div>
    );
  }
  if ("fontScale" in v) style.fontSize = v.fontScale;
  if ("marginTop" in v) style.marginTop = parseFloat(v.marginTop);
  return (
    <div style={style}>
      {" "}
      <MathJax value={v.value} />{" "}
    </div>
  );
}

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  componentDidMount() { }

  componentDidUpdate() { }

  componentDidUpdate(nextProps) {
    if (
      this.props.question !== nextProps.question ||
      this.props.comment !== nextProps.comment
    ) {
      this.setState({
        isReady: false,
      });
    }
  }

  onReady = () => {
    this.setState(
      {
        isReady: true,
      },
      () => {
        if (
          MathJaxCheck(this.props.question) ||
          MathJaxCheck(this.props.comment)
        ) {
          MathJaxUpdate();
        }
      }
    );
  };

  timeStr = () => {
    if ("time" in this.props) {
      if (this.props.action === "question" || this.props.action === "quiz-init") {
        return `回答時間は ${this.props.time} 秒です`;
      } else {
        if (this.props.time === 0) {
          return `タイムアップ`;
        } else {
          return `あと ${this.props.time} 秒です`;
        }
      }
    }
    return "回答時間";
  };

  barColor = (maxnum, i) => {
    if (maxnum === 2) {
      const tbl = ["#00A2FF", "#FF3399"];
      return tbl[i];
    }
    return "cyan";
  };

  checkOption = key => {
    return this.props.options.some(v => {
      return v === key;
    });
  };

  selectedButton = v => {
    const t = typeof v !== "object" ? v : v.value;
    return (
      this.checkOption("final-answer") &&
      this.props.selects.some(v => {
        return v === t;
      })
    );
  };

  bottomSpace = ({
    shuffleChoices,
    sideImage,
    inlineFrame,
    buttonScale,
    buttonHeight,
    layout,
    optionButtons,
    fontSize,
    titleHeight,
  }) => {
    const timeHeight = this.checkOption("no-time")
      ? 0
      : fontSize + fontSize - 8;
    const windowHeight = this.props.height;
    const buttonHeight2 = buttonHeight + 25;
    const optionAdjust =
      optionButtons && optionButtons.length > 0 ? buttonHeight2 + 25 : 0;
    const titleSpace = this.checkOption("no-title") ? 0 : titleHeight + 8;
    const choiceLength =
      shuffleChoices && shuffleChoices.length > 0 ? shuffleChoices.length : 0;
    if (sideImage || inlineFrame) {
      const buttonAreaHeight =
        layout === "grid"
          ? Math.floor(choiceLength / 2) * buttonHeight2
          : choiceLength * buttonHeight2;
      const buttonDelta = choiceLength > 0 ? 28 : 0;
      let r =
        buttonAreaHeight +
        buttonDelta +
        optionAdjust +
        timeHeight +
        titleSpace +
        (choiceLength === 0) * 20;
      if (inlineFrame && optionButtons && optionButtons.length > 0) {
        r -= 40;
      }
      return r;
    }
    return 0;
  };

  render() {
    const _render = () => {
      if (
        this.props.showSum &&
        this.props.quizMaster &&
        this.props.sumQuestions
      ) {
        return this.renderSum();
      } else if (this.props.showSum) {
        return this.renderTwoChoices();
      } else {
        return this.renderChoices();
      }
    };
    return (
      <div className="App">
        {_render()}
        <p
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            position: "absolute",
            width: "100%",
            fontWeight: "bold",
            fontSize: this.props.fontSize,
            zIndex: 10,
            top: this.props.height - this.props.fontSize * 2,
          }}
        >
          {" "}
          {this.props.speech}{" "}
        </p>
      </div>
    );
  }

  renderChoices() {
    const {
      action,
      time,
      host,
      sideImage,
      inlineFrame,
      question,
      comment,
      choices,
      answers,
      layout,
      fontScale,
      options,
    } = this.props;
    const _fontScale =
      (fontScale ? fontScale : 1) * (this.checkOption("font-small") ? 0.8 : 1);
    const _choices = choices.filter(v => {
      if (typeof v !== "object" || v.type !== "option") return true;
      return false;
    });
    const optionButtons = choices.filter(v => {
      if (typeof v !== "object" || v.type !== "option") return false;
      return true;
    });
    const buttonScale = _fontScale * (sideImage || inlineFrame ? 1.0 : 1.0);
    const shuffleChoices =
      this.props.quizOrder && _choices.length === 4
        ? this.props.quizOrder.map(v => _choices[v])
        : _choices;
    const buttonStyle = this.checkOption("style-answer") ? "article" : "normal";
    const titleHeight =
      this.props.height / 4 / (sideImage || inlineFrame ? 3 : 1);
    const buttonHeight = parseInt(this.props.fontSize * buttonScale * 1.8, 10);
    const bottomSpace = this.bottomSpace({
      shuffleChoices,
      sideImage,
      inlineFrame,
      buttonScale,
      buttonHeight,
      layout,
      optionButtons,
      fontSize: this.props.fontSize,
      titleHeight,
    });
    return (
      <div className="App">
        <Row style={{ height: "99%" }}>
          {/*
            (sideImage) ? <div style={{ width: sideImage.aspect*this.props.height }}>
              <img src={sideImage.url}  width={ sideImage.aspect*this.props.height } height='100%' />
            </div> : null
          */}
          <Column style={{ margin: 8, marginTop: 8 }}>
            {!this.checkOption("no-title") ? (
              <div
                className="Button-Key"
                style={{
                  //height: (this.checkOption('font-small') ? '12%' : '25%'),
                  backgroundColor: this.checkOption("style-answer")
                    ? "#CDF"
                    : "white",
                }}
              >
                <Container
                  ref={d => (this.titleContainer = d)}
                  onUpdate={box => this.setState({ titleContainer: box })}
                >
                  <div
                    style={{
                      display: "flex",
                      //margin: 8,
                      //height: '100%',
                    }}
                  >
                    {this.props.pageCount > 1 ? (
                      <PageButton
                        title="＜"
                        disabled={this.props.prevButtonStatus()}
                        fontSize={(this.props.fontSize * 3) / 4}
                        onClick={this.props.openPageHandller(-1)}
                      />
                    ) : null}
                    {
                      <Text
                        ref={text => (this.titleText = text)}
                        style={{
                          textAlign: this.checkOption("center-title")
                            ? "center"
                            : "left",
                        }}
                        container={this.state.titleContainer}
                        fontSize={this.props.fontSize}
                        value={question}
                        comment={comment}
                        onLayout={this.onReady}
                        minHeight={
                          this.props.height /
                          4 /
                          (sideImage || inlineFrame ? 3 : 1)
                        }
                        maxHeight={titleHeight}
                      />
                    }
                    {/*
                      <p ref={ p => this.titleText = p } style={{
                        fontSize: this.props.fontSize,
                        textAlign: 'center',
                      }}> { question } </p>
                    */}
                    {/* <div style={{
                      width: '100%',
                      height: '100%',
                      //overflow: 'auto',
                      pointerEvents: 'none',
                    }}>
                    </div> */}
                    {this.props.pageCount > 1 ? (
                      <PageButton
                        title="＞"
                        disabled={
                          this.props.nextButtonStatus() &&
                          this.props.isAnswered(question)
                        }
                        fontSize={(this.props.fontSize * 3) / 4}
                        onClick={this.props.openPageHandller(+1)}
                      />
                    ) : null}
                  </div>
                </Container>
              </div>
            ) : null}
            {sideImage ? (
              <Row flex={false}>
                <div style={{ width: "100%" }}>
                  <Image
                    src={host ? host + sideImage.url : sideImage.url}
                    width={this.props.width - 32}
                    height={this.props.height - bottomSpace}
                    style={{
                      margin: "auto",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                </div>
              </Row>
            ) : null}
            {inlineFrame ? (
              <Row flex={false}>
                <div
                  style={{
                    width: "100%",
                    height: this.props.height - bottomSpace,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={inlineFrame.url}
                    style={{
                      width: "100%",
                      height:
                        this.props.height -
                        bottomSpace +
                        (inlineFrame.offsetBottom
                          ? inlineFrame.offsetBottom
                          : 0),
                      border: "none",
                    }}
                  />
                </div>
              </Row>
            ) : null}
            {/* {
              (sideImage) ? <Image src={(host) ? host+sideImage.url : sideImage.url} height={ this.props.height-((this.state.titleContainer) ? this.state.titleContainer.offsetHeight : 0) } /> : null
            } */}
            {shuffleChoices && shuffleChoices.length > 0 ? (
              <Row flex={false} style={{ height: "99%" }}>
                {
                  <div style={{ marginTop: 8, width: "100%" }}>
                    {this.checkOption("no-time") ? null : (
                      <p
                        style={{
                          overflow: "hidden",
                          fontSize: this.props.fontSize * 0.5,
                          textAlign: "center",
                          margin: this.props.fontSize / 2,
                          //marginBottom: this.props.fontSize*3/4,
                          height: this.props.fontSize,
                        }}
                      >
                        {" "}
                        {this.timeStr()}{" "}
                      </p>
                    )}
                    {layout === "grid" ? (
                      <div>
                        <Row style={{ height: "99%" }}>
                          {shuffleChoices
                            ? shuffleChoices
                              .filter(v => v)
                              .map((v, i) =>
                                i % 2 === 0 ? (
                                  <Button
                                    key={i}
                                    imageButton={v.image ? true : false}
                                    fontScale={buttonScale}
                                    height={buttonHeight}
                                    correct={
                                      answers &&
                                        (this.props.action === "quiz-answer" ||
                                          this.props.action === "answer")
                                        ? answers.some(
                                          t =>
                                            t ===
                                            (typeof v !== "object"
                                              ? v
                                              : v.value)
                                        )
                                        : false
                                    }
                                    selected={
                                      this.props.selectedHandller(
                                        this.props.playerAnswers[question],
                                        typeof v !== "object" ? v : v.value
                                      ) || this.selectedButton(v)
                                    }
                                    onClick={this.props.buttonHandller(
                                      question,
                                      typeof v !== "object" ? v : v.value
                                    )}
                                    buttonStyle={buttonStyle}
                                    fontColor={
                                      this.checkOption("style-deepblue")
                                        ? "white"
                                        : "black"
                                    }
                                    buttonBaseColor={
                                      this.checkOption("style-deepblue")
                                        ? "#0761A0"
                                        : "#CDF"
                                    }
                                  >
                                    {buttonValue(
                                      v,
                                      this.props.width / 2 - 30,
                                      buttonHeight - 30,
                                      host
                                    )}
                                  </Button>
                                ) : null
                              )
                            : null}
                        </Row>
                        <Row style={{ height: "99%" }}>
                          {shuffleChoices
                            ? shuffleChoices
                              .filter(v => v)
                              .map((v, i) =>
                                i % 2 === 1 ? (
                                  <Button
                                    key={i}
                                    imageButton={v.image ? true : false}
                                    fontScale={buttonScale}
                                    height={buttonHeight}
                                    correct={
                                      answers &&
                                        (this.props.action === "quiz-answer" ||
                                          this.props.action === "answer")
                                        ? answers.some(
                                          t =>
                                            t ===
                                            (typeof v !== "object"
                                              ? v
                                              : v.value)
                                        )
                                        : false
                                    }
                                    selected={
                                      this.props.selectedHandller(
                                        this.props.playerAnswers[question],
                                        typeof v !== "object" ? v : v.value
                                      ) || this.selectedButton(v)
                                    }
                                    onClick={this.props.buttonHandller(
                                      question,
                                      typeof v !== "object" ? v : v.value
                                    )}
                                    buttonStyle={buttonStyle}
                                    fontColor={
                                      this.checkOption("style-deepblue")
                                        ? "white"
                                        : "black"
                                    }
                                    buttonBaseColor={
                                      this.checkOption("style-deepblue")
                                        ? "#0761A0"
                                        : "#CDF"
                                    }
                                  >
                                    {buttonValue(
                                      v,
                                      this.props.width / 2 - 30,
                                      buttonHeight - 30,
                                      host
                                    )}
                                  </Button>
                                ) : null
                              )
                            : null}
                        </Row>
                      </div>
                    ) : (
                      <div>
                        {shuffleChoices
                          ? shuffleChoices
                            .filter(v => v)
                            .map((v, i) => (
                              <Button
                                key={i}
                                imageButton={v.image ? true : false}
                                fontScale={buttonScale}
                                height={buttonHeight}
                                correct={
                                  answers &&
                                    (this.props.action === "quiz-answer" ||
                                      this.props.action === "answer")
                                    ? answers.some(
                                      t =>
                                        t ===
                                        (typeof v !== "object"
                                          ? v
                                          : v.value)
                                    )
                                    : false
                                }
                                selected={
                                  this.props.selectedHandller(
                                    this.props.playerAnswers[question],
                                    typeof v !== "object" ? v : v.value
                                  ) || this.selectedButton(v)
                                }
                                onClick={this.props.buttonHandller(
                                  question,
                                  typeof v !== "object" ? v : v.value
                                )}
                                buttonStyle={buttonStyle}
                                fontColor={
                                  this.checkOption("style-deepblue")
                                    ? "white"
                                    : "black"
                                }
                                buttonBaseColor={
                                  this.checkOption("style-deepblue")
                                    ? "#0761A0"
                                    : "#CDF"
                                }
                              >
                                {buttonValue(
                                  v,
                                  this.props.width,
                                  buttonHeight - 30,
                                  host
                                )}
                              </Button>
                            ))
                          : null}
                      </div>
                    )}
                  </div>
                }
              </Row>
            ) : null}
            {optionButtons && optionButtons.length > 0 ? (
              <div style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                <Row>
                  {optionButtons.map((v, i) => {
                    return (
                      <Button
                        key={i}
                        imageButton={v.image ? true : false}
                        fontScale={buttonScale}
                        height={buttonHeight}
                        correct={
                          answers &&
                            (this.props.action === "quiz-answer" ||
                              this.props.action === "answer")
                            ? answers.some(
                              t => t === (typeof v !== "object" ? v : v.value)
                            )
                            : false
                        }
                        selected={
                          this.props.selectedHandller(
                            this.props.playerAnswers[question],
                            typeof v !== "object" ? v : v.value
                          ) || this.selectedButton(v)
                        }
                        onClick={this.props.buttonHandller(
                          question,
                          typeof v !== "object" ? v : v.value
                        )}
                        buttonStyle={buttonStyle}
                        fontColor={
                          this.checkOption("style-deepblue") ? "white" : "black"
                        }
                        buttonBaseColor={
                          this.checkOption("style-deepblue")
                            ? "#0761A0"
                            : "#CDF"
                        }
                      >
                        {buttonValue(
                          v,
                          this.props.width,
                          buttonHeight - 30,
                          host
                        )}
                      </Button>
                    );
                  })}
                </Row>
              </div>
            ) : null}
          </Column>
        </Row>
      </div>
    );
  }

  renderTwoChoices() {
    const {
      action,
      time,
      host,
      sideImage,
      inlineFrame,
      question,
      comment,
      choices,
      answers,
      layout,
      fontScale,
      options,
    } = this.props;
    const shuffleChoices = choices.filter(v => {
      if (typeof v !== "object" || v.type !== "option") return true;
      return false;
    });
    const optionButtons = choices.filter(v => {
      if (typeof v !== "object" || v.type !== "option") return false;
      return true;
    });
    return (
      <div className="App">
        <Row style={{ height: "99%" }}>
          {/*
            (sideImage) ? <div style={{ width: sideImage.aspect*this.props.height }}>
              <img src={sideImage.url}  width={ sideImage.aspect*this.props.height } height='100%' />
            </div> : null
          */}
          <Column style={{ margin: 8, marginTop: 16 }}>
            <Container
              ref={d => (this.titleContainer = d)}
              //style={{ height: '25%', }}
              onUpdate={box => this.setState({ titleContainer: box })}
            >
              <div
                style={{
                  //margin: this.props.fontSize/2,
                  display: "flex",
                  //margin: 8,
                  //height: '100%',
                }}
              >
                {this.props.pageCount > 1 ? (
                  <PageButton
                    title="＜"
                    disabled={this.props.prevButtonStatus()}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(-1)}
                  />
                ) : (
                  <div
                    style={{ display: "inline", width: this.props.fontSize }}
                  >
                    {" "}
                  </div>
                )}
                <Text
                  ref={text => (this.titleText = text)}
                  style={{
                    textAlign: "left",
                  }}
                  container={this.state.titleContainer}
                  fontSize={this.props.fontSize}
                  value={question}
                  comment={comment}
                  onLayout={this.onReady}
                  minHeight={
                    this.props.height / 4 / (sideImage || inlineFrame ? 3 : 1)
                  }
                  maxHeight={
                    this.props.height / 4 / (sideImage || inlineFrame ? 3 : 1)
                  }
                />
                {/*
                  <p ref={ p => this.titleText = p } style={{
                    fontSize: this.props.fontSize,
                    textAlign: 'center',
                  }}> { question } </p>
                */}
                {/* <div style={{
                  width: '100%',
                  overflow: 'auto',
                }}>
                </div> */}
                {this.props.pageCount > 1 ? (
                  <PageButton
                    title="＞"
                    disabled={
                      this.props.nextButtonStatus() &&
                      this.props.isAnswered(question)
                    }
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(+1)}
                  />
                ) : (
                  <div
                    style={{ display: "inline", width: this.props.fontSize }}
                  >
                    {" "}
                  </div>
                )}
              </div>
            </Container>
            {sideImage ? (
              <Row>
                <div style={{ width: "100%" }}>
                  <Image
                    src={host ? host + sideImage.url : sideImage.url}
                    width={this.props.width - 32}
                    height={
                      this.props.height -
                      200 -
                      this.props.height / 4 / (sideImage || inlineFrame ? 2 : 1)
                    }
                    style={{ margin: "auto", userSelect: "none" }}
                  />
                </div>
              </Row>
            ) : null}
            {inlineFrame ? (
              <Row>
                <div style={{ width: "100%" }}>
                  <iframe
                    src={inlineFrame.url}
                    style={{
                      width: "100%",
                      height:
                        this.props.height -
                        160 -
                        this.props.height /
                        4 /
                        (sideImage || inlineFrame ? 2 : 1),
                      border: "none",
                    }}
                  />
                </div>
              </Row>
            ) : null}
            {this.props.time !== null && !this.checkOption("no-time") ? (
              <p
                style={{
                  overflow: "hidden",
                  fontSize: this.props.fontSize * 0.5,
                  textAlign: "center",
                  margin:
                    sideImage || inlineFrame ? 0 : this.props.fontSize / 2,
                  //marginBottom: this.props.fontSize*3/4,
                  height: this.props.fontSize,
                }}
              >
                {" "}
                {this.timeStr()}{" "}
              </p>
            ) : null}
            {shuffleChoices && shuffleChoices.length > 0 ? (
              <div>
                {sideImage || inlineFrame ? (
                  <div
                    style={{
                      position: "absolute",
                      top: this.props.height - 150,
                      width: this.props.width - 20,
                    }}
                  >
                    <Row style={{ height: "99%" }}>
                      {shuffleChoices
                        ? shuffleChoices.map((v, i) =>
                          v ? (
                            <Button
                              key={i}
                              imageButton={v.image ? true : false}
                              fontScale={
                                fontScale *
                                (this.checkOption("half-button") ? 0.5 : 1)
                              }
                              height={100}
                              //margin={this.props.fontSize*0.5}
                              paddingTop={0}
                              paddingBottom={0}
                              correct={
                                answers &&
                                  (this.props.action === "quiz-answer" ||
                                    this.props.action === "answer")
                                  ? answers.some(
                                    t =>
                                      t ===
                                      (typeof v !== "object" ? v : v.value)
                                  )
                                  : false
                              }
                              selected={
                                this.props.selectedHandller(
                                  this.props.playerAnswers[question],
                                  typeof v !== "object" ? v : v.value
                                ) || this.selectedButton(v)
                              }
                              onClick={this.props.buttonHandller(
                                question,
                                typeof v !== "object" ? v : v.value
                              )}
                              fontColor={
                                this.checkOption("style-deepblue")
                                  ? "white"
                                  : "black"
                              }
                              buttonBaseColor={
                                this.checkOption("style-deepblue")
                                  ? "#0761A0"
                                  : "#CDF"
                              }
                            >
                              {buttonValue(v, 100, host)}
                            </Button>
                          ) : null
                        )
                        : null}
                    </Row>
                  </div>
                ) : (
                  <Row style={{ height: "99%" }}>
                    {shuffleChoices
                      ? shuffleChoices.map((v, i) =>
                        v ? (
                          <Button
                            key={i}
                            imageButton={v.image ? true : false}
                            fontScale={
                              fontScale *
                              (this.checkOption("half-button") ? 0.5 : 1)
                            }
                            height={this.props.fontSize * 5}
                            margin={this.props.fontSize * 0.5}
                            paddingTop={this.props.fontSize * 2}
                            correct={
                              answers &&
                                (this.props.action === "quiz-answer" ||
                                  this.props.action === "answer")
                                ? answers.some(
                                  t =>
                                    t ===
                                    (typeof v !== "object" ? v : v.value)
                                )
                                : false
                            }
                            selected={
                              this.props.selectedHandller(
                                this.props.playerAnswers[question],
                                typeof v !== "object" ? v : v.value
                              ) || this.selectedButton(v)
                            }
                            onClick={this.props.buttonHandller(
                              question,
                              typeof v !== "object" ? v : v.value
                            )}
                            fontColor={
                              this.checkOption("style-deepblue")
                                ? "white"
                                : "black"
                            }
                            buttonBaseColor={
                              this.checkOption("style-deepblue")
                                ? "#0761A0"
                                : "#CDF"
                            }
                          >
                            {buttonValue(v, this.props.fontSize * 3, host)}
                          </Button>
                        ) : null
                      )
                      : null}
                  </Row>
                )}
              </div>
            ) : null}
          </Column>
        </Row>
      </div>
    );
  }

  renderSum() {
    const {
      action,
      time,
      host,
      sideImage,
      inlineFrame,
      question,
      comment,
      choices,
      answers,
      layout,
      fontScale,
    } = this.props;
    let maxValue = 10;
    const shuffleChoices = choices.filter(v => {
      if (typeof v !== "object" || v.type !== "option") return true;
      return false;
    });
    const optionButtons = choices.filter(v => {
      if (typeof v !== "object" || v.type !== "option") return false;
      return true;
    });
    if (this.props.sumQuestions) {
      if (shuffleChoices) {
        shuffleChoices.forEach((v, i) => {
          if (typeof v === "undefined") return;
          const q = this.props.sumQuestions[this.props.question];
          if (q) {
            const w = q[v];
            if (maxValue < w) maxValue = w + 5;
          }
        });
      }
    }
    const shuffleChoicesLength = shuffleChoices.filter(v => {
      return v;
    }).length;
    return (
      <div className="App">
        <Row style={{ height: "99%" }}>
          {/*
            (sideImage) ? <div style={{ width: sideImage.aspect*this.props.height }}>
              <img src={sideImage.url}  width={ sideImage.aspect*this.props.height } height='100%' />
            </div> : null
          */}
          <Column
            style={
              {
                /* margin: 8, marginTop: 16, */
              }
            }
          >
            <Container
              ref={d => (this.titleContainer = d)}
              //style={{ height: '10%', }}
              onUpdate={box => this.setState({ titleContainer: box })}
            >
              <div
                style={{
                  display: "flex",
                  margin: this.props.fontSize / 2,
                  //margin: 8,
                  //height: '100%',
                }}
              >
                {this.props.pageCount > 1 ? (
                  <PageButton
                    title="＜"
                    disabled={this.props.prevButtonStatus()}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(-1)}
                  />
                ) : (
                  <div
                    style={{ display: "inline", width: this.props.fontSize }}
                  >
                    {" "}
                  </div>
                )}
                <Text
                  ref={text => (this.titleText = text)}
                  style={{
                    textAlign: "left",
                  }}
                  container={this.state.titleContainer}
                  fontSize={this.props.fontSize}
                  value={question}
                  comment={comment}
                  onLayout={this.onReady}
                  minHeight={
                    this.props.height / 4 / (sideImage || inlineFrame ? 3 : 1)
                  }
                  maxHeight={
                    this.props.height / 4 / (sideImage || inlineFrame ? 3 : 1)
                  }
                />
                {/*
                  <p ref={ p => this.titleText = p } style={{
                    fontSize: this.props.fontSize,
                    textAlign: 'center',
                  }}> { question } </p>
                */}
                {/* <div style={{
                  width: '100%',
                  overflow: 'auto',
                }}>
                </div> */}
                {this.props.pageCount > 1 ? (
                  <PageButton
                    title="＞"
                    disabled={
                      this.props.nextButtonStatus() &&
                      this.props.isAnswered(question)
                    }
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(+1)}
                  />
                ) : (
                  <div
                    style={{ display: "inline", width: this.props.fontSize }}
                  >
                    {" "}
                  </div>
                )}
              </div>
            </Container>
            {sideImage ? (
              <Row>
                <div style={{ width: "100%" }}>
                  <Image
                    src={host ? host + sideImage.url : sideImage.url}
                    width={this.props.width - 32}
                    height={
                      this.props.height -
                      200 -
                      this.props.height / 4 / (sideImage ? 2 : 1)
                    }
                    style={{ margin: "auto", userSelect: "none" }}
                  />
                </div>
              </Row>
            ) : this.props.sumQuestions ? (
              <div style={{ margin: "auto" }}>
                <Row>
                  {shuffleChoices
                    ? shuffleChoices
                      .filter(v => v)
                      .map((v, i) => {
                        if (typeof v === "undefined") return null;
                        return (
                          <Bar
                            key={i}
                            maxValue={maxValue}
                            label={v}
                            value={
                              this.props.sumQuestions[this.props.question]
                                ? this.props.sumQuestions[
                                this.props.question
                                ][v]
                                : 0
                            }
                            fontSize={this.props.fontSize}
                            width={this.props.fontSize * 4}
                            height={this.props.height * 0.4}
                            color={this.barColor(shuffleChoicesLength, i)}
                          />
                        );
                      })
                    : null}
                </Row>
              </div>
            ) : null}
            {sideImage && this.props.sumQuestions ? (
              <div style={{}}>
                <Column>
                  {shuffleChoices
                    ? shuffleChoices
                      .filter(v => v)
                      .map((v, i) => {
                        if (typeof v === "undefined") return null;
                        return (
                          <Bar
                            key={i}
                            maxValue={maxValue}
                            label={v}
                            horozontal
                            value={
                              this.props.sumQuestions[this.props.question]
                                ? this.props.sumQuestions[
                                this.props.question
                                ][v]
                                : 0
                            }
                            fontSize={this.props.fontSize}
                            width={this.props.width}
                            height={this.props.fontSize * 2}
                            color={this.barColor(shuffleChoicesLength, i)}
                          />
                        );
                      })
                    : null}
                </Column>
              </div>
            ) : null}
          </Column>
        </Row>
      </div>
    );
  }
}

Select.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  quizOrder: null,
  action: "",
  options: [],
  selects: [],
  speech: null,
  time: null,
  host: null,
  sideImage: null,
  inlineFrame: null,
  question: null,
  comment: null,
  choices: null,
  answers: null,
  layout: null,
  fontScale: null,
  pageCount: 0,
  width: 0,
  height: 0,
  playerAnswers: {},
  sumQuestions: {},
  showSum: false,
  quizMaster: false,

  selectedHandller: null,
  buttonHandller: null,
  openPageHandller: null,
  prevButtonStatus: null,
  nextButtonStatus: null,
  isAnswered: null,
};

export default Select;

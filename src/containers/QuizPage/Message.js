import React, { Component } from "react";
import { fontSize } from "../../reducers";
import Row from "../Row";
import Container from "./Container";
import Column from "../Column";
import Button from "../Button";
import PageButton from "../PageButton";

function buttonValue(v, height, host) {
  if (typeof v !== "object") {
    return <p> {v} </p>;
  }
  if (v.image) {
    return (
      <div style={{ marginTop: 10 }}>
        <img
          style={{ margin: "auto", padding: 0, pointerEvents: "none" }}
          height={height - 4}
          src={host ? host + v.image : v.image}
        />
      </div>
    );
  }
  return <p> {v.value} </p>;
}

class Message extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, fontScale, messages, links } = this.props;
    return (
      <div className="App">
        <Row style={{ height: "99%" }}>
          {/*
            (sideImage) ? <div style={{ width: sideImage.aspect*this.props.height }}>
              <img src={sideImage.url}  width={ sideImage.aspect*this.props.height } height='100%' />
            </div> : null
          */}
          <Column style={{ margin: 8, marginTop: 16 }}>
            {this.props.pageCount > 1 ? (
              <Container
                ref={(d) => (this.titleContainer = d)}
                style={{ height: "15%" }}
                onUpdate={(box) => this.setState({ titleContainer: box })}
              >
                <div
                  style={{
                    display: "flex",
                    //margin: 8,
                    //height: '100%',
                  }}
                >
                  <PageButton
                    title="＜"
                    disabled={this.props.prevButtonStatus()}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(-1)}
                  />
                  <div
                    style={{
                      width: "100%",
                      overflow: "auto",
                    }}
                  ></div>
                  <PageButton
                    title="＞"
                    disabled={this.props.nextButtonStatus()}
                    fontSize={this.props.fontSize}
                    onClick={this.props.openPageHandller(+1)}
                  />
                </div>
              </Container>
            ) : null}
            <Row>
              <div style={{ margin: "auto" }}>
                <div style={{ width: "100%" }}>
                  <p
                    style={{
                      overflow: "hidden",
                      marginBottom: 30,
                      fontSize:
                        this.props.fontSize * (fontScale ? fontScale : 0.7),
                    }}
                  >
                    {title}
                  </p>
                </div>
                {messages
                  ? messages.map((v, i) => (
                      <Button key={i}>
                        {buttonValue(v, this.props.fontSize)}
                      </Button>
                    ))
                  : null}
                {links
                  ? links.map((v, i) => (
                      <a
                        key={i}
                        href={v.url}
                        style={{
                          fontSize: this.props.fontSize,
                        }}
                        target="_blank"
                      >
                        {" "}
                        {v.title}{" "}
                      </a>
                    ))
                  : null}
              </div>
            </Row>
          </Column>
        </Row>
      </div>
    );
  }
}

Message.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  title: "",
  fontScale: 1,
  messages: [],
  links: [],

  prevButtonStatus: null,
  nextButtonStatus: null,
  openPageHandller: null,
};

export default Message;

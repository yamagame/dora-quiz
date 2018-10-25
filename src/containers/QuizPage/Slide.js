import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';
import Row from '../Row';
import Image from '../Image';
import Area from '../Area';
import PageButton from '../PageButton';
import Button from '../Button';
import Container from './Container';
import { getHost } from '../../utils';

const notSelectable = {
  userSelect: 'none',
}

const slideTitle = {
  fontSize: 60,
  userSelect: 'none',
  margin: 'auto',
  color: '#0080FF',
}

class Slide extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    if (this.areaView) {
      setTimeout(() => {
        if (this.areaView) {
          this.areaView.initializeSVG(this.imageView);
        }
      }, 100)
    }
  }

  render() {
    return (
      <div className="App">
        {
          this.renderPage()
        }
        <p style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          position: 'absolute' ,
          width: '100%',
          fontWeight: 'bold',
          fontSize: this.props.fontSize,
          top: this.props.height-this.props.fontSize*2,
        }}> { this.props.speech } </p>
      </div>
    )
  }

  renderPage() {
    const startScreen = this.props.startScreen;
    const { host, photo } = this.props;
    const width = (this.props.pageCount>1) ? (this.props.width-32-this.props.fontSize*2) : this.props.width-32;
    const height = (this.props.pageCount>1) ? (this.props.height-32-this.props.fontSize*2) : this.props.height-32;
    return <div className="App">
      {
        (startScreen) ? <Row style={{ height: this.props.fontSize*1.5, backgroundColor: '#D5FDF8' }}>
          <h1 style={{ ...slideTitle, fontSize: this.props.fontSize, }}> { this.props.title } </h1>
        </Row> : null
      }
      <Row style={{ height: height-(100+this.props.fontSize*1.5)*(startScreen?1:0), }}>
        <Column style={{ margin: 8, marginTop: 16, }}>
          {
            (this.props.pageCount>1) ? <Container ref={ d => this.titleContainer = d } style={{ height: '10%', }} onUpdate={ box => this.setState({ titleContainer: box }) }>
              <div style={{
                display: 'flex',
              }}>
                <PageButton
                title="＜"
                disabled={this.props.prevButtonStatus()}
                fontSize={this.props.fontSize}
                onClick={this.props.openPageHandller(-1)}/>
                <div style={{
                  width: '100%',
                  overflow: 'auto',
                }}>
                </div>
                <PageButton
                title="＞"
                disabled={this.props.nextButtonStatus()}
                fontSize={this.props.fontSize}
                onClick={this.props.openPageHandller(+1)}/>
              </div>
            </Container> : null
          }
          <Row>
            <div style={{ width: '100%', }} >
              {
                (photo) ? (
                  <Image
                    ref={img => this.imageView = img }
                    src={getHost(host, photo)}
                    width={width}
                    height={height-(100+this.props.fontSize*1.5)*(startScreen?1:0)}
                    style={{ margin: 'auto', ...notSelectable, }}
                    offsetY__={16}
                  >
                    {
                      (this.props.area) ? <Area
                        ref={ d => this.areaView = d }
                        data={this.props.area}
                        editable={false}
                        onClick={this.props.onClickArea}
                      /> : null
                    }
                  </Image>
                 ) : null
              }
            </div>
          </Row>
        </Column>
      </Row>
      {
        (startScreen) ? <Row>
          <Button
            //fontScale={_fontScale}
            //correct={(answers && (this.props.action === 'quiz-answer' || this.props.action === 'answer')) ? answers.some( t => t === ((typeof v !== 'object') ? v : v.value)) : false}
            selected={true}
            pushedColor="yellow"
            onClick={this.props.startButtonHandller}
            buttonStyle="normal"
          >
            スタート
          </Button>
        </Row> : null
      }
    </div>
  }
}

Slide.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  width: 0,
  height: 0,
  pageCount: 0,
  host: null,
  photo: null,
  speech: null,
  title: null,
  startScreen: false,
  area: null,

  prevButtonStatus: null,
  nextButtonStatus: null,
  openPageHandller: null,
  startButtonHandller: null,
  onClickArea: null,
}

export default Slide;

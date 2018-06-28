import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';
import Row from '../Row';
import Image from '../Image';
import PageButton from '../PageButton';
import Container from './Container';

class Slide extends Component {
  constructor (props) {
    super(props);
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
    const { host, photo } = this.props;
    function getHost(host, photo) {
      if (host) {
        return host ? host+photo : photo;
      } else {
        const port = (window.location.port == 3000) ? 3090 : window.location.port;
        const host = `${window.location.protocol}//${window.location.hostname}:${port}/`;
        const pmatch = photo.match('(.+)\:/\/\(.*?)\/(.+)');
        if (pmatch) {
          var photourl = pmatch[3];
        } else {
          var photourl = photo;
        }
        return host ? host+photourl : photourl;
      }
    }
    const width = (this.props.pageCount>1) ? (this.props.width-32-this.props.fontSize*2) : this.props.width-32;
    const height = (this.props.pageCount>1) ? (this.props.height-32-this.props.fontSize*2) : this.props.height-32;
    return (
      <div className="App">
        <Row style={{ height: '99%', }}>
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
                  (photo) ? <Image ref={img => this.imageView = img } src={getHost(host, photo)} width={width} height={height} style={{ margin: 'auto', }}/> : null
                }
              </div>
            </Row>
         </Column>
        </Row>
      </div>
    )
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

  prevButtonStatus: null,
  nextButtonStatus: null,
  openPageHandller: null,
}

export default Slide;

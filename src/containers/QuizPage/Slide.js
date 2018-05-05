import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';
import Row from '../Row';
import Image from '../Image';
import PageButton from '../PageButton';

class Slide extends Component {
  constructor (props) {
    super(props);
  }

  render() {
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
    const width = this.props.width-this.props.fontSize*2-((this.props.fontSize/2<15) ? 15 : this.props.fontSize/2)*4-32;
    const height = this.props.height-32;
    return (
      <div className="App">
        <div style={{ height: '99%', }}>
          <div style={{ padding: 16, height: this.props.height-32, }} >
          <Row style={{ height: '100%', }}>
            {
              (this.props.pageCount>1) ? <PageButton
              title="＜"
              disabled={this.props.prevButtonStatus()}
              fontSize={this.props.fontSize}
              onClick={this.props.openPageHandller(-1)}/> : null
            }
            <div style={{ width: '100%', }} >
              {
                (photo) ? <Image ref={img => this.imageView = img } src={getHost(host, photo)} width={width} height={height} style={{ margin: 'auto', }}/> : null
              }
              {/*
                (photo) ? <Image src={photo} style={{ height: '98%', marginButton: 0, }}/> : null
              */}
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

  prevButtonStatus: null,
  nextButtonStatus: null,
  openPageHandller: null,
}

export default Slide;

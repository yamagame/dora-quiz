import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';
import Button from '../Button';

function buttonValue(v, height, host) {
  if (typeof v !== 'object') {
    return <p> { v } </p>;
  }
  if (v.image) {
    return <div style={{ marginTop: 10, }} ><img style={{ margin: 'auto', padding: 0, pointerEvents: 'none', }} height={height-4} src={(host) ? host+v.image : v.image} /></div>
  }
  return <p> { v.value } </p>;
}

class Message extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const { title, fontScale, messages, links } = this.props;
    return (
      <div className="App">
        <Column style={{ height: '100%', }}>
          <div style={{ marginTop: 'auto', marginBottom: 'auto', position: 'relative', top: -20 }}>
            <div style={{ width: '100%', }}>
              <p style={{
                overflow: 'hidden',
                marginBottom: 30,
                fontSize: this.props.fontSize*(fontScale ? fontScale : 0.7),
              }}>
                { title }
              </p>
            </div>
            {
              messages ? messages.map( (v,i) => (
                <Button key={i}>
                  {
                    buttonValue(v, this.props.fontSize)
                  }
                </Button>
              )) : null
            }
            {
              links ? links.map( (v,i) => (
                <a key={i} href={v.url} style={{
                  fontSize: this.props.fontSize,
                }} target="_blank"> {v.title} </a>
              )) : null
            }
          </div>
        </Column>
      </div>
    )
  }
}

Message.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  title: '',
  fontScale: 1,
  messages: [],
  links: [],
}

export default Message;

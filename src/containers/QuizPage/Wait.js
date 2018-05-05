import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';

class Wait extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Column style={{ height: '100%', }}>
          <div style={{ margin: 'auto', width: '100%', }}>
            <p style={{
              overflow: 'hidden',
              fontSize: this.props.fontSize*1.2,
              textAlign: 'middle',
              margin: 8,
              flex: 1,
            }}> 早押しロボクイズ </p>
            <p style={{
              flex: 1,
              fontSize: this.props.fontSize*0.4,
            }}>
              メッセージを待っています...
            </p>
            <div style={{
              width: '50%',
              margin: 'auto',
              marginTop: 20,
            }}>
              <p style={{
                fontSize: this.props.fontSize,
              }}> {this.props.name} </p>
              <input type="button" value="名前を変更する" onClick={this.props.onChangeName} />
            </div>
          </div>
        </Column>
      </div>
    )
  }
}

Wait.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  name: '',
  
  onChangeName: null,
}

export default Wait;

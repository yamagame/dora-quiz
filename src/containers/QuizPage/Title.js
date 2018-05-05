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

class Title extends Component {
  constructor (props) {
    super(props);
    this.state = {
      name: props.name,
    }
  }

  componentDidMount() {
    if (this.entryName) {
      this.entryName.value = this.state.name;
    }
  }

  render() {
    return (
      <div className="App">
        <Column style={{ height: '100%', }}>
          <div style={{ margin: 'auto', width: '100%', }}>
            <div style={{ marginBottom: 100, }}>
              <p style={{
                overflow: 'hidden',
                fontSize: this.props.fontSize,
                textAlign: 'middle',
                margin: 8,
                flex: 1,
              }}> 早押しロボクイズ </p>
              <div style={{ fontSize: this.props.fontSize*0.5, flex: 1, margin: 30, marginBottom: 0 }}>
                <label> あなたの名前： </label>
                <input ref={ d => this.entryName = d } type="text" className="Name-Input"/>
              </div>
              <select name="members" style={{
                appearance: 'none',
                marginLeft: 100,
                marginBottom: 30,
                border: '1px solid #999',
                //background: '#eee',
                width: '25%',
                height: 32,
              }} onChange={
                (event) => {
                  if (event.target.value !== '-') {
                    this.entryName.value = event.target.value;
                  }
                }
              }>
                {
                  (this.props.members) ? this.props.members.map( (p, i) => {
                    return <option value={p} key={i}> {p} </option>
                  }) : null
                }
              </select>
              <div style={{
                flex: 1,
                width: '30%',
                margin: 'auto',
              }}>
                <div>
                  <Button onClick={() => {
                    if (this.props.onStartQuiz) {
                      this.props.onStartQuiz(this.entryName.value);
                    }
                  }}>
                    {
                      buttonValue("スタート", this.props.fontSize*4)
                    }
                  </Button>
                </div>
              </div>
              <p style={{
                flex: 1,
                fontSize: this.props.fontSize*0.4,
              }}>
                名前を選択してスタートボタンをクリックしてね！
              </p>
              <p style={{
                flex: 1,
                fontSize: this.props.fontSize*0.4,
              }}>
                名前はランキング表示に使われるよ。
              </p>
            </div>
          </div>
        </Column>
      </div>
    )
  }
}

Title.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  name: '',

  onStartQuiz: null,
}

export default Title;

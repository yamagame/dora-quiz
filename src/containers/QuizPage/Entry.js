import React, { Component } from 'react';
import { fontSize } from '../../reducers'
import Column from '../Column';
import Row from '../Row';
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

function EntryTable({ entry, fontSize }) {
  const names = Object.keys(entry).map( (v,i) => entry[v].name);
  const table = [];
  names.forEach( (name, i) => {
    const n = parseInt(i / 15);
    if (typeof table[n] === 'undefined') {
      table[n] = [];
    }
    table[n].push(name);
  });
  return (
    <Row>
      {
        table.map( (names, i) => {
          return (
            <Column style={{ height: '100%', }} key={i}>
            {
              names.map( (name,j) => (
                <p style={{ fontSize }} key={`${i}-${j}`} > {name} </p>
              ))
            }
            </Column>
          )
        })
      }
    </Row>
  )
}

class Entry extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const { title, messages, entry } = this.props;
    return (
      <div className="App">
        <Column style={{ height: '100%', }}>
          <div style={{ marginTop: 'auto', marginBottom: 'auto', position: 'relative', top: -20 }}>
            <div style={{ width: '100%', }}>
              <p style={{
                overflow: 'hidden',
                marginBottom: 30,
                fontSize: this.props.fontSize*0.7,
              }}>
                { title }
              </p>
            </div>
            {
              (messages) ? messages.map( (v,i) => (
                <Button key={i}>
                  {
                    buttonValue(v, this.props.fontSize)
                  }
                </Button>
              )) : null
            }
            {
              (entry) ? <EntryTable entry={entry} fontSize={ this.props.fontSize*0.5 } /> :null
            }
          </div>
        </Column>
      </div>
    )
  }
}

Entry.defaultProps = {
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
  title: '',
  messages: [],
  entry: {},
}

export default Entry;

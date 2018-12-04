import React, { Component } from 'react';
import { fontSize } from '../../reducers';
import pathParse from 'path-parse';
import Column from '../Column';
import Row from '../Row';
import Image from '../Image';
import Area from '../Area';
import PageButton from '../PageButton';
import Button from '../Button';
import Container from './Container';
import { getHost } from '../../utils';
import AreaDialog from '../AreaDialog';
import DataDialog from '../DataDialog';

const notSelectable = {
  userSelect: 'none',
}

const slideTitle = {
  fontSize: 60,
  userSelect: 'none',
  margin: 'auto',
  color: '#0080FF',
}

function basename(path) {
  const p = pathParse(path);
  if (p) {
    return p.base;
  }
  return '';
}

class Slide extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: {
        image: basename(props.photo),
        area: props.area,
      },
      showEditDialog: false,
      showDataDialog: false,
      value: {},
      index: 0,
    }
    this.updateTimer = null;
    this.saveTimer = null;
  }

  componentDidMount() {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      if (this.areaView && this.imageView) {
        this.areaView.initializeSVG(this.imageView);
        this.forceUpdate();
      }
    }, 100)
  }

  componentWillReceiveProps(nextProps) {
    let updateState = false;
    const data = { ...this.state.data }
    if (this.props.area !== nextProps.area) {
      data.area = nextProps.area;
      updateState = true;
    }
    if (this.props.photo !== nextProps.photo) {
      data.image = basename(nextProps.photo);
      updateState = true;
    }
    if (updateState) {
      this.setState({
        data,
      }, () => {
        if (this.updateTimer) clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
          if (this.areaView && this.imageView) {
            this.areaView.initializeSVG(this.imageView);
            this.forceUpdate();
          }
        }, 100)
      })
    }
  }

  componentWillUnmount() {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = null;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = null;
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

  saveArea = () => {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      if (this.props.saveImageMap) {
        let photo = this.props.photo;
        if (photo.indexOf('images/') == 0) {
          photo = photo.replace('images/', '');
        }
        this.props.saveImageMap(photo, this.saveText());
      }
    }, 1000)
  }

  loadText = (d) => {
    const t = d.replace('export default ', '').replace(';', '');
    const data = JSON.parse(t);
    this.setState({
      data,
    })
  }

  saveText = () => {
    let t = '';
    this.state.data.area.forEach( (r,i) => {
      const c = { ...r }
      delete c.selected;
      if (i > 0) t += `,\n`;
      t += `    {${Object.keys(c).map( k => {
        if (typeof c[k] === 'string') {
          return ` "${k}": "${c[k]}"`;
        } else {
          return ` "${k}": ${c[k]}`;
        }
      }).join(',')} }`;
    })
    return `{\n  "image": "${this.state.data.image}",\n  "area": [\n${t}\n  ]\n}\n`;
  }

  onAction = (event) => {
    const { action } = event;
    if (this.state.showEditDialog || this.state.showDataDialog) return;
    if (action === 'delete-selection') {
      const data = { ...this.state.data };
      data.area = data.area.filter( d => !d.selected);
      this.setState({
        data,
      }, this.saveArea)
    }
    if (action === 'update-area') {
      this.saveArea()
    }
    if (action === 'create-area') {
      const data = { ...this.state.data };
      data.area.push(event.data);
      this.setState({
        data,
      }, this.saveArea)
    }
    if (action === 'edit-area') {
      this.setState({
        value: event.data,
        index: event.index,
        showEditDialog: true,
      })
    }
    if (action === 'show-data') {
      this.setState({
        showDataDialog: true,
      })
    }
  }

  renderPage() {
    const startScreen = this.props.startScreen;
    const { host, photo, } = this.props;
    const { area } = this.state.data;
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
                      (area) ? <Area
                        ref={ d => this.areaView = d }
                        data={area}
                        editable={this.props.editScreen}
                        onClick={this.props.onClickArea}
                        onAction={ this.onAction }
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
      {
        (this.state.showEditDialog) ? <AreaDialog
          show={this.state.showEditDialog}
          index={this.state.index}
          value={this.state.value}
          onClose={(d) => {
            const data = { ...this.state.data };
            data.area[this.state.index] = d;
            this.setState({
              data,
              showEditDialog: false,
            }, this.saveArea)
          }}
        /> : null
      }
      {
        (this.state.showDataDialog) ? <DataDialog
          show={this.state.showDataDialog}
          value={this.saveText()}
          height={this.props.height-300}
          onClose={(text) => {
            this.loadText(text);
            this.setState({
              showDataDialog: false,
            })
          }}
        /> : null
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
  editScreen: false,
  area: null,

  prevButtonStatus: null,
  nextButtonStatus: null,
  openPageHandller: null,
  startButtonHandller: null,
  onClickArea: null,
  saveImageMap: null,
}

export default Slide;

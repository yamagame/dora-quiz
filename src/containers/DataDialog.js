import React, { Component } from "react";
// import ReactDOM from "react-dom";
import { Row, Col, Button, Modal } from "react-bootstrap";
import AceEditor from "react-ace";
// import 'brace/mode/javascript';
// import 'brace/theme/chrome';

export default class DataDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  componentDidUpdate(nextProps) {}

  onClose = () => {
    if (this.props.onClose) {
      this.props.onClose(this.state.value);
    }
  };

  onChangeText = value => {
    this.setState({
      value,
    });
  };

  onEntered = () => {
    this.setState({
      value: this.props.value,
    });
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        size="lg"
        onHide={this.onClose}
        onEntered={this.onEntered}
      >
        <Modal.Header closeButton>
          <Modal.Title>データの出力</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              {
                <AceEditor
                  ref={r => (this.editor = r)}
                  style={{
                    display: "inline-block",
                    border: "solid 1px lightgray",
                  }}
                  mode="javascript"
                  theme="chrome"
                  value={this.state.value}
                  width="100%"
                  height={`${this.props.height}px`}
                  onChange={this.onChangeText}
                  showPrintMargin={false}
                  fontSize={12}
                  name="senario_editor"
                  editorProps={{ $blockScrolling: Infinity }}
                />
              }
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onClose}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DataDialog.defaultProps = {
  show: false,
  height: 400,
};

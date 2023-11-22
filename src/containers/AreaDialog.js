import React, { Component } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";

export default class AreaDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        title: "",
      },
    };
  }

  componentWillMount() { }

  componentDidMount() { }

  componentDidUpdate() { }

  componentWillUnmount() { }

  componentDidUpdate(nextProps) { }

  onClose = () => {
    if (this.props.onClose) {
      this.props.onClose(this.state.value);
    }
  };

  onChangeTitle = e => {
    const value = { ...this.state.value };
    if (typeof value === "undefined") {
      value.title = "";
    } else {
      value.title = e.target.value;
    }
    this.setState({
      value,
    });
  };

  onEntered = () => {
    const value = { ...this.props.value };
    if (typeof value.title === "undefined") {
      value.title = "";
    }
    this.setState({
      value,
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
          <Modal.Title>キーの編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <input
                type="text"
                style={{ width: "100%", marginBottom: 10 }}
                value={this.state.value.title}
                onChange={this.onChangeTitle}
              />
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

AreaDialog.defaultProps = {
  show: false,
};

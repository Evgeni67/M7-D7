import React from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import "./styles/messanger.css";
import HomeRight from "./HomeRight";
import io from "socket.io-client";
class Messanger extends React.Component {
  socket = "null";
  state = {
    user: "Evgeni",
    message: "",
    messages: [],
    users: [],
  };
  handleMessage = (e) => {
    this.setState({ message: e.currentTarget.value });
    console.log("msgs", this.state.messages);
    console.log("users", this.state.users);
  };
  componentDidMount = () => {
    const connOpt = {
      transports: ["websocket"],
    };

    this.socket = io("https://striveschool-api.herokuapp.com/", connOpt);

    this.socket.on("list", (users) =>
      this.setState({ users: this.state.users.concat(users).slice(0, 18) })
    );
    this.socket.on("bmsg", (msg) =>
      this.setState({ messages: this.state.messages.concat(msg) })
    );
  };
  sendMessage = (e) => {
    e.preventDefault();
    if (this.state.message !== "") {
      this.socket.emit("bmsg", {
        user: this.state.user,
        message: this.state.message,
      });
      this.setState({
        message: "",
      });
    }
  };
  render() {
    return (
      <>
        <Row>
          <Col sm={3}> </Col>{" "}
          <Col sm={6}>
            <Container className="chatContainer">
              <Row className="d-flex justify-content-end">
                <Col sm={4} className="chatCol">
                  {" "}
                  {this.state.users.map((user) => (
                    <Row>{user}</Row>
                  ))}
                </Col>
                <Col sm={4} className="chatCol">
                  {" "}
                  {this.state.messages.map((message) => (
                    <Row>
                      {message.user} : {message.message}
                    </Row>
                  ))}
                 
                    <form id="chat" onSubmit={(e) => this.sendMessage(e)}>
                    <input
                      autoComplete="off"
                      value={this.state.message}
                      onChange={(e) => this.handleMessage(e)}
                    />
                    <button>Send</button>
                  </form>
                </Col>
                <Col sm={4}>
                  {" "}
                
                </Col>{" "}
              </Row>
            </Container>{" "}
          </Col>{" "}
          <Col sm={3} className="mt-4">
            {" "}
            <HomeRight />
          </Col>{" "}
        </Row>
      </>
    );
  }
}
export default Messanger;

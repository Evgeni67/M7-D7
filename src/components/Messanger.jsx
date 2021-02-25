import React from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import "./styles/messanger.css";
import HomeRight from "./HomeRight";
import io from "socket.io-client";
class Messanger extends React.Component {
  socket = "null";
  state = {
    user: "600ee173181ae757988fcc69",
    message: "",
    messages: [],
    users: [],
    selectedUser: "",
  };
  handleMessage = async (e) => {
    this.setState({ message: e.currentTarget.value });
    console.log("msgs", this.state.messages);

    const connOpt = {
      transports: ["websocket"],
    };
    this.socket = io("https://striveschool-api.herokuapp.com/", connOpt);
    await this.socket.on("connect", () => console.log("connected to socket"));
    await this.socket.on("list", (list) => this.setState({ users: list }));
    console.log("users", this.state.users);
  };

  componentDidMount = async () => {
    const connOpt = {
      transports: ["websocket"],
    };
    try {
      this.socket = io("https://striveschool-api.herokuapp.com/", connOpt);

      await this.socket.on("connect", () => console.log("connected to socket"));
      await this.socket.emit("setUsername", { username: "Evgeni" });
      await this.socket.on("list", (list) => this.setState({ users: list }));
      await this.socket.on("chatmessage", (msg) =>
        this.setState({ messages: this.state.messages.concat(msg) })
      );

      console.log("Logged");
    } catch (e) {
      console.log("Error logging in the chat", e);
    }
  };
  // 3) event name: "chatmessage"
  // payload ({
  //     to: "receiver username",
  //     text: "the message to be sent"
  // }) SENDS A PRIVATE MESSAGE TO A SPECIFIC USER
  sendMessage = (e) => {
    e.preventDefault();
    if (this.state.message !== "") {
      this.socket.emit("chatmessage", {
        to: this.state.selectedUser, //abdul1
        text: this.state.message,
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
                <Col sm={4} className="chatCol ">
                  {" "}
                  {this.state.users.map((user) => (
                    <Row className = "d-flex justify-content-center" onClick={() => this.setState({ selectedUser: user })}>
                      {user}   🟢
                    </Row>
                  ))}
                </Col>
                <Col sm={4} className="chatCol">
                  {" "}
                  {this.state.messages.map((message) => (
                    <Row>
                     <p>private from - {message.to} : {message.msg} </p>
                    </Row>
                  ))}
                  <form id="chat" onSubmit={(e) => this.sendMessage(e)}>
                    <input
                    className = "inputForm"
                      autoComplete="off"
                      value={this.state.message}
                      onChange={(e) => this.handleMessage(e)}
                    />
                    <button className = "sendBtn">Send</button>
                  </form>
                </Col>
                <Col sm={4}> </Col>{" "}
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

import React from "react";
import "../styles.css";
export default class ImageComponent extends React.Component {
  state = { isOpen: false,
            clicks: 0};

  handleShowDialog = () => {
    console.log("???")
    this.setState({ isOpen: true });
      
  };
  handleBlueDialog = () => {
    this.setState({clicks: 0})
    this.setState({ isOpen: false });
  }
  handleClick = () => {
    this.setState(prevState => {return {clicks : prevState.clicks + 1}})
    if (this.state.clicks == 1) {
      console.log("click")
    }
  }
  render() {
    let wid
    this.state.isOpen ? wid = 300 : wid = 40
    return (
      <div>
        <img
          className="wat"
          src="/Anj.png"
          width={wid}
          onFocus={this.handleShowDialog}
          onBlur={this.handleBlueDialog}
          onClick={this.handleClick}
          tabIndex="0"
          />
        {/* {this.state.isOpen && (
          <dialog
            className="dialog"
            style={{ position: "absolute" }}
            open
            onClick={this.handleShowDialog}
          >
            <img
              className="image"
              src="/Anj.png"
              onClick={this.handleShowDialog}
              alt="no image"
            />
          </dialog> */}
      </div>
    );
  }
}
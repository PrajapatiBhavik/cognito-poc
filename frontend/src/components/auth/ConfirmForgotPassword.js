import React, { Component } from "react";
import axios from "axios";

class ConfirmForotPassword extends Component {
  state = {
    email: "",
    new_password: "",
    code: "",
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: this.state.email,
      new_password: this.state.new_password,
      code: this.state.code,
      acc_token: this.props.auth.id_token,
    };

    axios
      .post(process.env.REACT_APP_BASE_URL + "/confirmpasswordchange", JSON.stringify(data), {
        headers: {
          "Authorization": `${this.props.auth.access_token}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          this.props.history.push("/success");
        }
      })
      .catch((err) => console.log(err));
  };

  onInputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Confirm forget password</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <input
                className="input"
                type="email"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter Email"
                value={this.state.email}
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className="field">
              <input
                className="input"
                type="password"
                id="new_password"
                aria-describedby="passwordHelp"
                placeholder="Enter new password"
                value={this.state.new_password}
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className="field">
              <input
                className="input"
                type="textbox"
                id="code"
                aria-describedby="codeHelp"
                placeholder="Enter code"
                value={this.state.code}
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">Confirm</button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default ConfirmForotPassword;

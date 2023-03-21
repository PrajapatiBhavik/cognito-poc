import React, { Component } from "react";
import axios from "axios";

class ForgotPass extends Component {
  state = {
    email: "",
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: this.state.email,
    };

    axios
      .post(
        process.env.REACT_APP_BASE_URL + "/forgotpassword",
        JSON.stringify(data),
        {
          headers: {
            "Authorization": `${this.props.auth.access_token}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.statusText === "OK") {
          this.props.history.push("/confirmpass");
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
          <h1>Forget password</h1>
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
              <p className="control">
                <button className="button is-success">Forget</button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default ForgotPass;

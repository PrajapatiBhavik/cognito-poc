import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  state = {
    email: "",
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: this.state.email,
      acc_token: this.props.auth.id_token,
    };

    axios
      .post(
        process.env.REACT_APP_BASE_URL + "/admincreateuser",
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
        console.log(res)
        if (res.statusText === "OK") this.props.history.push("/success");
      })
      .catch((err) => {
        alert(err);
      });
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
          <h1>Register Admins</h1>
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
                <button className="button is-success">Register</button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Register;

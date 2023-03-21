import React, { Component } from "react";
import axios from "axios";

class ChangePasswordBackend extends Component {
  state = {
    oldpassword: "",
    newpassword: ""
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: this.props.auth.user.attributes.email,
      pre_password: this.state.oldpassword,
      new_password: this.state.newpassword,
      acc_token: this.props.auth.access_token,
    };

    axios
      .post(
        process.env.REACT_APP_BASE_URL + "/changePassword",
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
          console.log(res.data)
          this.props.history.push("/changepasswordconfirmation");
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
          <h1>Change Password</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control has-icons-left">
                <input 
                  className="input" 
                  type="password"
                  id="oldpassword"
                  placeholder="Old password"
                  value={this.state.oldpassword}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="newpassword"
                  placeholder="New password"
                  value={this.state.newpassword}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>

            <div className="field">
              <p className="control">
                <button className="button is-success">Change Password</button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default ChangePasswordBackend;

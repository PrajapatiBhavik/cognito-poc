import React, { Component } from "react";
import { Auth } from "aws-amplify";

class CompleteNewPassword extends Component {
  state = {
    password: "",
  };

  handleLogOut = async (event) => {
    Auth.signOut();
    this.props.auth.setAuthStatus(false);
    this.props.auth.setUser(null);
  };
  handleSubmit = async (event) => {
    event.preventDefault();

    let user = this.props.auth.user;
    if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
      let newPassword = this.state.password;
      Auth.completeNewPassword(
        user, // the Cognito User Object
        newPassword // the new password
      )
        .then((user) => {
          // at this time the user is logged in if no MFA required
          if (user.challengeName === undefined) {
            this.handleLogOut();
            this.props.history.push("/success");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
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
          <h1>Enter new password</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <input
                className="input"
                type="password"
                id="password"
                aria-describedby="passwordHelp"
                placeholder="Enter new password"
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">Set</button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default CompleteNewPassword;

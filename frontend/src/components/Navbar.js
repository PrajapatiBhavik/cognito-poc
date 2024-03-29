import React, { Component } from "react";
import { Auth } from "aws-amplify";

export default class Navbar extends Component {
  handleLogOut = async (event) => {
    event.preventDefault();
    try {
      Auth.signOut();
      this.props.auth.setAuthStatus(false);
      this.props.auth.setUser(null);
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        {/* <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <img
              src="hexal-logo.png"
              width="112"
              height="28"
              alt="hexal logo"
            />
          </a>
        </div> */}

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a href="/" className="navbar-item">
              Home
            </a>
            {this.props.auth.isAuthenticated && this.props.auth.user && (
              <a href="/changepass" className="navbar-item">
                Change Password
              </a>
            )}
            <a href="/forgot" className="navbar-item">
              Forget Password
            </a>
            {this.props.auth.isAuthenticated && this.props.auth.user && (
              <a href="/disableuser" className="navbar-item">
                Disable User
              </a>
            )}
            {this.props.auth.isAuthenticated && this.props.auth.user && (
              <a href="/deleteuser" className="navbar-item">
                Delete User
              </a>
            )}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              {this.props.auth.isAuthenticated && this.props.auth.user && (
                <p>Hello {this.props.auth.user.username}</p>
              )}
              <div className="buttons">
              {this.props.auth.isAuthenticated && this.props.auth.user && (
                  <div>
                    <a href="/register" className="button is-primary">
                      <strong>Register</strong>
                    </a>
                  </div>
                )}
                {!this.props.auth.isAuthenticated && (
                  <div>
                    <a href="/login" className="button is-light">
                      Log in
                    </a>
                  </div>
                )}
                {this.props.auth.isAuthenticated && (
                  <a
                    href="/"
                    onClick={this.handleLogOut}
                    className="button is-light"
                  >
                    Log out
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

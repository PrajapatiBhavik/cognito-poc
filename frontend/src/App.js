import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductAdmin from "./components/ProductAdmin";
import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ForgotPasswordVerification from "./components/auth/ForgotPasswordVerification";
// import ChangePassword from "./components/auth/ChangePassword";
import CompleteNewPassword from "./components/auth/completeNewPassword";
import ChangePasswordConfirm from "./components/auth/ChangePasswordConfirm";
import Welcome from "./components/auth/Welcome";
import Footer from "./components/Footer";
import { Auth } from "aws-amplify";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteUser from "./components/auth/DeleteUser";
import DisableUser from "./components/auth/DisableUser";
import ForgotPass from "./components/auth/ForgotPass";
import ConfirmForgotPassword from "./components/auth/ConfirmForgotPassword";
import Success from "./components/auth/Success";
import ChangePasswordBackend from "./components/auth/ChangePasswordBackend";
library.add(faEdit);

class App extends Component {
  state = {
    access_token: null,
    id_token: null,
    isAuthenticated: false,
    isAuthenticating: true,
    user: null,
  };

  setAuthStatus = (authenticated) => {
    this.setState({ isAuthenticated: authenticated });
  };

  setUser = (user) => {
    this.setState({ user: user });
  };

  async componentDidMount() {
    try {
      const session = await Auth.currentSession();
      console.log("refresh_token " + session.getRefreshToken()['token'])
      const access_token = session.getAccessToken()["jwtToken"];
      const id_token = session.getIdToken()["jwtToken"];
      this.setState({ access_token: access_token, id_token: id_token });
      this.setAuthStatus(true);
      //console.log(session);
      const user = await Auth.currentAuthenticatedUser();
      this.setUser(user);
    } catch (error) {
      if (error !== "No current user") {
        console.log(error);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  render() {
    console.log("id_token : "+this.state.id_token)
    console.log("access_token : "+this.state.access_token)
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser,
      access_token: this.state.access_token,
      id_token: this.state.id_token,
    };
    return (
      !this.state.isAuthenticating && (
        <div className="App">
          <Router>
            <div>
              <Navbar auth={authProps} />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => <Home {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/products"
                  render={(props) => <Products {...props} auth={authProps} />}
                />
                {this.state.isAuthenticated && this.state.user && (
                  <Route
                    exact
                    path="/deleteuser"
                    render={(props) => (
                      <DeleteUser {...props} auth={authProps} />
                    )}
                  />
                )}
                {this.state.isAuthenticated && this.state.user && (
                  <Route
                    exact
                    path="/disableuser"
                    render={(props) => (
                      <DisableUser {...props} auth={authProps} />
                    )}
                  />
                )}
                {this.state.isAuthenticated && this.state.user && (
                  <Route
                    exact
                    path="/changepass"
                    render={(props) => (
                      <ChangePasswordBackend {...props} auth={authProps} />
                    )}
                  />
                )}
                <Route
                  exact
                  path="/forgot"
                  render={(props) => <ForgotPass {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/confirmpass"
                  render={(props) => (
                    <ConfirmForgotPassword {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/success"
                  render={(props) => <Success {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/admin"
                  render={(props) => (
                    <ProductAdmin {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/login"
                  render={(props) => <LogIn {...props} auth={authProps} />}
                />
                {this.state.isAuthenticated && this.state.user && (
                <Route
                  exact
                  path="/register"
                  render={(props) => <Register {...props} auth={authProps} />}
                />
                )}
                <Route
                  exact
                  path="/forgotpassword"
                  render={(props) => (
                    <ForgotPassword {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/forgotpasswordverification"
                  render={(props) => (
                    <ForgotPasswordVerification {...props} auth={authProps} />
                  )}
                />
                {/* {this.state.isAuthenticated && this.state.user && (
                  <Route
                    exact
                    path="/changepassword"
                    render={(props) => (
                      <ChangePassword {...props} auth={authProps} />
                    )}
                  />
                )} */}

                <Route
                  exact
                  path="/completenewpassword"
                  render={(props) => (
                    <CompleteNewPassword {...props} auth={authProps} />
                  )}
                />

                <Route
                  exact
                  path="/changepasswordconfirmation"
                  render={(props) => (
                    <ChangePasswordConfirm {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/welcome"
                  render={(props) => <Welcome {...props} auth={authProps} />}
                />
              </Switch>
              {/* <Footer /> */}
            </div>
          </Router>
        </div>
      )
    );
  }
}

export default App;

import React, { Component } from "react";
import { Form, Header, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
// import Media from 'react-media';
import config from "react-global-configuration";

export default class LoginForm extends Component {
  constructor() {
    super();

    this.username = React.createRef();
    this.password = React.createRef();
    this.state = {
      mobile: false,
    };
  }

  componentDidMount() {
    this.props.resetState();
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  getToken(jwt) {
    return localStorage.getItem("jwt");
  }

  resize() {
    let currentMobile = window.innerWidth <= 768;
    if (currentMobile !== this.state.mobile) {
      this.setState({ mobile: currentMobile });
    }
  }

  getProfile = () => {
    let token = this.getToken();
    fetch(`${config.get("API_URL")}/api/v1/profile`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        this.props.setUser(json.user);
      });
  };

  saveToken = (token) => {
    localStorage.setItem("jwt", token);
  };

  saveUserInfo = (json) => {
    localStorage.setItem("userid", json["user"]["id"]);
    localStorage.setItem("username", json["user"]["username"]);
    localStorage.setItem("email_address", json["user"]["email_address"]);
    localStorage.setItem("first_name", json["user"]["first_name"]);
    localStorage.setItem("last_name", json["user"]["last_name"]);
    localStorage.setItem("default_country", json["user"]["default_country"]);
  };

  login = (ev) => {
    ev.preventDefault();
    const username = this.username.current.value;
    const password = this.password.current.value;

    if (!username) {
      alert("Please Enter your Username!");
      return;
    }

    const URL = `${config.get("API_URL")}/api/v1/login/`;
    const headers = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: { username, password } }),
    };
    fetch(URL, headers)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.jwt) {
          this.saveToken(json.jwt);
          this.saveUserInfo(json);
          this.getProfile();
          this.setState(
            (prevState) => ({
              loggedIn: true,
            }),
            () => {
              this.props.setUser(json.user);
              this.props.updateSelectedCountry(json.user.default_country);
              this.props.getThemes();
              this.props.fetchUserThemes();
            }
          );
          // push to mobile_landing on small screen
          if (this.state.mobile) {
            this.props.history.push("/mobile_landing");
          } else {
            this.props.history.push("/map");
          }
        } else {
          alert("Incorrect Login Information");
        }
      });
  };

  render() {
    return (
      <div className="body">
        <header className="spacer"> </header>
        <div className="login-section">
          <div className="login-div">
            <article className="login">
              <h1 style={{ fontSize: "3.5rem", textAlign: "center" }}>
                Donate through{" "}
                <span style={{ color: "#c64756" }}>Futuriste</span>
                <Icon name="globe" circular />
              </h1>
              <Header as="h4" textAlign="center">
                A project discovery and donation tool - Supporting CCredits
              </Header>
              <p
                style={{
                  textAlign: "center",
                  color: "#387c6d",
                  margin: "-10px",
                }}
              >
                In association with The New Civilisation
              </p>

              {/*<h2>Sign in</h2> */}
              <Form onSubmit={this.login}>
                <Form.Field
                  className="login-field"
                  onChange={this.handleChange}
                >
                  <label style={{ fontSize: "1.5rem", padding: "10px" }}>
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    ref={this.username}
                    required
                  />
                </Form.Field>
                <Form.Field
                  className="login-field"
                  onChange={this.handleChange}
                >
                  <label style={{ fontSize: "1.5rem", padding: "10px" }}>
                    Password
                  </label>
                  <input
                    id="loginpassword"
                    name="password"
                    type="password"
                    ref={this.password}
                    required
                  />
                </Form.Field>
                <Form.Field className="login-buttons">
                  <input
                    type="submit"
                    className="btn login-btn"
                    value="Log In"
                    onClick={this.login}
                    style={{ marginBottom: "30px" }}
                  />
                  <Link to="/create_user" replace>
                    {/* <input
                      type='submit'
                      // className='large ui blue button'
                      value='Create Profile'
                    /> */}
                    <a className="create-profile-link">Create Profile</a>
                  </Link>
                </Form.Field>
              </Form>
            </article>
          </div>
        </div>
        <div id="absolute-footer">
          <Footer />
        </div>
      </div>
    );
  }
}

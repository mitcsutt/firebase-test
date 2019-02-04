import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Firebase from "./firebase";

const Welcome = ({ user, onSignOut }) => {
  // This is a dumb "stateless" component
  return (
    <div>
      Welcome <strong>{user.email}</strong>!
      <a href="javascript:;" onClick={onSignOut}>
        Sign out
      </a>
    </div>
  );
};

class LoginForm extends Component {
  // Using a class based component here because we're accessing DOM refs

  handleSignIn(e) {
    e.preventDefault();
    let email = this.refs.email.value;
    let password = this.refs.password.value;
    this.props.onSignIn(email, password);
  }

  render() {
    return (
      <form onSubmit={this.handleSignIn.bind(this)}>
        <h3>Sign in</h3>
        <input type="email" ref="email" placeholder="enter you email" />
        <input type="password" ref="password" placeholder="enter password" />
        <input type="submit" value="Login" />
      </form>
    );
  }
}

class AddDBItem extends Component {
  // Using a class based component here because we're accessing DOM refs

  handleAddDB(e) {
    e.preventDefault();
    let firstName = this.refs.firstName.value;
    let lastName = this.refs.lastName.value;
    this.props.addDBItem(firstName, lastName);
  }

  render() {
    return (
      <form onSubmit={this.handleAddDB.bind(this)}>
        <h3>Add Name</h3>
        <input
          type="firstName"
          ref="firstName"
          placeholder="enter your first name"
        />
        <input
          type="lastName"
          ref="lastName"
          placeholder="enter your last name"
        />
        <input type="submit" value="Login" />
      </form>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    // the initial application state
    this.state = {
      user: null,
      firebase: Firebase
    };
  }

  // App "actions" (functions that modify state)
  signIn(email, password) {
    this.state.firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          user: {
            email: email,
            password: password
          }
        });
      })
      .catch(function(error) {
        console.log("massive error");
        console.log(error);
      });
  }

  signOut() {
    // clear out user from state
    this.setState({ user: null });
    this.state.firebase
      .auth()
      .signOut()
      .then(
        function() {
          console.log("Signed Out");
        },
        function(error) {
          console.error("Sign Out Error", error);
        }
      );
  }

  addDBItem(firstName, lastName) {
    console.log(this.state.firebase);
    const docRef = this.state.firebase
      .firestore()
      .collection("new-entry")
      .doc();
    docRef
      .set({
        firstName: firstName,
        lastName: lastName,
        id: this.state.firebase.auth().currentUser.uid
      })
      .then(console.log("Yaaasss"))
      .catch(console.log("Ahhhh shit"));
  }

  render() {
    // Here we pass relevant state to our child components
    // as props. Note that functions are passed using `bind` to
    // make sure we keep our scope to App
    return (
      <div>
        <h1>My cool App</h1>
        {this.state.user ? (
          <div>
            <Welcome
              user={this.state.user}
              onSignOut={this.signOut.bind(this)}
            />
            <AddDBItem addDBItem={this.addDBItem.bind(this)} />
          </div>
        ) : (
          <LoginForm onSignIn={this.signIn.bind(this)} />
        )}
      </div>
    );
  }
}

export default App;

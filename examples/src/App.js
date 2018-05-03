import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Basic from './scenes/basic';
import Advanced from './scenes/advanced';
import logo from './logo.svg';
import './App.css';
import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>

        <Router>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
        </p>

            <div>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/advanced">Advanced</Link>
                </li>
              </ul>
              <hr />
              <Route exact path="/advanced" component={Advanced} />
              <Route exact path="/" component={Basic} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

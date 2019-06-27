import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="App">
      <div className="Menu">
        <div className="container">
          <div className="row">
            <header className="App-header mx-auto">
              <img src={logo} className="App-logo" alt="logo" />
              <h1>OFCjs</h1>
            </header>
          </div>
          <main>
            <div className="row">
              <div className="mx-auto">
                <p>Hello, Player. Please choose a display name to connect to the server.</p>
              </div>
            </div>
            <div className="row">
              <form className="mx-auto">
                <div className="form-group">
                  <label className="form-control-label" for="username">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="username"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-lg btn-info row">
                    Connect
                  </button>
                </div>
              </form>
            </div>
            <div className="col-12 mx-auto">
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p>Learn how to play Open-faced Chinese Poker</p>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

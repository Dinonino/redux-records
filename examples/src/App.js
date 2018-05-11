import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Container, Image, List, Menu, Segment } from 'semantic-ui-react';
import Basic from './scenes/basic';
import ListComp from './scenes/basic/list';
import Advanced from './scenes/advanced';
import logo from './logo.svg';
import './App.css';
import store from './store';

const App = () => (
  <Provider store={store}>

    <Router>
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              <Image
                size="mini"
                src={logo}
                style={{ marginRight: '1.5em' }}
              />
              RxRec examples
            </Menu.Item>
            <Menu.Item as="a"><Link to="/edit">New User</Link></Menu.Item>
            <Menu.Item as="a"><Link to="/list">List</Link></Menu.Item>
            <Menu.Item as="a"><Link to="/advanced">Advanced</Link></Menu.Item>
          </Container>
        </Menu>

        <Container text style={{ marginTop: '7em' }}>
          <Route exact path="/list" component={ListComp} />
          <Route exact path="/advanced" component={Advanced} />
          <Route exact path="/edit/:id?" component={Basic} />
        </Container>
      </div>
    </Router>
  </Provider>
);


export default App;

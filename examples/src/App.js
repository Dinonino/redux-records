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
            <Menu.Item as="a"><Link to="/">Home</Link></Menu.Item>
            <Menu.Item as="a"><Link to="/list">List</Link></Menu.Item>
            <Menu.Item as="a"><Link to="/advanced">Advanced</Link></Menu.Item>
          </Container>
        </Menu>

        <Container text style={{ marginTop: '7em' }}>
          <Route exact path="/list" component={ListComp} />
          <Route exact path="/advanced" component={Advanced} />
          <Route exact path="/" component={Basic} />
        </Container>

        <Segment
          inverted
          vertical
          style={{ margin: '5em 0em 0em', padding: '5em 0em' }}
        >
          <Container textAlign="center">
            <Image
              centered
              size="mini"
              src={logo}
            />
            <List horizontal inverted divided link>
              <List.Item as="a" href="#">Site Map</List.Item>
              <List.Item as="a" href="#">Contact Us</List.Item>
              <List.Item as="a" href="#">Terms and Conditions</List.Item>
              <List.Item as="a" href="#">Privacy Policy</List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    </Router>
  </Provider>
);


export default App;

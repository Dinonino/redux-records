import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory as createHistory } from 'history';
import { Router, Route, Link, Switch } from 'react-router-dom';
import { Container, Image, Menu, Grid } from 'semantic-ui-react';
import Basic from './scenes/basic';
import ListComp from './scenes/basic/list';
import Advanced from './scenes/advanced';
import logo from './RR_logo-color.svg';
import './App.css';
import store from './store';

export const history = createHistory();
const App = () => (
  <Provider store={store}>

    <Router history={history}>
     <div>
            <Menu fixed='left' vertical inverted>
              <Container >
              <Menu.Item as="a" header>
              <Image
                size="small"
                src={logo}
                style={{ marginRight: '8em' }}
              />
            </Menu.Item>
                <Menu.Item as="div"><Link to="/edit">New User</Link></Menu.Item>
                <Menu.Item as="div"><Link to="/list">List</Link></Menu.Item>
                <Menu.Item as="div"><Link to="/advanced">Advanced</Link></Menu.Item>
              </Container>
            </Menu>

            <Container text style={{ marginTop: '3em' }}>
              <Switch>
                <Route exact path="/list" component={ListComp} />
                <Route exact path="/advanced" component={Advanced} />
                <Route exact path="/edit/:id?" component={Basic} />
              </Switch>
            </Container>
         </div>
    </Router>
  </Provider >
);


export default App;

import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory as createHistory } from 'history';
import { Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { Container, Image, Menu, Grid, Icon } from 'semantic-ui-react';
import Basic from './scenes/basic';
import ListComp from './scenes/basic/list';
import Advanced from './scenes/advanced';
import Installation from './scenes/docs/installation';
import Configuration from './scenes/docs/configuration';
import Usage from './scenes/docs/usage';
import logo from './RR_logo-white.svg';
import './App.css';
import store from './store';

export const history = createHistory();
const App = () => (
  <Provider store={store}>

    <Router history={history}>
      <div>
        <Menu fixed='left' vertical inverted>

          <Menu.Item as="a" header>
            <Image
              size="small"
              src={logo}
              style={{ marginRight: '8em' }}
            />
          </Menu.Item>
          <Menu.Item>
          <Menu.Header>Getting Started </Menu.Header>
          <Menu.Menu>
              <Menu.Item as="div"><Link to="/redux-records/installation">Installation</Link></Menu.Item>
              <Menu.Item as="div"><Link to="/redux-records/usage">Usage</Link></Menu.Item>
              <Menu.Item as="div"><Link to="/redux-records/configuration">Configuration</Link></Menu.Item>
              <Menu.Item as="div"><a href='https://github.com/ivanvarga/redux-records'>GitHub  <Icon name='github' /></a> </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>Basic</Menu.Header>
            <Menu.Menu>
              <Menu.Item as="div"><Link to="/redux-records/edit">New User</Link></Menu.Item>
              <Menu.Item as="div"><Link to="/redux-records/list">List</Link></Menu.Item>
            </Menu.Menu>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>Advanced</Menu.Header>
            <Menu.Menu>
            </Menu.Menu>
          </Menu.Item>
        </Menu>

        <Container text style={{ marginTop: '3em' }}>
          <Switch>
            <Route exact path="/redux-records/list" component={ListComp} />
            <Route exact path="/redux-records/advanced" component={Advanced} />
            <Route exact path="/redux-records/edit/:id?" component={Basic} />
            <Route exact path="/redux-records/installation" component={Installation} />
            <Route exact path="/redux-records/usage" component={Usage} />
            <Route exact path="/redux-records/configuration" component={Configuration} />
            <Redirect from="/" to="/redux-records/list" />
          </Switch>
        </Container>
      </div>
    </Router>
  </Provider >
);


export default App;

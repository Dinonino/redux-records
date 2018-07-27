import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory as createHistory } from 'history';
import { Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { Container, Image, Menu, Grid, Icon, Responsive, Sidebar, Segment } from 'semantic-ui-react';
import qs from 'qs';
import Basic from './scenes/basic';
import ListComp from './scenes/basic/list';
import Advanced from './scenes/advanced';
import Installation from './scenes/docs/installation';
import Configuration from './scenes/docs/configuration';
import Usage from './scenes/docs/usage';
import logo from './assets/RR_logo-white.svg';
import smallLogo from './assets/mstile-70x70.png';
import './App.css';
import store from './store';

export const history = createHistory();
const Children = () => (<Switch >
  <Route exact path="/redux-records/list" component={ListComp} />
  <Route exact path="/redux-records/advanced" component={Advanced} />
  <Route exact path="/redux-records/edit/:id?" component={Basic} />
  <Route exact path="/redux-records/installation" component={Installation} />
  <Route exact path="/redux-records/usage" component={Usage} />
  <Route exact path="/redux-records/configuration" component={Configuration} />
  <Redirect from="/" to="/redux-records/list" />
</Switch>);

const MenuComp = () => (
  <Menu vertical inverted fluid style={{ minHeight: '100vh' }}>
    <Menu.Item as="a" header>
      <Image
        size="small"
        src={logo}
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
  </Menu>);
class App extends Component {
  constructor() {
    super();
    this.state = { sidebarVisible: true };
  }
  toggleSidebar = () => {
    const { sidebarVisible } = this.state;
    this.setState({ sidebarVisible: !sidebarVisible });
  }

  handlePusher = () => {
    const { sidebarVisible } = this.state;

    if (sidebarVisible) this.setState({ sidebarVisible: false });
  };

  render() {
    const { sidebarVisible } = this.state;
    return (
      <Provider store={store}>
        <Router history={history}>
          <Grid stretched style={{ minHeight: '100%' }}>
            <Grid.Row stretched only="computer">
              <Grid.Column width={4} stretched>
                <MenuComp />
              </Grid.Column>
              <Grid.Column width={12}>
                <Container text style={{ marginTop: '3em' }}>
                  <Children />
                </Container>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched only="mobile tablet">
              <Grid.Column width={16} stretched>
                <Sidebar.Pushable>
                  <Sidebar
                    animation="overlay"
                    visible={sidebarVisible}
                    onClick={this.toggleSidebar}
                  >
                    <MenuComp />
                  </Sidebar>
                  <Sidebar.Pusher
                    dimmed={sidebarVisible}
                    style={{ minHeight: "100vh" }}
                    onClick={this.handlePusher}
                  >
                    <Menu fixed="top" inverted>
                      <Menu.Item>
                        <Image size="mini"
                          src={smallLogo} />
                      </Menu.Item>
                      <Menu.Item onClick={this.toggleSidebar}>
                        <Icon name="sidebar" />
                      </Menu.Item>

                    </Menu>
                    <Container style={{ marginTop: '7em' }}>
                      <Children />
                    </Container>
                  </Sidebar.Pusher>
                </Sidebar.Pushable>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Router>
      </Provider>
    );
  }
}


export default App;

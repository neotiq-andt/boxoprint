import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faFillDrip, faFont} from '@fortawesome/free-solid-svg-icons'

import SigninForm from './login/SigninForm';

import { me } from './actions/session'
import { logout } from './store/network-service'

import Locations from "./pages/Locations"
import AdminView from './pages/AdminView'
import StoreView from './pages/StoreView'
import ProjectsView from './pages/ProjectsView'
import WorkspaceView from './pages/WorkspaceView'
import PageView404 from './pages/404'

import 'semantic-ui-css/semantic.min.css'
import './App.css';

library.add(
  fab,
  faFont,
  faFillDrip
)

class App extends Component {
  // constructor(props) {
  //   super(props)
  //   this.props.me();
  // }

    render_routes = ()=>{

    if (!this.props.user.user.id || this.props.user.user.superToken) {
      //return (<SigninForm />);
    }

    return (
        <div className="main-app">
          {/*<ResponsiveContainer user={this.props.user.user} onLogout={this.props.logout}>*/}
            <Switch>
              {Locations.SignInView.toRoute({ component: SigninForm, invalid: Page404 }, true)}
              {Locations.HomeView.toRoute({ component: ProjectsView, invalid: Page404 }, true)}
              {Locations.StoreView.toRoute({ component: StoreView, invalid: Page404 }, true)}
              {Locations.AdminView.toRoute({ component: AdminView, invalid: Page404 }, true)}
              {Locations.ProjectsView.toRoute({ component: ProjectsView, invalid: Page404 }, true)}
              {Locations.WorkspaceView.toRoute({ component: WorkspaceView, invalid: Page404 }, true)}
              {Locations.ProjectsView404.toRoute({ component: PageView404, invalid: Page404 }, true)}
              {/*<Route exact path="/404" component={PageView404}/>*/}
              {/*<Route exact path="/" component={RedirectView} />*/}
              <Redirect to="/boxo-frontend/404" />
            </Switch>
            {/*</ResponsiveContainer>*/}
            {/*<Segment color="blue" basic style={{ margin:0, padding: 0, width: "100%"}}>*/}
            {/*  <div style={{width: "100%", textAlign: "center", color: "#a2a2a2" }}>© 2019</div>*/}
            {/*</Segment>*/}
      </div>
    )
  }



  render() {
    // loader
    if (!this.props.user.completed)
      return (<Dimmer active><Loader size='medium'>Chargement</Loader></Dimmer>)

    return (
        <Fragment>
        <Router>
              {this.render_routes()}
          </Router>
      </Fragment>
    );
  }
}


function mapStateToProps(state, ownProps) {
  return {
    user: state.session
  };
}

export default connect(mapStateToProps, {
  me, logout
})(App);


const Page404 = () => (
    <div>
        404
    </div>
)
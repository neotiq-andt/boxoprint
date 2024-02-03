import React, { Component } from 'react';
import { Segment, Header, Menu } from 'semantic-ui-react';

import { connect } from 'react-redux';
import actions from "../actions/app";
import {parseQuery} from "../store/helper";


class HomeView extends Component {
  constructor(props) {
    super(props);
    this.props.set_title("Accueil");
    this.state = {filter: ''};
  }

  componentDidMount(){
      this.props.history.push('/boxo-frontend/404');
  }

  render() {
    return (
      <Segment basic style={{ width: "100%" }} color='blue'>
      </Segment>
    )
  }
}



function mapStateToProps(state, ownProps) {
  return {
    templates: state.templates
  };
}

export default connect(mapStateToProps, {
  set_title: actions.title.update,
  get_model: actions.templates.get
})(HomeView);

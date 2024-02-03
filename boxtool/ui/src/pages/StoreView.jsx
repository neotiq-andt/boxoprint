import React, { Component, Fragment } from 'react';
import { Segment,  Grid, Input, Menu } from 'semantic-ui-react';

import { connect } from 'react-redux';
import actions from "../actions/app";

import CardTemplate from "../components/CardTemplate"
import {parseQuery} from "../store/helper";

class StoreView extends Component {
  constructor(props) {
    super(props);
    this.state = {filter: '', key:''};
    this.props.set_title("Modèles disponibles");
    this.props.get_models();
  }

  componentDidMount(){
    const paramInfo = parseQuery(window.location.search)
    if( !paramInfo.secret || ( paramInfo.secret && paramInfo.secret !== process.env.REACT_APP_KEYSECRET )){
        this.props.history.push('/boxo-frontend/404');
    }
  }

  handleFilter = (e, { value }) => {
    this.setState({ filter: value });
  }

  render_models = () => {
    return this.props.templates.templates.filter(item => item.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1).map((item, idx) => {
      return <CardTemplate key={idx} model={item}></CardTemplate>
    });
  }
  render() {
    const { filter } = this.state;
    return (
    <Fragment>
      <Menu text stackable size='small'>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' value={filter} placeholder='Recherche...' onChange={this.handleFilter} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Segment basic color='blue'>
        <Grid stackable container>
          {this.render_models()}
        </Grid>
      </Segment>

    </Fragment>
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
  get_models: actions.templates.get
})(StoreView);

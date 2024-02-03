import React, { Component,Fragment } from 'react';
import { Segment, Grid, Input, Menu } from 'semantic-ui-react';

import { connect } from 'react-redux';
import actions from "../actions/app";

import { makeCancelable } from '../store/utils'
//import ThreeScene from '../threejs/ThreeScene';
import CardProject from '../components/CardProject'

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: '', loading: true, projects: [] };
    this.props.set_title("Mes projets");
    this.handleUdateList();
  }

  componentDidMount(){
      this.props.history.push('/boxo-frontend/404');
  }

  componentWillUnmount() {
    if (this.get_list) this.get_list.cancel();
    if (this.del_ws) this.del_ws.cancel();
  };


  handleUdateList =()=>{
    this.get_list = makeCancelable(this.props.get_projects());
    this.get_list.promise.then(payload => {
      payload = payload.map(item => {
        item.base = JSON.parse(item.base);
        item.config = {};//JSON.parse(item.config)
        return item;
      })
      this.setState({ projects: payload });
    }).catch(error => {
      if (error.isCanceled) return;
      alert('1' + JSON.stringify(error));
    });
  }

  handleFilter = (e, { value }) => {
    this.setState({ filter: value });
  }


  handle_remove = wid => {
    var projects = this.state.projects.filter(item => item.workspace_id !== wid);
    this.setState({projects});
  }
  render_projects = () => {
    return this.state.projects.map(item=>{
      if (item.label.indexOf(this.state.filter) < 0) return null;
      return <CardProject key={item.workspace_id} project={item} onDelete={this.handle_remove}></CardProject>
    })
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
          </Grid>
          <Grid stackable container>
            {this.render_projects()}
          </Grid>
        </Segment>

      </Fragment>

    )
  }
}



export default connect(null, {
  get_projects: actions.projects.get,
  delete_workspace: actions.workspace.delete,
  set_title: actions.title.update,
})(HomeView);

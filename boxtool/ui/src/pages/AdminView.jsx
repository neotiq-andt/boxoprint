import React, { Component, Fragment } from 'react';
import { Segment, Button, Menu, Input, Icon, List } from 'semantic-ui-react';

import { connect } from 'react-redux';
import actions from "../actions/app";
import { makeCancelable } from '../store/utils';
import ReactTooltip from 'react-tooltip';

import ModalCreateUser from '../components/ModalCreateUser';
import ModalConfirm from '../components/ModalConfirm';

class AdminView extends Component {
  state = {users: [],filter:'', current:{role:'user',password:'########', modalDelete:null}};

  constructor(props) {
    super(props);
    this.props.set_title("Gestion des comptes d'accès");
  }

  componentDidMount() {
    this.props.history.push('/boxo-frontend/404');
    this.refreshUserList();
  };

  componentWillUnmount() {
    if (this.get_user) this.get_user.cancel();
    if (this.update_user) this.update_user.cancel();
    if (this.create_user) this.create_user.cancel();
    if (this.delete_user) this.delete_user.cancel();
  };

  refreshUserList() {
    if (this.get_user) this.get_user.cancel();
    this.get_user = makeCancelable(this.props.get_user("*"));
    this.get_user.promise.then(payload => {
      this.setState({users:payload});
    }).catch(error => {
      if (error.isCanceled)
        return;
      this.props.history.push('/boxo-frontend/home');
    });
  };

  handleFilter = (e, { value }) => {
    this.setState({ filter: value });
  };

  modalResult = (result) => {
    if (result != null) {
      if (result.create === true) {
          // creation
          if (this.create_user) this.create_user.cancel();
          this.create_user = makeCancelable(this.props.create_user(result.login, result.role, result.email, result.company, result.password, result.disable));
          this.create_user.promise.then(payload => {
            this.setState({modal:false,current:{role:'user',password:'########'}});
            this.refreshUserList();
          }).catch(error => {
            if (error.isCanceled)
              return;
            this.props.history.push('/boxo-frontend/home');
          });
      } else {
          // mise à jour
          if (this.update_user) this.update_user.cancel();
          this.update_user = makeCancelable(this.props.update_user(result.login, result.role, result.email, result.company, result.password !== '########' ? result.password : null, result.disable));
          this.update_user.promise.then(payload => {
            this.setState({modal:false,current:{role:'user',password:'########'}});
            this.refreshUserList();
          }).catch(error => {
            if (error.isCanceled)
              return;
            this.props.history.push('/boxo-frontend/home');
          });
      }
    } else
      this.setState({modal:false,current:{role:'user'}});
  };

  setCurrent = (c) => {
    c.password = '########';
    this.setState({modal:true,current:c});
  };

  deleteUser = (c) => {
    if (this.delete_user) this.delete_user.cancel();
    this.delete_user = makeCancelable(this.props.delete_user(c.login));
    this.delete_user.promise.then(payload => {
      this.setState({modal:false,current:{role:'user',password:'########'}});
      this.refreshUserList();
    }).catch(error => {
      if (error.isCanceled)
        return;
      this.props.history.push('/boxo-frontend/home');
    });
  };

  handleCloseConfirme = (e, confirm) => {
    if (confirm === true)
        this.deleteUser(this.state.modalDelete);
    this.setState({modalDelete:null});
  };

  render() {
    const { filter } = this.state;
    return (
      <Fragment>
      {this.state.modalDelete != null && <ModalConfirm label={this.state.modalDelete.login} handleCloseConfirme={this.handleCloseConfirme}/>}
      {this.state.modal === true ? <ModalCreateUser value={this.state.current} onResult={this.modalResult}/> : null}
      <Menu text stackable size='small'>
        <Button onClick={()=>this.setState({modal:true,current:{role:'user',password:'########'}})} icon="add" data-tip="Créer un compte"></Button>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' value={filter} placeholder='Recherche...' onChange={this.handleFilter} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Segment basic color='blue'>
        <List divided verticalAlign='middle'>
          {this.state.users.map((val) => {
            if (filter && val.login.match(filter) == null)
              return (null);
            return (
              <List.Item key={val.user_id}>
                <List.Content floated='right'>
                <Button.Group basic size='mini' floated='right' width={1}>
                  <Button icon='edit' onClick={()=>this.setCurrent(val)}/>
                  {val.login !== 'admin' && <Button icon='remove' onClick={()=>this.setState({modalDelete:val})}/>}
                </Button.Group>
                </List.Content>
                {val.role === 'admin' ? <Icon color={val.disable === false ? "green" : "grey"} size="big" name="user circle"/> : <Icon color={val.disable === false ? "blue" : "grey"} size="big" name="user circle"/>}
                <List.Content>{val.login}</List.Content>
              </List.Item>
            );
          })}
        </List>
      </Segment>
      <ReactTooltip place="right" type="info" effect="solid" />
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
  get_model: actions.templates.get,
  get_user: actions.user.get,
  create_user: actions.user.create,
  update_user: actions.user.update,
  delete_user: actions.user.delete
})(AdminView);

import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Grid, Button, Card, Icon} from 'semantic-ui-react';

import { connect } from 'react-redux';
import actions from "../actions/app";

import { makeCancelable } from '../store/utils'

import ThreeScene from '../threejs/ThreeScene';

import ModalConfirm from './ModalConfirm';

class CardProject extends Component {
    constructor(props){
        super(props);
        this.state = { modalConfirm: false}
    }

    componentWillUnmount() {
        if (this.del_ws) this.del_ws.cancel();
    };

    handleOpenWorkspace = event => {
        event.stopPropagation();
        this.props.history.push('/boxo-frontend/workspace/' + this.props.project.workspace_id);
    }


    handleCloseConfirme = (e, confirm) => {
        if (confirm === true)
            this.handleRemoveWorkspace(e);
        this.setState({modalConfirm:false});
    };

    displayConfirmation = () => {
        if (this.state.modalConfirm)
            return (
                <ModalConfirm handleCloseConfirme={this.handleCloseConfirme} label={this.props.project.label}></ModalConfirm>
            /*
            <Modal open={true} onClose={(e)=> this.handleCloseConfirme(e, false)}
                size='mini'>
                <Header as='h4' icon={'trash alternate'} content={'Confirmation de suppression'} />
                <Modal.Content>
                    Etes-vous sûr de vouloir supprimer '<b>{this.props.project.label}</b>' ?
                 </Modal.Content>
                <Modal.Actions>
                    <center>
                    <Button compact content="Annuler" onClick={(e)=> this.handleCloseConfirme(e, false)}></Button>
                    <Button compact content="Effacer" color='blue' onClick={(e)=> this.handleCloseConfirme(e, true)}></Button>
                    </center>
                </Modal.Actions>
            </Modal>
            */
            );
    };
    handleRemoveWorkspace = event => {
        event.stopPropagation();
        this.del_ws = makeCancelable(this.props.delete_workspace(this.props.project.workspace_id));
        this.del_ws.promise.then(payload => {
            this.props.onDelete(this.props.project.workspace_id)
        }).catch(error => {
            if (error.isCanceled) return;
        });
    }

    render() {
        return (
            <Fragment>
            {this.displayConfirmation()}
            <Grid.Column mobile={16} tablet={8} computer={4}>
                <Card >

                    {/* <div className="content ui image large" dangerouslySetInnerHTML={{ __html: image }}></div> */}
                      <ThreeScene w="100%" h="200px" svg={this.props.project.base.svg}
                      user_config={{
                        version:1,
                        thickness:4,
                        thickness_resource_id:0,
                        colors:{},
                        front:[],
                        back:[]
                    }}></ThreeScene>
                    <Card.Content>
                        <Card.Header>{this.props.project.label}</Card.Header>
                        {this.props.project.base.properties && <Card.Description>{this.props.project.base.properties.l} x {this.props.project.base.properties.w} x {this.props.project.base.properties.h}</Card.Description> }
                    </Card.Content>
                    <Card.Content extra>
                        <Button basic fluid onClick={this.handleOpenWorkspace} color="green" size="tiny"><Icon name='edit' /> Editer</Button>
                        <Button basic fluid onClick={()=> this.setState({modalConfirm:true}) } color="red" size="tiny"><Icon name='trash' /> Supprimer</Button>
                    </Card.Content>
                </Card>
            </Grid.Column>
            </Fragment>
        )
    }
}


export default connect(null, {
      get_projects: actions.projects.get,
      delete_workspace: actions.workspace.delete
})(withRouter(CardProject));

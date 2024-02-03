import React, { Component } from 'react';
import { Modal, Icon, Button, Menu } from 'semantic-ui-react';
import Draggable from 'react-draggable';

class ModalConfirm extends Component {
    state = {
        label : '\u00a0\u00a0Confirmation de suppression'
    };
    
    render() {
        return (
            <Draggable  handle=".inverted.menu">
                <Modal style={{ userSelect: 'none' }} size="small" centered={false} open={true} onClose={(e)=> this.props.handleCloseConfirme(e, false)}>
                    <Menu borderless color="blue" inverted size='huge' style={{borderRadius: 0, cursor:"all-scroll", color:"#fff"}}>
                        <Menu.Item>
                            <h3><Icon name="trash alternate" />{this.state.label}</h3>
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Icon style={{cursor:"pointer"}} onClick={(e) => this.props.handleCloseConfirme(e, false)} name='close' />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                    <Modal.Content>
                        Etes-vous sûr de vouloir supprimer '<b>{this.props.label}</b>' ?
                    </Modal.Content>
                    <Modal.Actions>
                        <center>
                            <Button compact content="Annuler" onClick={(e)=> this.props.handleCloseConfirme(e, false)}></Button>
                            <Button compact content="Effacer" color='blue' onClick={(e)=> this.props.handleCloseConfirme(e, true)}></Button>
                        </center>
                    </Modal.Actions>
                </Modal>
            </Draggable>
        );
    }
}

export default ModalConfirm;

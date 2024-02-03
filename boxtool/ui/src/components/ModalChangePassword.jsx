import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Menu } from 'semantic-ui-react';
import Draggable from 'react-draggable';

class ModalChangePassword extends Component {
    state = {
        label : '\u00a0\u00a0Changement du mot de passe',
        open: true,
        password1: null,
        password2: null,
    };

    checkButtonState() {
        if (this.state.password1 && this.state.password2 && this.state.password1.length >= 8 && this.state.password1 === this.state.password2)
            return false;
        return true;
    };

    handleChangePassword1 = (e, value) => {this.setState({password1: value.value});};

    handleChangePassword2 = (e, value) => {this.setState({password2: value.value});};

    render() {
        return (
            <Draggable  handle=".inverted.menu">
                <Modal closeOnDimmerClick={false} style={{ userSelect: 'none' }} size="small" centered={false} open={true} onClose={() => this.props.onResult(null)}>
                    <Menu borderless color="blue" inverted size='huge' style={{borderRadius: 0, cursor:"all-scroll", color:"#fff"}}>
                        <Menu.Item>
                            <h3><Icon name="user" />{this.state.label}</h3>
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Icon style={{cursor:"pointer"}} onClick={() => this.props.onResult(null)} name='close' />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                    <Modal.Content>
                        <Form style={{marginTop: 15}}>
                            <Form.Field>
                                <label>Nouveau mot de passe</label>
                                <Input type='password' placeholder='Mot de passe minimum de 8 caractères' onChange={this.handleChangePassword1}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Confirmation</label>
                                <Input type='password' placeholder='Mot de passe minimum de 8 caractères' onChange={this.handleChangePassword2}/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <center>
                            <Button compact onClick={() => this.props.onResult(null)}>Annuler</Button>
                            <Button compact disabled={this.checkButtonState()} onClick={()=>this.props.onResult(this.state.password1)} color='blue'>Enregistrer</Button>
                        </center>
                    </Modal.Actions>
                </Modal>
            </Draggable>
        );
    }
}

export default ModalChangePassword;

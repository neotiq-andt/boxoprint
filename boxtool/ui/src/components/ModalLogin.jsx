import React, { Component } from 'react';
import { Modal, Icon, Button, Menu, Input, Label , Form, FormField} from 'semantic-ui-react';
import Draggable from 'react-draggable';

class ModalLogin extends Component {
    constructor(props) {
        super(props);
        this.state = { userName : '', password: "",};
    }

    handleChangeUser = (e, value) => {
       this.setState({userName: value.value});
    };

    handleChangePassword = (e, value) => {
        this.setState({password: value.value});
    };

    checkButtonState() {
        if (this.state.userName && this.state.password && this.state.password.length >= 8)
            return false;
        return true;
    };
 
    render() {
        const {loginResult} = this.props, {userName, password} = this.state;
        return (
            <Draggable  handle=".inverted.menu">
                <Modal style={{ userSelect: 'none' }} size="mini" centered={false} open={true} onClose={(e)=> this.props.handleModalLogin(e, false)}>
                    <Menu borderless color="blue" inverted size='huge' style={{borderRadius: 0, cursor:"all-scroll", color:"#fff"}}>
                        <Menu.Item>
                            <h3><Icon name="sign in" />Connectez-vous</h3>
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Icon style={{cursor:"pointer"}} onClick={(e) => this.props.handleModalLogin(e, false)} name='close' />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                    <Modal.Content>
                        <Form>
                            <FormField>
                                {loginResult.error === true && <Label basic color='red' key={'red'}>{loginResult.message}</Label>}
                            </FormField>
                            <FormField>
                                <label>Adresse e-mail</label>
                                <Input icon='users' placeholder='Users' value={userName} onChange={this.handleChangeUser}/>
                            </FormField>
                            <FormField>
                                <label>Mot de passe</label>
                                <Input icon='key'  type='password' placeholder='Passe' value={password} onChange={this.handleChangePassword}/>
                            </FormField>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button compact icon='signup' content="Créer mon compte" color='twitter' onClick={(e)=> this.props.handleCloseCreateUser(e, true)} />
                        <Button compact disabled={this.checkButtonState()} content="Connexion" color='blue' onClick={(e) => this.props.handleModalLogin(e, true, this.state)} />
                    </Modal.Actions>
                </Modal>
            </Draggable>
        );
    }
}

export default ModalLogin;
import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Menu, Label, FormField } from 'semantic-ui-react';
import Draggable from 'react-draggable';

class ModalCreateUserBox extends Component {
    state = {
        label: "Création d'un compte utilisateur",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
    };

    componentDidMount() {
        if (this.props.value) 
            this.setState({ label: this.state.label, firstName:this.props.value.firstName, lastName:this.props.value.lastName, email:this.props.value.email, password:this.props.value.password,passwordConfirm:this.props.value.password,});
    };

    checkButtonState() {
        if (this.state.firstName && this.state.lastName && this.state.email && this.state.password && this.state.passwordConfirm && this.state.password.length >= 8 && this.state.password === this.state.passwordConfirm)
            return false;
        return true;
    };

    handleChangeFirstName = (e, value) => { this.setState({firstName: value.value}); };

    handleChangeLastName = (e, value) => { this.setState({lastName: value.value}); };

    handleChangePassword = (e, value) => { this.setState({password: value.value}); };

    handleChangePasswordConfirm = (e, value) => { this.setState({passwordConfirm: value.value}); };

    handleChangeEmail = (e, value) => { this.setState({email: value.value}); };

    render() {
        const {createUserResult} = this.props;
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
                        <Form>
                            <FormField>
                                {createUserResult.error === true && <Label basic color='red' key={'red'}>{createUserResult.message}</Label>}
                            </FormField>
                            <FormField>
                                <label>Prénom</label>
                                <Input autoFocus placeholder='Prénom' value={this.state.firstName || ""} onChange={this.handleChangeFirstName}/>
                            </FormField>
                            <FormField>
                                <label>Nom de famille</label>
                                <Input placeholder='Société' value={this.state.lastName || ""} onChange={this.handleChangeLastName}/>
                            </FormField>
                            <FormField>
                                <label>Email de recouvrement</label>
                                <Input placeholder='Email' value={this.state.email || ""} onChange={this.handleChangeEmail}/>
                            </FormField>
                            <FormField>
                                <label>Nouveau mot de passe</label>
                                <Input type='password' placeholder='Mot de passe minimum de 8 caractères' value={this.state.password || ""} onChange={this.handleChangePassword}/>
                            </FormField>
                            <FormField>
                                <label>Confirmation</label>
                                <Input type='password' placeholder='Mot de passe minimum de 8 caractères' value={this.state.passwordConfirm || ""} onChange={this.handleChangePasswordConfirm}/>
                            </FormField>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <center>
                            <Button compact onClick={() => this.props.onResult(null)}>Annuler</Button>
                            <Button compact disabled={this.checkButtonState()} onClick={() => this.props.onResult(this.state)} primary >Enregistrer</Button>
                        </center>
                    </Modal.Actions>
                </Modal>
            </Draggable>
        );
    }
}

export default ModalCreateUserBox;

import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Menu } from 'semantic-ui-react';
import Draggable from 'react-draggable';

class ModalCreateUser extends Component {
    state = {
        open: true,
        disable: false,
        login: "",
        company: "",
        email: "",
        role: "",
        create: true,
        label: "\u00a0\u00a0Création d'un compte utilisateur",
        password: "",
        password2: ""
    };

    componentDidMount() {
        if (this.props.value) {
            if (this.props.value.login)
                this.setState({create:false,role:this.props.value.role,login:this.props.value.login,email:this.props.value.email,label:'\u00a0\u00a0Gestion d\'un compte utilisateur',password:this.props.value.password,password2:this.props.value.password,disable:this.props.value.disable,id:this.props.value.id,company:this.props.value.company});
            else
                this.setState({role:this.props.value.role,login:this.props.value.login,email:this.props.value.email});
        }
    };

    checkButtonState() {
        if (this.state.company && this.state.login && this.state.email && this.state.role && this.state.password && this.state.password2 && this.state.password.length >= 8 && this.state.password === this.state.password2)
            return false;
        return true;
    };

    handleChangePassword = (e, value) => { this.setState({password: value.value});};

    handleChangePassword2 = (e, value) => {this.setState({password2: value.value});};

    handleChangeLogin = (e, value) => {this.setState({login: value.value});};

    handleChangeCompany = (e, value) => {this.setState({company: value.value});};

    handleChangeId = (e, value) => {this.setState({id: value.value});};

    handleChangeEmail = (e, value) => {this.setState({email: value.value});};

    handleDisable = (e, value) => {this.setState({disable: value.checked});};

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
                                <label>Login</label>
                                <Input autoFocus disabled={this.props.value && this.props.value.login ? true : false} placeholder='Login' value={this.state.login} onChange={this.handleChangeLogin}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Société</label>
                                <Input placeholder='Société' value={this.state.company} onChange={this.handleChangeCompany}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Role</label>
                                <Input disabled={this.props.value && this.props.value.role ? true : false} type='text' placeholder='Role' value={this.props.value && this.props.value.role} onChange={()=>{}}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Email de recouvrement</label>
                                <Input placeholder='Email' value={this.state.email} onChange={this.handleChangeEmail}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Nouveau mot de passe</label>
                                <Input type='password' placeholder='Mot de passe minimum de 8 caractères' value={this.state.password} onChange={this.handleChangePassword}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Confirmation</label>
                                <Input type='password' placeholder='Mot de passe minimum de 8 caractères' value={this.state.password2} onChange={this.handleChangePassword2}/>
                            </Form.Field>
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

export default ModalCreateUser;

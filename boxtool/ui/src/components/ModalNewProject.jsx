import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Modal, Button, Form, Input, Icon, Menu, Dimmer, Loader, Segment } from 'semantic-ui-react'
import Draggable from 'react-draggable'
import ThreeScene from '../threejs/ThreeScene'
import { connect } from 'react-redux'
import actions from "../actions/app"
import { makeCancelable } from '../store/utils'
import {parseQuery} from "../store/helper";

class ModalNewProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            label : '\u00a0\u00a0Nouveau projet',
            modalOpen: true,
            image: null,
            is3D: false,
            error: [],
            isOnChange: false,
            name_project: 'Nouveau ' + (this.props.model.name || 'nouveau'),
            name: 'Nouveau ' + (this.props.model.name || 'nouveau'),
            length: this.props.model.render.args[2] || 0,
            width: this.props.model.render.args[3] || 0,
            height: this.props.model.render.args[4] || 0,
        }
    };

    componentDidMount() {
        this.handleUpdateImage();
    }
    componentWillUnmount() {
        if (this.get_svg) this.get_svg.cancel();
        if (this.timer) clearTimeout(this.timer);
    };

    handleFocus = (event) => event.target.select();
    handleClose = (e) => this.props.onClose(e);

    handleSubmit = (e) => {
        e.stopPropagation();
        const paramInfo = parseQuery(window.location.search);
        let {error = [], name, name_project, length, width, height} = this.state;
        if( paramInfo.secret !== process.env.REACT_APP_KEYSECRET ){
            error.push({name:'key', message:'Ces secrets sont incorrects'});
            this.setState({error});
        }

        if(!error.length )
            this.props.onValidate(e, name, name_project, length, width, height);
        
    };

    handleUpdateImage = () => {
        if (this.timer)
            clearTimeout(this.timer);
        this.setState({image:null, is3D:false});
        this.timer = setTimeout((self) => {
            self.get_svg = makeCancelable(self.props.get_model(self.props.model.name, self.state.length, self.state.width, self.state.height));
            self.get_svg.promise.then(payload => {self.setState({image:payload});setTimeout( ()=> {this.setState({is3D:true})}, 200)});
        }, 1000, this);
    };

    checkDisable = ()=>{
        let disabled = false
        if( this.state.name_project.length===0 || this.state.width === 0 || this.state.length === 0 || this.state.height === 0)
            disabled = true
        return disabled
    }

    onChangeInput = (e, {value})=>{
        let {error = [], isOnChange = false} = this.state;
        if( error.length )
            error = error.filter(item=> item.name !== e.target.name );
        
        if(['length','width','height'].includes(e.target.name))
            isOnChange = true;

        this.setState({[e.target.name]: value, error, isOnChange});
    }

    onBlurInput = ()=>{
        let {isOnChange = false} = this.state;
        if( isOnChange ){
            this.setState({isOnChange: false});
            this.handleUpdateImage();
        }
    }

    onKeyPressInput = (event)=>{
        if(event.key === 'Enter'){
            this.setState({isOnChange: false});
            this.handleUpdateImage();
        }
    }

    render() {
        return (
            <Draggable  handle=".inverted.menu">
            <Modal
            closeOnDimmerClick={false}
            style={{ userSelect: 'none' }}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            size='small'
            centered={false}>
                    <Menu borderless color="blue" inverted size='huge' style={{borderRadius: 0, cursor:"all-scroll", color:"#fff"}}>
                        <Menu.Item>
                            <h3><Icon name="edit"/>{this.state.label}</h3>
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Icon style={{cursor:"pointer"}} onClick={this.handleClose} name='close' />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field required>
                        <label>Nom de conception</label>
                        <Input placeholder='Nom de conception' name ='name_project' value={this.state.name_project} onChange={(e, {value}) => this.setState({name_project: value})} />
                        </Form.Field>
                        <Form.Field required>
                        <label>Longueur (mm)</label>
                        <Input placeholder='Longueur' type='number' min="10" name ='length' onBlur={this.onBlurInput} onKeyPress={this.onKeyPressInput} onChange={this.onChangeInput} value={this.state.length} />
                        </Form.Field>
                        <Form.Field required>
                        <label>Largeur (mm)</label>
                        <Input placeholder='Largeur' type='number' min="10" name ='width' onBlur={this.onBlurInput} onKeyPress={this.onKeyPressInput} onChange={this.onChangeInput} value={this.state.width} />
                        </Form.Field>
                        <Form.Field required>
                        <label>Hauteur (mm)</label>
                        <Input placeholder='Hauteur' type='number' min="10" name ='height' onBlur={this.onBlurInput} onKeyPress={this.onKeyPressInput} onChange={this.onChangeInput} value={this.state.height} />
                        </Form.Field>
                        <Form.Field>
                            <center>
                                {
                                    this.state.image ?
                                    <ThreeScene w="100%" h="200px" isControlled={true} is3D={this.state.is3D} config={this.props.model.conf3D} size={{l: Number(this.length), w: Number(this.width), h: Number(this.height)}} svg={this.state.image} user_config={{version:1, thickness:4, thickness_resource_id:0, colors:{}, front:[], back:[]}}/>
                                    :
                                    <Segment style={{height:'200px'}}>
                                        <Dimmer active inverted>
                                            <Loader indeterminate>Mise à jour du modèle</Loader>
                                        </Dimmer>
                                    </Segment>
                                }
                            </center>
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <center>
                        <Button compact onClick={this.handleClose} >Cancel</Button>
                        <Button compact type='submit' color='blue' onClick={this.handleSubmit} disabled={this.checkDisable()}>Créer</Button>
                    </center>
                </Modal.Actions>
            </Modal>
        </Draggable>
        )
    }
}

ModalNewProject.propTypes = {
    onClose: PropTypes.func.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default connect(null, {
    get_model: actions.template.get
})(ModalNewProject);
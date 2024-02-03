import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Button, Form, Input, Icon, Menu, Dimmer, Loader, Segment } from 'semantic-ui-react'
import Draggable from 'react-draggable'
import ThreeScene from '../threejs/ThreeScene'
import actions from "../actions/app"
import { makeCancelable } from '../store/utils'

class ModalUpdateProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            label : '\u00a0\u00a0Mettre à jour la dimension',
            modalOpen: true,
            image: null,
            is3D: false,
            // length: this.props.model.render.args[2] || 0,
            // width: this.props.model.render.args[3] || 0,
            // height: this.props.model.render.args[4] || 0
            name: props.model.label || "",
            length: this.props.baseProperties.l || 0,
            width: this.props.baseProperties.w || 0,
            height: this.props.baseProperties.h || 0,
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
        this.props.onValidate(e, this.state.image, Number(this.state.length), Number(this.state.width), Number(this.state.height));
    };

    handleUpdateImage = () => {
        if (this.timer)
            clearTimeout(this.timer);
        this.setState({image:null, is3D:false});
        this.timer = setTimeout((self) => {
            //self.get_svg = makeCancelable(self.props.get_model(self.props.model.label, self.state.length, self.state.width, self.state.height));
            self.get_svg = makeCancelable(self.props.get_model(this.props.model.label.replace('Nouveau ', ''), self.state.length, self.state.width, self.state.height));
            self.get_svg.promise.then(payload => {
               self.setState({image: payload});
               setTimeout( ()=> {this.setState({is3D:true})}, 200)
            });
             // self.setState({image:this.props.model.base.svg});
             // setTimeout( ()=> {this.setState({is3D:true})}, 200)
        }, 1000, this);
    }

    render() {
        const {label, is3D=false, length, width, height} = this.state;

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
                            <h3><Icon name="edit"/>{label}</h3>
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Icon style={{cursor:"pointer"}} onClick={this.handleClose} name='close' />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                        <label>Nom</label>
                        <Input autoFocus onFocus={this.handleFocus} placeholder='Search...'value={this.state.name} onChange={(e, {value}) => this.setState({name: value})} />
                        </Form.Field>
                        <Form.Field>
                        <label>Longueur (mm)</label>
                        <Input placeholder='Longueur' type='number' min="1" onChange={(e, {value}) => {if (value <= 0) value = 1; this.setState({length: value}); this.handleUpdateImage();}} value={this.state.length} />
                        </Form.Field>
                        <Form.Field>
                        <label>Largeur (mm)</label>
                        <Input placeholder='Largeur' type='number' min="1" onChange={(e, {value}) => {if (value <= 0) value = 1; this.setState({width: value}); this.handleUpdateImage();}} value={this.state.width} />
                        </Form.Field>
                        <Form.Field>
                        <label>Hauteur (mm)</label>
                        <Input placeholder='Hauteur' type='number' min="1" onChange={(e, {value}) => {if (value <= 0) value = 1; this.setState({height: value}); this.handleUpdateImage();}} value={this.state.height} />
                        </Form.Field>
                        <Form.Field>
                            <center>
                                {
                                    this.state.image ?
                                    <ThreeScene w="100%" h="200px"
                                                isControlled={true}
                                                is3D={is3D}
                                                config={this.props.model.base.conf3D}
                                                size={{l: Number(length), w: Number(width), h: Number(height)}}
                                                svg={this.state.image}
                                                user_config={{version:1, thickness:4, thickness_resource_id:0, colors:{}, front:[], back:[]}}
                                    />
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
                        <Button compact type='submit' color='blue' onClick={this.handleSubmit}
                        disabled={this.state.name.length===0 || this.state.width === 0 || this.state.length === 0 || this.state.height === 0}>Créer
                        </Button>
                    </center>
                </Modal.Actions>
            </Modal>
        </Draggable>
        )
    }
}

ModalUpdateProject.propTypes = {
    onClose: PropTypes.func.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default connect(null, {
    get_model: actions.template.get
})(ModalUpdateProject)
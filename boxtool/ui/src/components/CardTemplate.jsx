import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Image, Grid, Button, Card } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { connect } from 'react-redux';
import actions from "../actions/app";

import { makeCancelable } from '../store/utils'
import ModalNewProject from "./ModalNewProject";

import ThreeScene from '../threejs/ThreeScene';

class CardTemplate extends Component {
    constructor(props){
        super(props);
        this.state = {image: null, modalOpen: false}
        this.get_svg = makeCancelable(this.props.get_model(this.props.model.name));
        this.get_svg.promise.then(payload => {
            this.setState({image: payload});
        });
    }

    componentWillUnmount() {
        if (this.get_svg) this.get_svg.cancel();
        if (this.get_newsvg) this.get_newsvg.cancel();
        if (this.create) this.create.cancel();
    };

    componentDidUpdate(prevProps) {
        if (prevProps.model.name !== this.props.model.name) {
            this.setState({image: null})
            this.get_svg = makeCancelable(this.props.get_model(this.props.model.name));
            this.get_svg.promise.then(payload => {
                this.setState({ image: payload });
            });
        }
    }

    handleCancelModal = (e) => this.setState({modalOpen: false});
    handleValidateModal = (e, label, name_project, l, w, h) => {
        this.setState({modalOpen: false});
        const type_defined = 1;
        const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        this.get_newsvg = makeCancelable(this.props.get_model(this.props.model.name, l, w, h));
        this.get_newsvg.promise.then(payload => {
            this.create = makeCancelable(this.props.create_project(this.props.model.name, label, name_project, type_defined, date, {
                svg: payload,
                conf3D: this.props.model.conf3D,
                properties: {l: Number(l), w:Number(w), h: Number(h)}
            }));
            this.create.promise.then(payload => {
                //this.props.history.push('/workspace/' + payload.workspace_id);
                toast('Créer une boîte avec succès')
            });
        });
    };
    handleStart = (e) => {
        e.stopPropagation();
        this.setState({modalOpen: true});
    }

    render() {
        const { model } = this.props;
        const { image, modalOpen } = this.state;
        return (
            <Fragment>
            {modalOpen && <ModalNewProject onClose={this.handleCancelModal} onValidate={this.handleValidateModal} model={model}></ModalNewProject>}
            <Grid.Column mobile={16} tablet={8} computer={4}>
                <Card color={model.dev ? 'red' : 'blue'}>

                    {/* <div className="content ui image large" dangerouslySetInnerHTML={{ __html: image }}></div> */}
                    {image ?
                      <ThreeScene w="100%" h="200px" svg={image}
                      user_config={{
                        version:1,
                        thickness:4,
                        thickness_resource_id:0,
                        colors:{},
                        front:[],
                        back:[]
                    }}></ThreeScene>
                    :
                    <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    }
                    <Card.Content>
                        <Card.Header>{model.name}</Card.Header>
                        <Card.Meta>version {model.version}</Card.Meta>
                        <Card.Description>{model.render.args[2]} x {model.render.args[3]} x {model.render.args[4]}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button basic fluid color='green' onClick={this.handleStart}>Commencer</Button>
                    </Card.Content>
                </Card>
                <ToastContainer/>
            </Grid.Column>
            </Fragment>
        )
    }
}


export default connect(null, {
    get_model: actions.template.get,
    create_project: actions.workspace.create
})(withRouter( CardTemplate ) );
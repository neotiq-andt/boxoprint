import React, { Component } from 'react';

import { Button } from 'semantic-ui-react';
import ModalLayer from './ModalLayer';

//import InputColor from 'react-input-color';
import ReactTooltip from 'react-tooltip';
import ColorPicker from './ColorPicker';


export default class ToolBarMobile extends Component {
    state = {
        modal : false,
        type : 'text',
        color : '#000000',
        edition : true,
        brush: false,
        helpers: true,
    };

    init = false;

    modalResult = (r) => {
        this.setState({modal:false});
        this.props.modalResult(r);
    };

    handleSelectColor = (color, toggle = false) => {
        this.props.handleBrush(toggle ? !this.state.brush :true, color);
        this.setState({color:color, brush: toggle ? !this.state.brush :true});
    }

    handleBrush = (e) => {
        this.props.handleBrush(!this.state.brush, this.state.color);
        this.setState({brush:!this.state.brush});
    };

    handleColor = (c) => {
        if (this.state.brush === false && this.init === true) {
            this.props.handleBrush(!this.state.brush, c);
            this.setState({brush:!this.state.brush,color:c});
        } else {
            this.props.handleBrush(this.state.brush, c);
            this.setState({color:c});
        }
        this.init = true;
    };

    render() {
        return (
            <div className={'box-tool-bar-mobile'}>
                {(this.state.modal || this.props.openLayer) && <ModalLayer checkLayerName={this.props.checkLayerName} open={true} config={this.props.openLayer} type={this.props.openLayer ? this.props.openLayer.layer_type : this.state.type} onResult={this.modalResult}/>}
                <Button.Group style={{marginRight:10}}>
                    <Button data-tip="Passer en mode 3D" onClick={(e)=>{this.props.on3D();this.setState({edition:false});this.init=false}} active={!this.state.edition} style={{backgroundColor:this.state.edition === false ? '#00a2e8' : null}}>3D</Button>
                    <Button.Or text='/'/>
                    <Button data-tip="Passer en mode édition" onClick={(e)=>{this.props.on2D();this.setState({edition:true});this.init=true}} active={this.state.edition} style={{backgroundColor:this.state.edition === true ? '#00a2e8' : null}}>2D</Button>
                </Button.Group>
                <Button.Group style={{marginRight:5}} data-tip="Enregistrer le projet">
                    {this.state.edition === true && <Button color='orange' icon="save" onClick={()=>{this.props.handleSave()}}/>}
                </Button.Group>
                <Button.Group style={{marginRight:20}} data-tip="Exporter le projet">
                    {this.state.edition === true && <Button color='orange' icon="download" onClick={this.props.exportFile}/>}
                </Button.Group>
                <Button.Group data-tip="Ajouter une image" style={{marginLeft:-5}}>
                    {this.state.edition === true && <Button icon="picture" onClick={()=>{this.setState({modal:true,type:'picture'})}}/>}
                </Button.Group>
                <Button.Group data-tip="Ajouter un texte" style={{marginLeft:5}}>
                    {this.state.edition === true && <Button icon="text cursor" onClick={()=>{this.setState({modal:true,type:'text'})}}/>}
                </Button.Group>
                {/* {this.state.edition === true ? (<Button.Group data-tip="Selectionner une couleur" style={{marginLeft:10}}>
                    <Button icon={this.state.brush === true ? "paint brush" : "paint brush"} style={{backgroundColor:this.state.brush === true ? '#00a2e8' : null}} onClick={this.handleBrush}/>
                    <InputColor style={{height:'36px',width:'10px',marginLeft:0,border:0,margin:0,padding:0}} initialHexColor={this.state.color} onChange={(e)=>this.handleColor(e.hex)} placement="bottom"/>
                </Button.Group>): null} */}
                <Button.Group data-tip="Selectionner une couleur">
                    {this.state.edition && <ColorPicker
                        brush={this.state.brush}
                        initialHexColor={this.state.color}
                        onColorChanged={(color) => this.handleSelectColor(color.hex) }
                        onClick={ (e, color) => { ReactTooltip.hide(); this.handleSelectColor(color.hex, true) } } /> }
                </Button.Group>
                <Button.Group data-tip="Repositionner la vue" style={{marginLeft:15}}>
                    {this.state.edition === true && <Button icon="expand arrows alternate" onClick={this.props.zoomCenter}/>}
                </Button.Group>
                <Button.Group data-tip="Coupeurs / Raineurs" style={{marginLeft:15}}>
                    <Button icon={this.state.helpers ? "eye" : "eye slash"} onClick={() => {
                            this.props.toogleHelpers(!this.state.helpers)
                            this.setState({...this.state, helpers: !this.state.helpers})
                        }
                    }/>
                </Button.Group>
                <ReactTooltip place="bottom" type="info" effect="solid" />
            </div>
        );
    };
};

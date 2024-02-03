import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Button, Dropdown, Icon} from 'semantic-ui-react'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'
import actions from "../actions/app"
import IconMenu from "./IconMenu"
import iconLayer from "../resources/icon/menu/icon-layer.png"
import iconText from './../resources/icon/menu/icon-text.png'
import imageShape from './../resources/icon/menu/shape_icon.png'
import imageGreen from './../resources/icon/menu/icon-12.png'
import textGreen from './../resources/icon/menu/icon-13.png'

class DimensionBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: props.layers,
            isOpen: props.isOpen,
            disable_button: true,
        }
    };

    handleChangeDimension = (name, value) => {
        if((value && value < this.dMin ) || isNaN(value))
            value = this.dMin;
        this.setState({[name]: value});
        this.setState({disable_button: false});
    };

    handleApply = ()=>{
        this.props.handleUpdateEditLayer(this.state.layers);
        this.setIsOpen();
    };

    handleClickOutside = () => {
        let {isOpen = false} = this.state;
        if( isOpen)
            this.setIsOpen();
    };

    setIsOpen = ()=>{
        let {isOpen = false} = this.state;
        this.setState({isOpen: !isOpen});
    };

    handleOrderLayer = (layerIndex, type) => {
        
        let current = this.state;
        let oldLayer = current.layers;
        var maxOrder = 0;
        if (current.layers.length > 0) {
          maxOrder = Math.max.apply(Math, current.layers.map(function(o) { return o.order; }));
        }
        if (type === 1) {
          if  (layerIndex > 0) {
            const currentOrder = current.layers[layerIndex - 1].order;
            current.layers[layerIndex - 1].order = currentOrder + 1;
            current.layers[layerIndex].order = currentOrder;
          }
        } else if (type === -1) {
          if  (layerIndex < current.layers.length) {
            const currentOrder = current.layers[layerIndex + 1].order;
            current.layers[layerIndex + 1].order = currentOrder - 1;
            current.layers[layerIndex].order = currentOrder;
          }
        } else if (type === 0) {
          current.layers[layerIndex].order = 1;
          for (let i = 0; i < current.layers.length; i++) {
            if (i < layerIndex)
              current.layers[i].order = current.layers[i].order + 1;
            if (i > layerIndex)
              current.layers[i].order = current.layers[i].order - 1;
          }
        } else if (type === 2) {
          current.layers[layerIndex].order = maxOrder;
          for (let i = layerIndex; i < current.layers.length; i++) {
            current.layers[i].order = current.layers[i].order - 1;
          }
        }
        current.disable_button = false;
        this.setState(current);
    };

    handleSelectLayer = (layerName) => {
        this.props.handleUpdateEditLayer(this.state.layers);
        this.props.onSelectLayer(layerName);
        this.setIsOpen();
    };

    handleDeleteLayer(index){
        this.props.handleUpdateEditLayer(this.state.layers);
        this.props.handleShowModelConfirm(index);
    };

    render() {
        const { disable_button, isOpen, layers } = this.state;
        return (
            <>
                <Dropdown open={isOpen} item floating icon={<IconMenu src={iconLayer} onClick={()=>{this.setIsOpen(); this.props.onClick()}} title={this.props.titleMenu}/>}>
                    <Dropdown.Menu className={'dropdown-menu'} key={Math.random()}>
                        {layers.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)).map( (item, index)=>{
                            return <Dropdown.Item key={Math.random()}>
                                        <div className={"row"}>
                                            <div className={'toolbar-layer-title'}>
                                                {item.layer_type === undefined && <img alt={''} src={iconText} className="ui mini middle aligned image"/>}
                                                {item.layer_type === 'text' && <> <img alt={''} src={textGreen} className="ui mini middle aligned image"/>
                                                <span onClick={()=>{this.handleSelectLayer(item.layer_name)}}> &nbsp;&nbsp; {item.layer_name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                </>}
                                                {item.layer_type === 'picture' &&<> <img alt={''} src={imageGreen} className="ui mini middle aligned image"/>
                                                <span onClick={()=>{this.handleSelectLayer(item.layer_name)}}> &nbsp;&nbsp; {item.layer_name} &nbsp;</span>
                                                </>}
                                                {item.layer_type === 'shape' &&<> <img alt={''} src={imageShape} className="ui mini middle aligned image"/>
                                                                                <span onClick={()=>{this.handleSelectLayer(item.layer_name)}}> &nbsp;&nbsp; {item.layer_name} &nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                    </>}
                                            </div>
                                            <div className={'toolbar-layer-icon'}>
                                                <Icon className={''} name='edit' onClick={()=>{this.handleSelectLayer(item.layer_name);this.props.handleEditLayer(index)}} />
                                                <Icon title='Mise en avant' className={''} name='angle up' onClick={()=>{   //this.props.onSelectLayer(item.layer_name);
                                                                                                                            this.handleOrderLayer(index, 1); }} />
                                                <Icon title='Mise en arrière' className={''} name='angle down' onClick={()=>{ //this.props.onSelectLayer(item.layer_name);
                                                                                                                            this.props.handleOrderLayer(index, -1); }} />
                                                <Icon className={''} name='delete' onClick={()=>{this.handleDeleteLayer(index+1)}} />
                                                <span onClick={()=>{this.handleSelectLayer(item.layer_name)}}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                </span>
                                            </div>
                                        </div>
                                    </Dropdown.Item>})}

                                    {layers !== null && layers.length > 0 && 
                                    <Dropdown.Item  onClick={(e) => e.stopPropagation()} >
                                        <div className={"row"} style={{textAlign:'center'}}>
                                            <Button primary style={{background:'#6ebe45',borderRadius: '1.285714rem'}} disabled={disable_button} onClick={()=>{this.handleApply();}}>Appliquer</Button>
                                        </div>
                                    </Dropdown.Item>
                                    }
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }
}

DimensionBox.propTypes = {
    handleSaveDimension: PropTypes.func.isRequired,
    edit: PropTypes.bool
}

DimensionBox.defaultProps = {
    handleSaveDimension: () => {},
    edit: false
}

export default connect(null, {
    get_model: actions.template.get,
    update_project: actions.workspace.update,
})(onClickOutside(DimensionBox))

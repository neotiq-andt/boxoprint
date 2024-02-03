import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Header, Button, Segment} from 'semantic-ui-react'
import { connect } from 'react-redux'

import UiRange from "./UiRange"
import actions from "../actions/app"
import {makeCancelable} from "../store/utils"

class DimensionProject3d extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.model.label || "",
            length: this.props.baseProperties.l || 0,
            width: this.props.baseProperties.w || 0,
            height: this.props.baseProperties.h || 0,
            disable_button: false
        }
    }

    dmin = 50;
    dmax = 300;

    handleChangeDimension = (name, value) => {
        if( value || (value < this.dmin) || isNaN(value))
            value = this.dmin
        this.setState({[name]: value});
        this.setState({disable_button: false});
        //this.handleUpdateImage()
    }

    handleApply = ()=>{
        this.handleUpdateImage();
    }

    checkEnable = ()=>{
        let {length, width, height} = this.state;
        if( !length || !width || !height || length < this.dmin || width < this.dmin || height < this.dmin)
            return true;
        return false;
    }

    handleUpdateImage = () => {
        this.setState({disable_button: true});
        let {length, width, height} = this.state;
        if(length < this.dmin)
            length = this.dmin;
        
        if(width < this.dmin)
            width = this.dmin;
        
        if(height < this.dmin)
            height = this.dmin;
        
        if(length > this.dmax)
            length = this.dmax;
        
        if(width > this.dmax)
            width = this.dmax;
        
        if(height > this.dmax)
            height = this.dmax;
    
        if (this.timer)
            clearTimeout(this.timer);
        
        if( JSON.stringify({l: length, w: width, h: height}) === JSON.stringify(this.props.baseProperties))
            return true;

        this.timer = setTimeout((self) => {
            self.get_svg = makeCancelable(self.props.get_model(this.props.model.label.replace('Nouveau ', ''), self.state.length, self.state.width, self.state.height));
            self.get_svg.promise.then(payload => {this.props.handleSaveDimension({svg: payload, properties: {l: length, w: width, h: height}});});
            this.setState({disable_button: false});
        }, 200, this);
    }

    render() {
        const {model, edit} = this.props;
        const {length, width, height, disable_button } = this.state;
        return (
            <>
                <Header as='h3' style={{textTransform:'uppercase'}}>
                    Prix : {Number(model.price).toFixed(2)} €
                </Header>
                <Header as='h5'>
                    Dimensions :
                </Header>
                <Segment basic style={{width:'100%',height:'100%',paddingLeft: '0px'}} color='blue'>
                    <div className="row">
                        <UiRange edit={edit} name={'length'} title={"L"}
                                 defaultValue={length}
                                 model={model}
                                 min={this.dmin}
                                 max={this.dmax}
                                 is3D={this.props.is3D}
                                 onChangeValue={this.handleChangeDimension}
                        />
                    </div>
                    <div className="row">
                        <UiRange edit={edit} name={'width'} title={"W"}
                                 defaultValue={width}
                                 min={this.dmin}
                                 max={this.dmax}
                                 is3D={this.props.is3D}
                                 onChangeValue={this.handleChangeDimension}
                        />
                    </div>
                    <div className="row">
                        <UiRange edit={edit} name={'height'} title={"H"}
                                 defaultValue={height}
                                 min={this.dmin}
                                 max={this.dmax}
                                 is3D={this.props.is3D}
                                 onChangeValue={this.handleChangeDimension}
                        />
                    </div>
                    <div className="row" style={{textAlign:'center'}}><Button primary style={{background:'#6ebe45',borderRadius: '1.285714rem',marginTop: '10px'}} disabled={disable_button || this.checkEnable()} onClick={this.handleApply}>Apply</Button></div>
                </Segment>
            </>
        )
    }
}

DimensionProject3d.propTypes = {
    handleSaveDimension: PropTypes.func.isRequired,
    edit: PropTypes.bool
}

DimensionProject3d.defaultProps = {
    handleSaveDimension: () => {},
    edit: false
}

export default connect(null, {
    get_model: actions.template.get,
    update_project: actions.workspace.update,
})(DimensionProject3d)
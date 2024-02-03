import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Button, Dropdown} from 'semantic-ui-react'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'

import UiRange from "./UiRange"
import actions from "../actions/app"
import {makeCancelable} from "../store/utils"
import IconMenu from "./IconMenu"
import iconLayer from "../resources/icon/menu/icon-layer.png"

class DimensionBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.model.label || "",
            length: this.props.baseProperties.l || 0,
            width: this.props.baseProperties.w || 0,
            height: this.props.baseProperties.h || 0,
            disable_button: false,
            isOpen: false,
        }
    }

    dMin = 50;
    dMax = 300;

    handleChangeDimension = (name, value) => {
        if((value && value < this.dMin ) || isNaN(value))
            value = this.dMin;
        this.setState({[name]: value});
        this.setState({disable_button: false});
    }

    handleApply = ()=>{
        this.handleUpdateImage();
        this.setIsOpen();
    }

    handleUpdateImage = () => {
        this.setState({disable_button: true});
        let {length, width, height} = this.state;
        if( length < this.dMin)
            length = this.dMin;

        if( width < this.dMin)
            width = this.dMin;

        if( height < this.dMin)
            height = this.dMin;

        if( length > this.dMax)
            length = this.dMax;

        if( width > this.dMax)
            width = this.dMax;

        if( height > this.dMax)
            height = this.dMax;

        if (this.timer)
            clearTimeout(this.timer);

        if(JSON.stringify({l: length, w: width, h: height}) === JSON.stringify(this.props.baseProperties))
            return true;

        this.timer = setTimeout((self) => {
            self.get_svg = makeCancelable(self.props.get_model(this.props.model.label.replace('Nouveau ', ''), self.state.length, self.state.width, self.state.height));
            self.get_svg.promise.then(payload => {this.props.handleSaveDimension({svg: payload, properties: {l: length, w: width, h: height}});})
            this.setState({disable_button: false});
        }, 1000, this);
    }

    handleClickOutside = () => {
        let {isOpen = false} = this.state;
        if( isOpen)
            this.setIsOpen();
    }

    checkEnable = ()=>{
        let {length, width, height} = this.state;
        if(!length || !width || !height || length < this.dMin || width < this.dMin || height < this.dMin)
            return true;
        return false;
    }

    setIsOpen = ()=>{
        let {isOpen = false} = this.state;
        this.setState({isOpen: !isOpen});
    }

    render() {
        const {baseProperties, model, edit} = this.props;
        const { disable_button, isOpen } = this.state;
        return (
            <>
                <Dropdown open={isOpen} item floating icon={<IconMenu src={iconLayer} onClick={()=>{this.setIsOpen(); this.props.onClick()}} title={'Dimension'}/>}>
                    <Dropdown.Menu  className={'dropdown-menu'} style={{width:'400px'}}>
                        <Dropdown.Item  onClick={(e) => e.stopPropagation()}>
                            <div className={"row"}>
                                <UiRange edit={edit} name={'length'} title={"L"}
                                         defaultValue={baseProperties.l}
                                         model={model}
                                         min={this.dMin}
                                         max={this.dMax}
                                         is3D={this.props.is3D}
                                         key={isOpen}
                                         onChangeValue={this.handleChangeDimension}
                                />
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item  onClick={(e) => e.stopPropagation()}>
                            <div className={"row"}>
                                <UiRange edit={edit} name={'width'} title={"L"}
                                         defaultValue={baseProperties.w}
                                         min={this.dMin}
                                         max={this.dMax}
                                         is3D={this.props.is3D}
                                         key={isOpen}
                                         onChangeValue={this.handleChangeDimension}
                                />
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item  onClick={(e) => e.stopPropagation()}>
                            <div className={"row"}>
                                <UiRange edit={edit} name={'height'} title={"H"}
                                         defaultValue={baseProperties.h}
                                         min={this.dMin}
                                         max={this.dMax}
                                         key={isOpen}
                                         is3D={this.props.is3D}
                                         onChangeValue={this.handleChangeDimension}
                                />
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item  onClick={(e) => e.stopPropagation()} >
                            <div className={"row"} style={{textAlign:'center'}}>
                                <Button primary style={{background:'#6ebe45',borderRadius: '1.285714rem'}} disabled={disable_button || this.checkEnable()} onClick={()=>{this.handleApply();}}>Appliquer</Button>
                            </div>
                        </Dropdown.Item>
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

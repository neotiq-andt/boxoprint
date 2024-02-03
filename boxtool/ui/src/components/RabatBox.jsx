import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Dropdown, Form} from 'semantic-ui-react'
import { connect } from 'react-redux'

import actions from "../actions/app"
import IconMenu from "./IconMenu"
import iconLayer from "../resources/icon/menu/icon-layer.png"
import PropertyRange from "../PropertyControl/PropertyRange";

class RabatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    setIsOpen = ()=>{
        let {isOpen = false} = this.state;
        this.setState({isOpen: !isOpen});
    }

    display_rabats = ()=> {
        const rabats = [];
        const { presets } = this.props.config;
        const publicOptions = this.props.config.public;
        const preset = presets["default"];
        const conf = preset[0];

        var i = 0;
        for (var property in publicOptions) {
            i++;
            if (publicOptions.hasOwnProperty(property)) {
                const info = publicOptions[property];
                let val = conf[property];
                rabats.push(
                    <Dropdown.Item key={i} onClick={(e) => e.stopPropagation()}>
                        <div className={"row"} style={{marginBottom:'20px'}}>
                            <Form.Field >
                                <label style={{textTransform: 'capitalize'}}>{info.label}</label>
                                <PropertyRange defaultValue={val ? val : 0} onChange={this.handleChangeRange(property)}></PropertyRange>
                            </Form.Field>
                        </div>
                    </Dropdown.Item>);
            }
        }

        return rabats;
    }

    handleChangeRange = (property)=> (value) => {
        this.props.onRangeChange("default", property, value);
    }

    render() {
        const { isLoading = false, edition = false} = this.props;
        return (
            <>
                <Dropdown className={ !isLoading && edition === true ? "item-inactive":"" } item floating icon={<IconMenu src={iconLayer} onClick={this.setIsOpen} title={'Rabats'}/>}>
                    <Dropdown.Menu className={'dropdown-menu'} style={{width:'400px'}}>
                        {this.display_rabats()}
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }
}

RabatBox.propTypes = {
    onRangeChange: PropTypes.func.isRequired,
    config: PropTypes.object
}

RabatBox.defaultProps = {
    onRangeChange: () => {},
    config: {}
}

export default connect(null, {
    get_model: actions.template.get,
    update_project: actions.workspace.update,
})(RabatBox)
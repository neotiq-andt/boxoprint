import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Accordion,
    Form,
} from 'semantic-ui-react'

import PropertyRange from './PropertyRange'
import ThreeSceneBoxView from "../threejs/ThreeSceneBoxView";

export default class PropertyGridControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex : 1,
        }
    }

    handleChangeRange = (property)=> (value) => {
        this.props.onRangeChange("default", property, value);
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
                rabats.push(<Form.Field key={i}>
                <label>{info.label}</label>
                <PropertyRange defaultValue={val ? val : 0} onChange={this.handleChangeRange(property)}></PropertyRange>
            </Form.Field>);
            }
        }

        return rabats;

    }

    handleChangeRangeZoom = ()=> (value) => {
        this.props.handleZoomIn(value)
    }

    /**
     * close iframe
     */
    closeIframe = () =>{
        window.top.postMessage('closeIframe', '*')
    }

    render() {
        const { is3D} = this.state;
        const { presets } = this.props.config;
        var presetOptions = [];
        for (var property in presets) {
            if (presets.hasOwnProperty(property)) {
                const info = presets[property];
                presetOptions.push({ key: property, text: info.label, value: property});
            }
        }

        return (
            <Accordion  fluid>
                <ThreeSceneBoxView
                    selectedLayer={this.props.selectedLayer}
                    onBrush={this.props.onBrush}
                    onSelectLayer={this.props.onSelectLayer}
                    config={this.props.config}
                    brush={this.props.brush}
                    user_config={this.props.user_config}
                    //is3D={this.props.is3D}
                    is3D={is3D}
                    w='100%'
                    h='600px'
                    on2D={this.props.on2D}
                    on3D={this.props.on3D}
                    isControlled={true}
                    size={this.props.size}
                    svg={this.props.svg}/>
            </Accordion>
        )
    }
}


PropertyGridControl.propTypes = {
    onRangeChange: PropTypes.func,
};
PropertyGridControl.defaultProps = {
    onRangeChange: (preset, property, value) => {},
};

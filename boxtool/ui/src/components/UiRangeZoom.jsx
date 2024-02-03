import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react';
import 'rc-slider/assets/index.css'

export default class PropertyRange extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    zoomBox = (zoomType, event)=>{
        event.preventDefault();
        this.props.onChange(zoomType, false);
    }

    render() {
        return (
            <Fragment>
                <Button.Group widths='16'>
                    <Button icon='zoom-out' onClick={this.zoomBox.bind(this,'zoom-out')} />
                    <Button content={this.props.defaultValue+' %'} />
                    <Button icon='zoom-in' onClick={this.zoomBox.bind(this,'zoom-in')} />
                </Button.Group>
            </Fragment>
        )
    }
}

PropertyRange.propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func,
    tipFormatter: PropTypes.func,
}

PropertyRange.defaultProps = {
    max: 100,
    min: 0,
    defaultValue: 0,
    onChange: (value) => { /*console.log(value);*/ },
    tipFormatter: (value) => { return `${value} %`; },
}
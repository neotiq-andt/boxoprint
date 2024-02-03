import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';

import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';


const SliderWithTooltip = createSliderWithTooltip(Slider);

function angleFormatter(v) {
  return `${v} °`;
}

export default class PropertyRange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marks: {
                '-180': (this.props.min <= -180 && this.props.max >= -180) ? -180 : undefined,
                '-90': (this.props.min <= -90 && this.props.max >= -90) ? -90 : undefined,
                '0': (this.props.min <= 0 && this.props.max >= 0) ? <strong>0°C</strong>: undefined,
                '90': (this.props.min <= 90 && this.props.max >= 90) ? 90 : undefined,
                '180': (this.props.min <= 180 && this.props.max >= 180) ? 180 : undefined,
            }
        }
    }

    render() {
        const { marks } = this.state;
        return (
            <Fragment>
                <SliderWithTooltip
                tipFormatter={angleFormatter}
                tipProps={{ overlayClassName: 'foo' }}
                onChange={this.props.onChange}
                min={this.props.min}
                max={this.props.max}
                defaultValue={this.props.defaultValue}
                marks={marks}
                included={false}/>
            </Fragment>
        );
    }
};



PropertyRange.propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func,
    tipFormatter: PropTypes.func,
};
PropertyRange.defaultProps = {
    max: 180,
    min: -180,
    defaultValue: 0,
    onChange: (value) => { /*console.log(value);*/ },
    tipFormatter: (value) => { return `${value} °`; }, 
};

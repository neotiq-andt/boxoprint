import React, { Component } from 'react'
import {Input, TextArea, Select} from 'semantic-ui-react'
import InputColor from 'react-input-color'

class CustomInput extends Component {
    state = { value: '' };

    constructor(props) {
        super(props);
        if (this.props.type === "select") this.state = {value:this.props.value.current};
        else this.state = {value:this.props.value};
        if (this.props.regEvent) this.props.regEvent(this.handleExternalEvent);
    };

    handleExternalEvent = (e) => {
        this.setState({value:e});
    };

    onChange = (e, val) => {
        let value;
        switch (this.props.type) {
            case 'color':
                value = e.hex;
                this.props.onResult(value);
            break;
            case 'select':
                value = val.value;
                this.props.onResult(value);
            break;
            case 'float-abs':
                value = e.target.value.replace(/[^.?\d]/, '');
                if (isNaN(parseFloat(value)) === false) {
                    this.props.onResult(parseFloat(value));
                } else {
                    this.props.onResult(0);
                    value = '0';
                }
            break;
            case 'float':
                value = e.target.value.replace(/[^-?.?\d]/, '');
                if (isNaN(parseFloat(value)) === false) {
                    this.props.onResult(parseFloat(value));
                } else {
                    this.props.onResult(0);
                    value = '0';
                }
            break;
            case 'integer-abs-nonull':
            case 'integer-abs':
                value = e.target.value.replace(/[^\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    if (value === 0 && this.props.type === 'integer-abs-nonull') value = 1;
                    this.props.onResult(value);
                    value = '' + value;
                } else {
                    value = 0;
                    if (this.props.type === 'integer-abs-nonull') value = 1;
                    this.props.onResult(value);
                    value = '' + value;
                }
            break;
            case 'integer-abs-font_size':
                value = e.target.value.replace(/[^-?\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    if (value > 50) value = 50;
                    // if (value <= 20 )
                    //     value = value
                    // this.props.onResult(value);
                    // value = '' + value;
                } else {
                    // this.props.onResult(20);
                    // value = 20;
                }
                break;
            case 'float-abs-image':
                value = e.target.value.replace(/[^-?\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    if (value > 150) value = 150;
                    // if (value <= 20 )
                    //     value = value
                    // this.props.onResult(value);
                    // value = '' + value;
                } else {
                    // this.props.onResult(20);
                    // value = 20;
                }
            break;
            case 'float-abs-shape':
                value = e.target.value.replace(/[^-?\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    this.props.onResult(value);
                    value = '' + value;
                } 
            break;
            case 'angle':
            case 'integer':
                value = e.target.value.replace(/[^-?\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    if (value > 360 && this.props.type === 'angle') value = 360;
                    if (value < -360 && this.props.type === 'angle') value = -360
                    this.props.onResult(value);
                    value = '' + value;
                } else {
                    this.props.onResult(0);
                    value = '0';
                }
            break;
            default:
                value = e.target.value;
                this.props.onResult(value);
            break;
        }
        this.setState({value:value});
    };

    onBlur = (e, val) => {
        let value;
        switch (this.props.type) {
            case 'integer-abs-font_size':
                value = e.target.value.replace(/[^-?\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    if (value > 50) value = 50;
                    if (value <= 20 ) value = 20
                    this.props.onResult(value);
                    value = '' + value;
                } else {
                    this.props.onResult(20);
                    value = 20;
                }
                break;
            case 'float-abs-image':
                value = e.target.value.replace(/[^-?\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    if (value > 150) value = 150;
                    if (value <= 20 ) value = 20
                    this.props.onResult(value);
                    value = '' + value;
                } else {
                    this.props.onResult(20);
                    value = 20;
                }
                break;
            case 'float-abs-shape':
                value = e.target.value.replace(/[^-?\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    this.props.onResult(value);
                    value = '' + value;
                } 
                break;                
            default:
                value = e.target.value;
                this.props.onResult(value);
                break;
        }
        this.setState({value:value});
    };

    onClose = e => {
        if (this.state.value === '' && (this.props.type === 'integer' || this.props.type === 'integer-abs' || this.props.type === 'float'))
            this.setState({value:'0'});
    };

    render() {
        switch (this.props.type) {
            case "color": return ( <InputColor size='mini' initialHexColor={this.props.value} onChange={this.onChange} />);
            case "select": return (<Select placeholder="Selection" options={this.props.value.options} value={this.state.value} onChange={this.onChange} />);
            case "textarea":
                return (
                    <div style={{width:'100%',overflowY:'auto',height:this.props.height}}>
                        <TextArea size='mini' style={this.props.style} value={this.state.value} onChange={this.onChange} rows={2} />
                    </div>
                );
            default: return (<Input size='mini' type="text" value={this.state.value} onChange={this.onChange} onBlur={this.onBlur}/>);
        }
    };
}

CustomInput.propTypes = {}
CustomInput.defaultProps = {}
export default CustomInput;
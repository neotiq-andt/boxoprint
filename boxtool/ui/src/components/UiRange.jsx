import React, { Component } from 'react'
import { Slider } from "react-semantic-ui-range"
import { Label, Grid } from "semantic-ui-react"

export default class UiRange extends Component {
    constructor(props) {
        super(props);
        this.state = {index: 0, errors:[], value:props.defaultValue, handle: false};
    }

    settings = {
        start: 2,
        min: parseInt(this.props.min),
        max: parseInt(this.props.max) + 1,
        step: 1,
        onChange: value => {
            if( ((value <= this.settings.min || value > parseInt(this.props.max)) && this.state.handle) || !value )
                return true;
            this.setState({value, handle: false});
            this.props.onChangeValue(this.props.name, value);
        }
    }

     checkValid = (name, value)=>{
        let {errors=[]} = this.state;
        if( value < this.settings.min || value > parseInt(this.props.max) ){
            const listError = errors.filter(item=> item.name=== name);
            if(!listError.length){
                errors.concat({name, message:'dddd'});
                this.setState({errors});
            }
            return true;
        }else{
            const listError = errors.filter(item=> item.name !== name);
            this.setState({errors: listError});
            return false;
        }
    }

     handleValueChange = (e) => {
         let value = e.target.value || '';
         const regex = new RegExp('^[1-9][0-9]*$');
         if (e.target.value === '' || regex.test(value)) {
             value = parseInt(value);
             this.setState({value,handle: true});
             if( value > parseInt(this.props.max))
                 this.setState({value: parseInt(this.props.max), handle: true});
         }else{
             this.setState({value: '', handle: true});
         };
    }

    handleValueBlur = (event) => {
        let value = event.target.value;
        if (value === '') {
            value = this.settings.min;
            this.setState({value});
        };
        value = parseInt(value);
        if( value < this.settings.min){
            value = parseInt(this.settings.min);
            this.setState({value});
        };
        if( value > parseInt(this.props.max)){
            value = parseInt(this.props.max);
            this.setState({value});
        };
        this.props.onChangeValue(this.props.name, value);
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            let value = event.target.value;
            if (value === '') {
                value = this.settings.min;
                this.setState({value});
            }
            value = parseInt(value);
            if( value < this.settings.min){
                value = parseInt(this.settings.min);
                this.setState({value});
            }
            if( value > parseInt(this.props.max) ){
                value = parseInt(this.props.max);
                this.setState({value});
            }
            this.props.onChangeValue(this.props.name, value);
        }
    }

    render() {
        const {value} = this.state;
        return (
            <>
                <Grid>
                    <Grid.Column width={2}>
                        <Label>{this.props.title}</Label>
                    </Grid.Column>
                    <Grid.Column width={11} style={{paddingRight: '0px'}}>
                        {value < 50 ?
                            <Slider value={this.settings.min} color='black' settings={this.settings}/>
                            :
                            <Slider value={value} color='black' settings={this.settings}/>
                        }

                    </Grid.Column>
                    <Grid.Column width={3}>
                        <div className="ui mini input" style={{width: '50px', marginTop: '-5px'}}>
                            <input placeholder="Enter Value"
                                   type="number"
                                   pattern="[0-9]*"
                                   max={parseInt(this.settings.max)}
                                   value={value}
                                   onChange={this.handleValueChange.bind(this)}
                                   onBlur={this.handleValueBlur.bind(this)}
                                   onKeyPress={this.handleKeyPress.bind(this)}
                            />
                        </div>
                    </Grid.Column>
                </Grid>
            </>
        )
    }
}
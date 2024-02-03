import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'
import actions from "../actions/app"
import IconMenu from "./IconMenu"
import {Button, Form,  Icon, Grid, Dropdown} from 'semantic-ui-react'
import _ from "lodash"
import CustomInput from './CustomInput';
import { Fonts, FontStyle, FontWeight, LAYER_TYPE_TEXT } from '../constants/index'

class TextContent extends Component {

    constructor(props) {
        super(props);
        const {properties} = props;
        this.state = {font_weight: properties.font_weight, font_style: properties.font_style};
    }

    fonts = Fonts.map((current) => {
        return {
            key: current,
            text: current,
            value: current,
        };  
    });

    fontStyle = FontStyle.map((current) => {
        return {
            key: current,
            text: current,
            value: current,
        };
    });

    fontWeight = FontWeight.map((current) => {
        return {
            key: current,
            text: current,
            value: current,
        };
    });

    componentDidMount() {
        if (this.props.properties){
            let current = this.props.properties;
            if (this.props.name)
                current.name = this.props.name;
            this.setState(current);
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!prevProps.properties){
            prevState.x = prevProps.properties.x;
            prevState.y = prevProps.properties.y;
        }
    }

    update(u) {
        if (this.props.onResult)
            this.props.onResult(u);
        this.setState(u);
    };

    onChangeFontStyle = ()=>{
        let {font_style} = this.state;
        font_style = font_style === 'normal' ? 'italic':'normal';
        this.update({font_style});
    }

    onChangeFontWeight = ()=>{
        let {font_weight} = this.state;
        font_weight = font_weight === 'normal' ? 'bold':'normal';
        this.update({font_weight});
    }

    render() {
        const {properties} = this.props , {font_style, font_weight} = this.state, text_align = properties.x ? this.props.text_align : this.props.properties.text_align || "";
        return (
            <Form size="mini">
                <Grid className={'grid-text-box'}>
                    <Grid.Row className={'row-text-box1'}>
                        <Grid.Column width={4}>
                            <Form.Field control={CustomInput} label='Rotation (°)' type='angle' value={this.props.properties.rotate} onResult={(r)=>{this.update({rotate:r})}}/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                        <Form.Field control={CustomInput} label='Taille (mm)' type='integer-abs-font_size' value={this.props.properties.font_size} onResult={(r)=>{this.update({font_size:r})}}/>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Field control={CustomInput} label='Style' type='select' value={{current:this.props.properties.font_family,options:this.fonts}} onResult={(r)=>{this.update({font_family:r})}}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={'row-text-box2'}>
                        <Grid.Column className={'column-text-box2-button'} width={8}>
                                <Button  className='btnBold' style={{ margin: "17px 0 0 0 !important" }} key={font_weight ==='bold'} icon active={ font_weight ==='bold' } onClick={this.onChangeFontWeight.bind(this)} title={'Bold'}>
                                    <Icon name='bold' />
                                </Button>
                                <Button className='btnItalic' style={{ margin: "13px 0 0 0 !important" }} key={font_style} icon active={ font_style ==='italic' } onClick={this.onChangeFontStyle.bind(this)} title={'Italic'}>
                                    <Icon name='italic' />
                                </Button>
                                <Form.Field className={'ui buttons field-button'} control={CustomInput} label='' type='color' value={this.props.properties.color} onResult={(r)=>{this.update({color:r})}}/>
                        </Grid.Column>
                        <Grid.Column className={'column-text-box2-position'} width={8}>
                                <label style={{fontSize: '11px', display: 'block', marginTop: '4px', fontWeight: 'bold'}}>Position du calque</label>

                                <Button icon active={ text_align ==='align-left' } onClick={()=>this.props.AlignPosition('align-left')}  title={'Align left'}>
                                    <Icon name='align left' />
                                </Button>

                                <Button icon active={ text_align ==='align-center' } onClick={()=>this.props.AlignPosition('align-center')}  title={'Align center'}>
                                    <Icon name='align center' />
                                </Button>

                                <Button icon active={ text_align ==='align-right' } onClick={()=>this.props.AlignPosition('align-right')}  title={'Align right'}>
                                    <Icon name='align right' />
                                </Button>

                                <Button icon active={ text_align ==='align-top' } onClick={()=>this.props.AlignPosition('align-top')}  title={'Align top'}>
                                    <Icon name='angle double up' />
                                </Button>

                                <Button icon active={ text_align ==='align-bottom' } onClick={()=>this.props.AlignPosition('align-bottom')} title={'Align bottom'}>
                                    <Icon name='angle double down' />
                                </Button>
                                
                        </Grid.Column>
                    </Grid.Row>                        
                    <Grid.Row className={'row-text-box3'}>
                        <Grid.Column>
                            <Form.Field control={CustomInput} style={{color:this.state.color,fontFamily:this.state.font_family,fontSize:20,fontStyle:this.state.font_style,fontWeight:this.state.font_weight}} label='Texte' type='textarea' value={this.props.properties.text} onResult={(r)=>{this.update({text:r})}}/>
                            {/* <Form.Field  className={'input-text-box'} control={CustomInput} style={{color:this.state.color,fontFamily:this.state.font_family,fontSize:20,fontStyle:this.state.font_style,fontWeight:this.state.font_weight,whiteSpace: 'pre-line'}} label='Texte' type='textarea' value={this.props.properties.text} onResult={(r)=>{this.update({text:r})}}/> */}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        );
    };
};

class TextBox extends Component {

    constructor(props) {
        super(props);
        const {properties} = props.config || {};
        this.state = {
            name: props.model.label || "",
            length: this.props.baseProperties.l || 0,
            width: this.props.baseProperties.w || 0,
            height: this.props.baseProperties.h || 0,
            disable_button: false,
            isOpen: false,
            autoSpinner: true, 
            selectedFile:'',
            text_align: props.config == null ? "align-center": properties.text_align || "",
            addLayer: true,
        }
    }

    defaultBoundingRect = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        text_align: 'align-center'
    };

    defaultText = {
        name:"Texte",
        x: this.props.canvasVectorCenter.canvas.width /2,
        y: this.props.canvasVectorCenter.canvas.height /2,
        size: 20,
        line_height:15,
        font_family:"Arial",
        font_size:20,
        font_style:"normal",
        font_weight:"normal",
        color:"#000000",
        text:"",
        rotate:0,
        text_align: 'align-center',
    };

    componentDidMount() {
        const layerText = this.props.layers.filter((item=>item.layer_type===LAYER_TYPE_TEXT)) || [];
        this.defaultText.name = LAYER_TYPE_TEXT + ' ' + (layerText.length + 1);
        if( this.props.type === LAYER_TYPE_TEXT )
            this.setState(this.defaultText);
    };

    sanityCheck() {
        let name = this.state.name ? this.state.name : (this.props.config ? this.props.config.layer_name : "Nouveau Calque");

        if (name == null || name === "") 
            return false;
        
        if (this.props.type === LAYER_TYPE_TEXT) {
            let text = this.state.text ? this.state.text : ((this.props.config && this.props.config.properties) ? this.props.config.properties.text : "");
            if (text === "") 
                return false;
                
        }
        return true;
    };

    update(r) {
        let current = this.state;
        for (let key in r)
          current[key] = r[key];
        this.setState(current);
    };

    handleResult(r) {
        const { canvasVectorCenter} = this.props;
        if( r && !this.props.config ){
            const layerText = this.props.layers.filter((item=>item.layer_type === LAYER_TYPE_TEXT));

            if(layerText.length > 0)
                r.name = LAYER_TYPE_TEXT + " " + (layerText.length + 1);

            const canvas = document.createElement("CANVAS");
            const context = canvas.getContext("2d");
            let testWidth = 0, textLarge = 0 ,testHeight = 0;

            // text
            if( r.hasOwnProperty('font_size') ){
                let lines = r.text.split(/\r\n|\r|\n/);
                lines = _.compact(lines);
                lines = lines.map((item, index)=>{
                    item = item.trim();
                    if( index && index < lines.length )
                        return ['',item];
                    return item;
                })
                lines = _.flatten(lines);
                lines.forEach( (text) => {
                    context.font = r.font_style+' ' + r.font_weight+' ' + (r.font_size/0.2645833333)/2*0.72  + 'px ' + r.font_family;
                    const metrics = context.measureText(text? text +'gb': '');
                    testHeight += Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);
                    var metricWidth = context.measureText(text);
                    if (metricWidth.width > testWidth)
                        testWidth = metricWidth.width;
                    if( text === '' )
                        testHeight += (r.font_size -15) < 0 ? 0 : r.font_size -15
                })
                let w = testWidth,h = testHeight;
                if (r.rotate !== 0) {
                    let angleInRadians = r.rotate * Math.PI / 180;
                    w = (Math.cos(angleInRadians) * testWidth + Math.sin(angleInRadians) * testHeight);
                    h = (Math.cos(Math.PI/2 - angleInRadians) * testWidth + Math.sin(Math.PI/2 - angleInRadians) * testHeight);
                    if ((angleInRadians <= Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians >= 3*Math.PI/2)) { // (90 >= Rotate >= 0) OR (-90 < Rotate < 0)
                        w = (Math.cos(angleInRadians) * testWidth + Math.sin(angleInRadians) * testHeight);
                        h = (Math.cos(Math.PI/2 - angleInRadians) * testWidth + Math.sin(Math.PI/2 - angleInRadians) * testHeight);
                    } else if ((angleInRadians <= Math.PI  && angleInRadians >= 0) || (0 - angleInRadians >= Math.PI)) { // (180 >= Rotate > 90) OR (-180 <= Rotate < -90)
                        w = (Math.cos(angleInRadians + Math.PI) * testWidth - Math.sin(angleInRadians + Math.PI) * testHeight);
                        h = (Math.cos(Math.PI/2 - angleInRadians) * testWidth - Math.sin(Math.PI/2 - angleInRadians) * testHeight);
                    } else if ((angleInRadians <= 3*Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians >= Math.PI/2)) { // (270 >= Rotate > 180) OR (-270 <= Rotate < -180)
                        w = (Math.cos(angleInRadians + Math.PI) * testWidth + Math.sin(angleInRadians + Math.PI) * testHeight);
                        h = (Math.cos(3*Math.PI/2 - angleInRadians) * testWidth + Math.sin(3*Math.PI/2 - angleInRadians) * testHeight);
                    } else if ((angleInRadians > 3*Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians < Math.PI/2)) { // 306 >= Rotate > 270 OR (-360 <= Rotate < -270) 360 and -360 are max and min which LIMITED FROM INPUT
                        w = (Math.cos(-angleInRadians + 2*Math.PI) * testWidth + Math.sin(-angleInRadians + 2*Math.PI) * testHeight);
                        h = (Math.cos(3*Math.PI/2 - angleInRadians) * testWidth - Math.sin(3*Math.PI/2 - angleInRadians) * testHeight);
                    }
                }

                switch (r.text_align) {
                    case "align-left":
                        r = {...r, x: w/2 + 5.5};
                        break;
                    case "align-right":
                        r = {...r,x: (canvasVectorCenter.canvas.width - w/2 - 0.5)};
                        break;
                    case "align-top":
                        textLarge = 5;
                        r = {...r,y: h/2 + textLarge}
                        break;
                    case "align-center":
                        r = {...r,x:canvasVectorCenter.canvas.width /2, y:canvasVectorCenter.canvas.height /2 + 2};
                        break;
                    case "align-bottom":
                        textLarge = 0;
                        r = {...r,y: canvasVectorCenter.canvas.height - h/2 - textLarge};
                        break;
                    default:
                        break;
                }
            }
            if( r.hasOwnProperty('resource_id') ) {
                let w = r.width, h = r.height;
                if (r.rotate !== 0) {
                    let angleInRadians = r.rotate * Math.PI / 180;
                    w = (Math.cos(angleInRadians) * r.width + Math.sin(angleInRadians) * r.height);
                    h = (Math.cos(Math.PI/2 - angleInRadians) * r.width + Math.sin(Math.PI/2 - angleInRadians) * r.height);
                    if ((angleInRadians <= Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians >= 3*Math.PI/2)) { // (90 >= Rotate >= 0) OR (-90 < Rotate < 0)
                        w = (Math.cos(angleInRadians) * r.width + Math.sin(angleInRadians) * r.height);
                        h = (Math.cos(Math.PI/2 - angleInRadians) * r.width + Math.sin(Math.PI/2 - angleInRadians) * r.height);
                    } else if ((angleInRadians <= Math.PI  && angleInRadians >= 0) || (0 - angleInRadians >= Math.PI)) { // (180 >= Rotate > 90) OR (-180 <= Rotate < -90)
                        w = (Math.cos(angleInRadians + Math.PI) * r.width - Math.sin(angleInRadians + Math.PI) * r.height);
                        h = (Math.cos(Math.PI/2 - angleInRadians) * r.width - Math.sin(Math.PI/2 - angleInRadians) * r.height);
                    } else if ((angleInRadians <= 3*Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians >= Math.PI/2)) { // (270 >= Rotate > 180) OR (-270 <= Rotate < -180)
                        w = (Math.cos(angleInRadians + Math.PI) * r.width + Math.sin(angleInRadians + Math.PI) * r.height);
                        h = (Math.cos(3*Math.PI/2 - angleInRadians) * r.width + Math.sin(3*Math.PI/2 - angleInRadians) * r.height);
                    } else if ((angleInRadians > 3*Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians < Math.PI/2)) { // 306 >= Rotate > 270 OR (-360 <= Rotate < -270) 360 and -360 are max and min which LIMITED FROM INPUT
                        w = (Math.cos(-angleInRadians + 2*Math.PI) * r.width + Math.sin(-angleInRadians + 2*Math.PI) * r.height);
                        h = (Math.cos(3*Math.PI/2 - angleInRadians) * r.width - Math.sin(3*Math.PI/2 - angleInRadians) * r.height);
                    }
                }
                switch (r.text_align) {
                    case "align-left":
                        r = {...r,x: Math.round(w / 2) + 5};
                        break;
                    case "align-top":
                        textLarge = 5;
                        r = {...r,y: h/2 + textLarge};
                        break;
                    case "align-right":
                        r = {...r, x: canvasVectorCenter.canvas.width - w / 2};
                        break;
                    case "align-center":
                        r = {...r,x:canvasVectorCenter.canvas.width /2, y:canvasVectorCenter.canvas.height /2};
                        break;
                    case "align-bottom":
                        r = {...r,y: canvasVectorCenter.canvas.height - h / 2};
                        break;
                    default:
                        break;
                }
            }
            
            r = {...r, ...{x:r.x, y:r.y}};
        }

        if( r && r.hasOwnProperty('autoSpinner'))
            delete r.autoSpinner;

        if( r && r.hasOwnProperty('selectedFile'))
            delete r.selectedFile;
        
        if( r && r.hasOwnProperty('controlledPosition'))
            delete r.controlledPosition;
        
        this.props.onResult(r);
        this.setIsOpen();
        this.setState({text:''});
    };

    Align = (AlignType = 'align-left')=>{
        const {config, canvasVectorCenter} = this.props;
        if( !this.props.config )
            this.setState({text_align: AlignType});
        
        this.setState({text_align: AlignType});
        const {properties = {x:0,y: 0}, layer_type=''} = config || {};
        const canvas = document.createElement("CANVAS");
        const context = canvas.getContext("2d");
        let testWidth = 0, textLarge = 0, testHeight = 0;
        if( layer_type === LAYER_TYPE_TEXT ){
            let lines = properties.text.split(/\r\n|\r|\n/);
            lines = _.compact(lines);
            lines = lines.map((item, index)=>{
                if( index && index < lines.length )
                    return ['',item];
                return item;
            })
            lines = _.flatten(lines);
            lines.forEach((text) => {
                text = text.trim();
                context.font = properties.font_style+' ' + properties.font_weight+' ' + (properties.font_size/0.2645833333)/2*0.72  + 'px ' + properties.font_family;
                const metrics = context.measureText(text? text +'gb': '');
                testHeight += Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);
                var metricWidth = context.measureText(text);
                if (metricWidth.width > testWidth)
                    testWidth = metricWidth.width;
                if(text === '')
                    testHeight += (properties.font_size -15) < 0 ? 0 : properties.font_size -15;
            })
            let w = testWidth,h = testHeight;
            if (properties.rotate !== 0) {
                let angleInRadians = properties.rotate * Math.PI / 180;
                w = (Math.cos(angleInRadians) * testWidth + Math.sin(angleInRadians) * testHeight);
                h = (Math.cos(Math.PI/2 - angleInRadians) * testWidth + Math.sin(Math.PI/2 - angleInRadians) * testHeight);
                if ((angleInRadians <= Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians >= 3*Math.PI/2)) { // (90 >= Rotate >= 0) OR (-90 < Rotate < 0)
                    w = (Math.cos(angleInRadians) * testWidth + Math.sin(angleInRadians) * testHeight);
                    h = (Math.cos(Math.PI/2 - angleInRadians) * testWidth + Math.sin(Math.PI/2 - angleInRadians) * testHeight);
                } else if ((angleInRadians <= Math.PI  && angleInRadians >= 0) || (0 - angleInRadians >= Math.PI)) { // (180 >= Rotate > 90) OR (-180 <= Rotate < -90)
                    w = (Math.cos(angleInRadians + Math.PI) * testWidth - Math.sin(angleInRadians + Math.PI) * testHeight);
                    h = (Math.cos(Math.PI/2 - angleInRadians) * testWidth - Math.sin(Math.PI/2 - angleInRadians) * testHeight);
                } else if ((angleInRadians <= 3*Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians >= Math.PI/2)) { // (270 >= Rotate > 180) OR (-270 <= Rotate < -180)
                    w = (Math.cos(angleInRadians + Math.PI) * testWidth + Math.sin(angleInRadians + Math.PI) * testHeight);
                    h = (Math.cos(3*Math.PI/2 - angleInRadians) * testWidth + Math.sin(3*Math.PI/2 - angleInRadians) * testHeight);
                } else if ((angleInRadians > 3*Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians < Math.PI/2)) { // 306 >= Rotate > 270 OR (-360 <= Rotate < -270) 360 and -360 are max and min which LIMITED FROM INPUT
                    w = (Math.cos(-angleInRadians + 2*Math.PI) * testWidth + Math.sin(-angleInRadians + 2*Math.PI) * testHeight);
                    h = (Math.cos(3*Math.PI/2 - angleInRadians) * testWidth - Math.sin(3*Math.PI/2 - angleInRadians) * testHeight);
                }
            }

            switch (AlignType) {
                case "align-left":
                    this.props.onResult({text_align: AlignType, x: w/2 + 5.5});
                    break;
                case "align-right":
                    this.props.onResult({text_align: AlignType, x: (canvasVectorCenter.canvas.width - w/2 -0.5) });
                    break;
                case "align-top":
                    textLarge = 5;
                    this.props.onResult({text_align: AlignType, y: h/2 + textLarge});
                    break;
                case "align-center":
                    this.props.onResult({text_align: AlignType, x:canvasVectorCenter.canvas.width /2, y:canvasVectorCenter.canvas.height /2 + 2});
                    break;
                case "align-bottom":
                    textLarge = 0;
                    this.props.onResult({text_align: AlignType, y: canvasVectorCenter.canvas.height - h/2 - textLarge});
                    break;
                default:
                    break;
            }
        }
    }

    handleClickOutside = () => {
        let {isOpen = false} = this.state;
        if( isOpen)
            this.setIsOpen();
    }

    setIsOpen = ()=>{
        let {isOpen = false} = this.state;
        this.setState({isOpen: !isOpen});
    }

    render() {
        const { isOpen } = this.state , {config = {}, size={}} = this.props, popupText = document.getElementsByClassName('inverted.menu');
        let clientWidthPopup = 0, clientHeightPopup = 0;
        if(popupText[0]){
            clientWidthPopup = popupText[0].clientWidth;
            clientHeightPopup = popupText[0].clientHeight;
        }
        const xBox = size.l*2+ 2*size.w , yBox = size.h*3;
        let {properties = {x:0,y: 0}, layer_type} = config || {}, x = properties.x, y = properties.y, overArea = false;
        if( x +clientHeightPopup >= xBox ){
            x = x - clientWidthPopup;
            y = y - 2.5*this.defaultBoundingRect.left;
            overArea = true;
        }
        if( y + clientWidthPopup >= yBox || y < clientWidthPopup ){
            y = y - this.defaultBoundingRect.top;
            overArea = true;
        }
        
        if( layer_type === LAYER_TYPE_TEXT ){
            x = properties.x + 50;
            y = properties.y - 50;
        }

        if(!overArea){
            x = x - 1.5 * this.defaultBoundingRect.left;
            y = y - this.defaultBoundingRect.top;
        }
        if(!config){
            x = 0; y = 0;
        }
        return (
            <>
                <Dropdown disabled={this.props.is3D} open={isOpen} item floating icon={<IconMenu src={this.props.iconLayer} onClick={()=>{this.setIsOpen(); this.props.onClick()}} title={this.props.titleMenu}/>}>
                    <Dropdown.Menu  className={'dropdown-menu'} style={{width:'350px'}}>
                        <Dropdown.Item  onClick={(e) => e.stopPropagation()}>
                            <div className={"row"}>
                                {this.props.type === LAYER_TYPE_TEXT && <TextContent key={isOpen}
                                                                            name={this.defaultText.layer_name}
                                                                            properties={this.defaultText}
                                                                            AlignPosition={this.Align}
                                                                            text_align={this.state.text_align}
                                                                            layers={this.props.layers}
                                                                            onResult={(r)=>{this.update(r)}}/>
                                }
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item className={'action-box'} onClick={(e) => e.stopPropagation()} >
                            <div className={"row"} style={{textAlign:'center'}}>
                                <Button compact style={{marginRight:5}} onClick={() => this.handleResult(null)}>Annuler</Button>
                                <Button compact style={{marginLeft:5}} disabled={!this.sanityCheck()} onClick={() => this.handleResult(this.state)} color='blue'>Enregistrer</Button>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </>
        )
    }
}

TextBox.propTypes = {
    handleSaveDimension: PropTypes.func.isRequired,
    edit: PropTypes.bool
}

TextBox.defaultProps = {
    handleSaveDimension: () => {},
    edit: false
}

export default connect(null, {
    get_model: actions.template.get,
    update_project: actions.workspace.update,
})(onClickOutside(TextBox))
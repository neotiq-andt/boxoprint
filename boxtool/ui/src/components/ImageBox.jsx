import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'
import actions from "../actions/app"
import IconMenu from "./IconMenu"
import {Button, Form,  Icon, Grid, Image, Segment, Dropdown } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import _ from "lodash"
import CustomInput from './CustomInput';
import {LAYER_TYPE_IMAGE} from '../constants/index'

class ImageContent extends Component {

    state = { dataURL: null};
    height = 0;
    width = 0;
    loading = true;

    componentDidMount() {
        if (this.props.properties) {
            let current = this.props.properties;
            if (this.props.name)
                current.name = this.props.name;
            this.height = this.props.properties.height;
            this.width = this.props.properties.width;
            this.setState(current);
        }
    };

    update(u) {
        if (this.props.onResult)
            this.props.onResult(u);
        
        this.setState(u);
    };

    handleImage = (file) => {
        if (file && file.length) 
            switch (file[0].type) {
                case 'image/jpeg':
                case 'image/png':
                case 'image/gif':
                case 'image/bmp':
                case 'image/tiff':
                    var reader  = new FileReader();
                    reader.addEventListener("load", (e) => {
                        this.update({dataURL:reader.result});
                    }, false);
                    reader.readAsDataURL(file[0]);
                    break;

                default:
            }
    };

    regEventHeight = (handleEvent) => {
        this.handleEventHeight = handleEvent;
    };

    regEventWidth = (handleEvent) => {
        this.handleEventWidth = handleEvent;
    };

    regEventPPP = (handleEvent) => {
        this.handleEventPPP = handleEvent;
    };

    handleLoaded = (e) => {
        if (this.loading === true && this.props.properties.width === 0 && this.props.properties.height === 0) {
            if (e.currentTarget.naturalWidth && this.handleEventWidth) {
                this.width = e.currentTarget.naturalWidth * 25.4 / this.props.properties.original_ppp;
                this.handleEventWidth(this.valueDisplay(this.width));
            }
            if (e.currentTarget.naturalHeight && this.handleEventHeight) {
                this.height = e.currentTarget.naturalHeight * 25.4 / this.props.properties.original_ppp;
                this.handleEventHeight(this.valueDisplay(this.height));
            }
            this.update({width:Number.parseFloat(this.width || 0).toFixed(2),height:Number.parseFloat(this.height || 0).toFixed(2)});
        }
        this.loading = false;
    };

    handleHeight = (height) => {
        let newWidth = height * this.width / this.height;
        newWidth = Number.parseFloat(newWidth).toFixed(2);
        height = Number.parseFloat(height).toFixed(2);
        this.update({height:height,width:newWidth});
        this.handleEventWidth(newWidth);
    };

    handleWidth = (width) => {
        let newHeight = width * this.height / this.width;
        newHeight = Number.parseFloat(newHeight).toFixed(2);
        width = Number.parseFloat(width).toFixed(2);
        this.update({width:width,height:newHeight});
        this.handleEventHeight(newHeight);
    };

    styleDropZone = () => {
        if (this.state.dataURL === null || this.state.dataURL === "")
            return ({cursor:'grab',height:40});
        return ({cursor:'grab'});
    };

    loadImage = () => {
        if (this.state.dataURL === null || this.state.dataURL === "")
            return null;
        return (
            <Segment disabled={this.state.dataURL == null} basic textAlign='center'>
                <Image onLoad={this.handleLoaded} verticalAlign='middle' centered fluid src={this.state.dataURL}/>
            </Segment>
        );
    };

    computeRatio = (r) => {
        if (r === -1)
            return parseInt(100 / (this.props.properties.ppp / this.props.properties.original_ppp));

        let ppp = parseInt(this.props.properties.original_ppp * (100 / r));
        if (ppp === 0)
            ppp = 1;

        this.handleEventPPP(ppp);
        this.update({ppp:ppp});
    };

    valueDisplay=(currentValue)=>{
        if(currentValue > 10)
            currentValue = currentValue / 10;
        return  Number.parseFloat(currentValue).toFixed(2);
    };

    render() {
        const {properties} = this.props;
        //comparre name
        const text_align = properties.x ? this.props.text_align : this.props.properties.text_align || "";
        return (
            <Form size="mini">
            <Grid className={'grid-image-box'}>
                <Grid.Row  className={'row-image-box1'}>
                    <Grid.Column width={10}>
                        <Dropzone onDrop={this.handleImage}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <Segment textAlign='center' size='small' inverted color='green' tertiary style={this.styleDropZone()}>
                                            Télécharger une image.
                                        </Segment>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                        {this.loadImage()}
                        
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

                        <Button icon active={ text_align ==='align-top' }  onClick={()=>this.props.AlignPosition('align-top')}  title={'Align top'}>
                            <Icon name='angle double up' />
                        </Button>

                        <Button icon active={ text_align ==='align-bottom' } onClick={()=>this.props.AlignPosition('align-bottom')} title={'Align bottom'}>
                            <Icon name='angle double down' />
                        </Button>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Form.Field disabled={this.state.dataURL === null || this.state.dataURL ===''} control={CustomInput} label='Largeur (mm)' type='float-abs-image' regEvent={this.regEventWidth} value={this.valueDisplay(this.props.properties.width || 0)} onResult={(r)=>{this.handleWidth(r)}}/>
                        <Form.Field disabled={this.state.dataURL === null || this.state.dataURL ===''} control={CustomInput} label='Hauteur (mm)' type='float-abs-image' regEvent={this.regEventHeight} value={this.valueDisplay(this.props.properties.height || 0)} onResult={(r)=>{this.handleHeight(r)}}/>
                        <Form.Field disabled={this.state.dataURL === null || this.state.dataURL ===''} control={CustomInput} label='Rotation (°)' type='angle' value={this.props.properties.rotate} onResult={(r)=>{this.update({rotate:r})}}/>
                        <Form.Field disabled={this.state.dataURL === null || this.state.dataURL ===''} control={CustomInput} label='Définition (PPP)' type='integer-abs-nonull' value={this.props.properties.original_ppp} onResult={(r)=>{this.update({original_ppp:r})}}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            </Form>
        );
    };
};

class ImageBox extends Component {
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

    dimensionMin = 50;

    defaultBoundingRect = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        text_align: 'align-center',
    };

    defaultImage = {
        name: LAYER_TYPE_IMAGE,
        x: this.props.canvasVectorCenter.canvas.width /2,
        y: this.props.canvasVectorCenter.canvas.height /2,
        width:0,
        height:0,
        ppp:30,
        original_ppp:30,
        rotate:0,
        resource_id:0,
        dataURL:"",
        text_align: 'align-center',
    };

    componentDidMount() {
        const layerPicture = this.props.layers.filter((item=>item.layer_type === LAYER_TYPE_IMAGE)) || [];
        this.defaultImage.name = LAYER_TYPE_IMAGE + ' ' +(layerPicture.length+1);
        if( this.props.type === LAYER_TYPE_IMAGE )
            this.setState(this.defaultImage);
    };

    sanityCheck() {
        let name = this.state.name ? this.state.name : (this.props.config ? this.props.config.layer_name : "Nouveau Calque");
        if (name == null || name === "" ) 
            return false;
        
        if (this.props.type === LAYER_TYPE_IMAGE) {
            let url = (this.state.dataURL && this.state.dataURL !== "") ? this.state.dataURL : (this.props.config ? this.props.config.properties.dataURL : "");
            if (!url || url === "") 
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
        if( r && r.hasOwnProperty('autoSpinner') )
            delete r.autoSpinner;

        if( r && r.hasOwnProperty('selectedFile') )
            delete r.selectedFile;

        if( r && r.hasOwnProperty('controlledPosition') )
            delete r.controlledPosition;

        if (r !== null && typeof r.name === 'undefined')
        {
            const layerPicture = this.props.layers.filter((item=>item.layer_type === LAYER_TYPE_IMAGE)) || [];
            if(layerPicture.length > 0)
                r.name = LAYER_TYPE_IMAGE + ' ' + (layerPicture.length + 1);
        }
        
        this.props.onResult(r);
        this.setIsOpen();
        this.setState({dataURL : ''});
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
        if( layer_type === 'text' ){
            let lines = properties.text.split(/\r\n|\r|\n/);
            lines = _.compact(lines);
            lines = lines.map((item, index)=>{
                if( index && index < lines.length)
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

        if( layer_type === LAYER_TYPE_IMAGE ){
            let w = properties.width, h = properties.height;
            if (properties.rotate !== 0) {
                let angleInRadians = properties.rotate * Math.PI / 180;
                w = (Math.cos(angleInRadians) * properties.width + Math.sin(angleInRadians) * properties.height);
                h = (Math.cos(Math.PI/2 - angleInRadians) * properties.width + Math.sin(Math.PI/2 - angleInRadians) * properties.height);
                if ((angleInRadians <= Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians >= 3*Math.PI/2)) { // (90 >= Rotate >= 0) OR (-90 < Rotate < 0)
                    w = (Math.cos(angleInRadians) * properties.width + Math.sin(angleInRadians) * properties.height);
                    h = (Math.cos(Math.PI/2 - angleInRadians) * properties.width + Math.sin(Math.PI/2 - angleInRadians) * properties.height);
                } else if ((angleInRadians <= Math.PI  && angleInRadians >= 0) || (0 - angleInRadians >= Math.PI)) { // (180 >= Rotate > 90) OR (-180 <= Rotate < -90)
                    w = (Math.cos(angleInRadians + Math.PI) * properties.width - Math.sin(angleInRadians + Math.PI) * properties.height);
                    h = (Math.cos(Math.PI/2 - angleInRadians) * properties.width - Math.sin(Math.PI/2 - angleInRadians) * properties.height);
                } else if ((angleInRadians <= 3*Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians >= Math.PI/2)) { // (270 >= Rotate > 180) OR (-270 <= Rotate < -180)
                    w = (Math.cos(angleInRadians + Math.PI) * properties.width + Math.sin(angleInRadians + Math.PI) * properties.height);
                    h = (Math.cos(3*Math.PI/2 - angleInRadians) * properties.width + Math.sin(3*Math.PI/2 - angleInRadians) * properties.height);
                } else if ((angleInRadians > 3*Math.PI/2 && angleInRadians >= 0) || (0 - angleInRadians < Math.PI/2)) { // 306 >= Rotate > 270 OR (-360 <= Rotate < -270) 360 and -360 are max and min which LIMITED FROM INPUT
                    w = (Math.cos(-angleInRadians + 2*Math.PI) * properties.width + Math.sin(-angleInRadians + 2*Math.PI) * properties.height);
                    h = (Math.cos(3*Math.PI/2 - angleInRadians) * properties.width - Math.sin(3*Math.PI/2 - angleInRadians) * properties.height);
                }
            }
            switch (AlignType) {
                case "align-left":
                    this.props.onResult({text_align: AlignType, x: w/2 + 5});
                    break;
                case "align-top":
                    this.props.onResult({text_align: AlignType, y: h/2 + 5});
                    break;
                case "align-right":
                    this.props.onResult({text_align: AlignType, x: canvasVectorCenter.canvas.width-w/2});
                    break;
                case "align-center":
                    this.props.onResult({text_align: AlignType, x:canvasVectorCenter.canvas.width /2, y:canvasVectorCenter.canvas.height /2 + 2});
                    break;
                case "align-bottom":
                    this.props.onResult({text_align: AlignType, y: canvasVectorCenter.canvas.height-h/2});
                    break;
                default:
                    break;
            }
        }
    };

    handleChangeDimension = (name, value) => {
        if( (value && value < this.dimensionMin) || isNaN(value))
            value = this.dimensionMin;
        this.setState({[name]: value ,disable_button: false});
    };

    handleClickOutside = () => {
        let {isOpen = false} = this.state;
        if(isOpen)
            this.setIsOpen();
    };

    setIsOpen = ()=>{
        let {isOpen = false} = this.state;
        this.setState({isOpen: !isOpen});
    };

    render() {
        const { isOpen } = this.state, {config = {}, size={}} = this.props, xBox = size.l*2+ 2*size.w, yBox = size.h*3;
        const popupText = document.getElementsByClassName('inverted.menu');
        let clientWidthPopup = 0, clientHeightPopup = 0, {properties = {x:0,y: 0}, layer_type} = config || {}, x = properties.x , y = properties.y, overArea = false;
        if( popupText[0] ){
            clientWidthPopup = popupText[0].clientWidth;
            clientHeightPopup = popupText[0].clientHeight;
        }
        
        if( x + clientHeightPopup >= xBox ){
            x = x - clientWidthPopup;
            y = y - 2.5*this.defaultBoundingRect.left;
            overArea = true;
        }

        if( y + clientWidthPopup >= yBox || y < clientWidthPopup ){
            y = y - this.defaultBoundingRect.top;
            overArea = true;
        }

        if( layer_type === LAYER_TYPE_IMAGE ){
             x = properties.x - clientHeightPopup - this.defaultBoundingRect.left * 1.2;
             y = properties.y - 50;
        }

        if(!overArea){
            x = x-1.5*this.defaultBoundingRect.left;
            y = y-this.defaultBoundingRect.top;
        }

        if(!config){
            x = 0; y = 0;
        }

        return (
            <>
                <Dropdown disabled={this.props.is3D} open={isOpen} item floating icon={<IconMenu src={this.props.iconLayer} onClick={()=>{this.setIsOpen(); this.props.onClick()}} title={this.props.titleMenu}/>}>
                    <Dropdown.Menu  className={'dropdown-menu'} style={{width:'300px', overflowY: 'scroll', overflowX: 'hidden', maxHeight: '600px'}}>
                        <Dropdown.Item  onClick={(e) => e.stopPropagation()}>
                            <div className={"row"}>
                                {this.props.type === LAYER_TYPE_IMAGE && <ImageContent key={isOpen}
                                                                                name={this.defaultImage.name}
                                                                                properties={this.props.config ? this.props.config.properties : this.defaultImage}
                                                                                AlignPosition={this.Align}
                                                                                layers={this.props.layers}
                                                                                text_align={this.state.text_align}
                                                                                onResult={(r)=>{this.update(r)}}/>
                                }
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item className={'action-box'}  onClick={(e) => e.stopPropagation()} >
                            <div className={"row"} style={{textAlign:'center'}}>
                                <Button compact style={{marginRight:5}} onClick={() => this.handleResult(null)}>Annuler</Button>
                                <Button compact style={{marginLeft:5}} key={this.state.dataURL} disabled={!this.sanityCheck()} onClick={() => this.handleResult(this.state)} color='blue'>Enregistrer</Button>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    };
}

ImageBox.propTypes = {
    handleSaveDimension: PropTypes.func.isRequired,
    edit: PropTypes.bool
};

ImageBox.defaultProps = {
    handleSaveDimension: () => {},
    edit: false
};

export default connect(null, {
    get_model: actions.template.get,
    update_project: actions.workspace.update,
})(onClickOutside(ImageBox));

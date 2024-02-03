import React, { Component } from 'react'
import { Button, Modal, Form, Input, Icon, Menu, TextArea, Select, Grid, Image, Segment, Checkbox } from 'semantic-ui-react'
import InputColor from 'react-input-color'
import Draggable from 'react-draggable'
import Dropzone from 'react-dropzone'
import _ from "lodash"
import { Fonts, FontStyle, FontWeight, LAYER_TYPE_IMAGE, LAYER_TYPE_TEXT, LAYER_TYPE_SHAPE, SHAPE_TYPE } from '../constants/index'

class CustomInput extends Component {
    
    state = {value: ''};

    constructor(props) {
        super(props);
        if (this.props.type === "select")
            this.state = {value:this.props.value.current};
        else
            this.state = {value:this.props.value};
        if (this.props.regEvent)
            this.props.regEvent(this.handleExternalEvent);
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
                    if (value === 0 && this.props.type === 'integer-abs-nonull')
                        value = 1;
                    this.props.onResult(value);
                    value = '' + value;
                } else {
                    value = 0;
                    if (this.props.type === 'integer-abs-nonull')
                        value = 1;
                    this.props.onResult(value);
                    value = '' + value;
                }
            break;
            case 'integer-abs-font_size':
                value = e.target.value.replace(/[^-?\d]/, '');
                if (isNaN(parseInt(value)) === false) {
                    value = parseInt(value);
                    if (value > 50)
                        value = 50;
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
                console.log('e.target.value', e.target.value);
                value = e.target.value.replace(/[^-?\d]/, '');
                this.props.onResult(value);
                if (isNaN(parseInt(value)) === false) {
                    // value = parseInt(value);
                    // if (value > 150)
                    //     value = 150;
                    // if (value <= 20 )
                    //     value = value
                    this.props.onResult(value);
                    value = '' + value;
                } else {
                    // this.props.onResult(20);
                    // value = 20;
                }
            break;
            case 'float-abs-shape':
                console.log('e.target.value', e.target.value);
                value = e.target.value.replace(/[^-?\d]/, '');
                this.props.onResult(value);
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
                    if (value > 360 && this.props.type === 'angle')
                        value = 360;
                    if (value < -360 && this.props.type === 'angle')
                        value = -360;
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
                    if (value > 50)
                        value = 50;
                    if (value <= 20 )
                        value = 20;
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
                    // value = parseInt(value);
                    // if (value > 150)
                    //     value = 150;
                    if (value <= 20 )
                        value = 20;
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
            case "color":
                return (<InputColor initialHexColor={this.props.value} onChange={this.onChange}/>);
            case "select":
                return (<Select placeholder="Selection" options={this.props.value.options} value={this.state.value} onChange={this.onChange}/>);
            case "textarea":
                return (
                    <div style={{width:'100%',overflowY:'auto',height:this.props.height}}>
                        <TextArea style={this.props.style} value={this.state.value} onChange={this.onChange} rows={1}/>
                    </div>
                );
            default:
                return (<Input type="text" value={this.state.value} onChange={this.onChange} onBlur={this.onBlur}/>);
        }
    };
}

class TextContent extends Component {

    constructor(props) {
        super(props);
        const {properties} = props;
        this.state = {font_weight: properties.font_weight, font_style: properties.font_style};
    }

    fonts = Fonts.map((current, index, arr) => {
        return {
            key: current,
            text: current,
            value: current,
        };  
    });

    fontStyle = FontStyle.map((current, index, arr) => {
        return {
            key: current,
            text: current,
            value: current,
        };
    });

    fontWeight = FontWeight.map((current, index, arr) => {
        return {
            key: current,
            text: current,
            value: current,
        };
    });

    componentDidMount() {
        if (this.props.properties) {
            let current = this.props.properties;
            if (this.props.name)
                current.name = this.props.name;
            this.setState(current);
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if( !prevProps.properties ){
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
        const {properties} = this.props;
        const {font_style, font_weight} = this.state;
        const text_align = properties.x ? this.props.text_align : this.props.properties.text_align || "";
        return (
            <Form size="mini">
                <Grid className={'grid-modal-text'}>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Form.Field control={CustomInput} label='Rotation (°)' type='angle' value={this.props.properties.rotate} onResult={(r)=>{this.update({rotate:r})}}/>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            {<Form.Field control={CustomInput} label='Taille (mm)' type='integer-abs-font_size' value={this.props.properties.font_size} onResult={(r)=>{this.update({font_size:r})}}/>}
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Form.Field control={CustomInput} label='Style' type='select' value={{current:this.props.properties.font_family,options:this.fonts}} onResult={(r)=>{this.update({font_family:r})}}/>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Button.Group>
                                <Button key={font_weight ==='bold'} icon active={ font_weight ==='bold' } onClick={this.onChangeFontWeight.bind(this)} title={'Bold'}>
                                    <Icon name='bold' />
                                </Button>
                                <Button key={font_style} icon active={ font_style ==='italic' } onClick={this.onChangeFontStyle.bind(this)} title={'Italic'}>
                                    <Icon name='italic' />
                                </Button>
                            </Button.Group>
                            <Form.Field className={'ui buttons field-button'} control={CustomInput} label='' type='color' value={this.props.properties.color} onResult={(r)=>{this.update({color:r})}}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={9}>
                            <Form.Field control={CustomInput} style={{color:this.state.color,fontFamily:this.state.font_family,fontSize:20,fontStyle:this.state.font_style,fontWeight:this.state.font_weight}} label='Texte' type='textarea' value={this.props.properties.text} onResult={(r)=>{this.update({text:r})}}/>
                        </Grid.Column>
                        <Grid.Column width={7}>
                        <label style={{fontSize: '11px', display: 'block', marginTop: '4px', fontWeight: 'bold'}}>Position du calque</label>
                        <Button.Group>
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
                        </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                    {/*<Grid.Column width={0}>*/}
                        {/*<Form.Field control={CustomInput} label='Couleur du texte' type='color' value={this.props.properties.color} onResult={(r)=>{this.update({color:r})}}/>*/}
                        {/*<Form.Field control={CustomInput} label='Style de la Fonte' type='select' value={{current:this.props.properties.font_style,options:this.fontStyle}} onResult={(r)=>{this.update({font_style:r})}}/>*/}
                        {/*<Form.Field control={CustomInput} label='Poids de la Fonte' type='select' value={{current:this.props.properties.font_weight,options:this.fontWeight}} onResult={(r)=>{this.update({font_weight:r})}}/>*/}
                    {/*</Grid.Column>*/}
                </Grid>
            </Form>
        );
    };
};

class ImageContent extends Component {

    state = {
        dataURL: null
    };
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

    regEventHeight = (handleEvent) => { this.handleEventHeight = handleEvent;};

    regEventWidth = (handleEvent) => { this.handleEventWidth = handleEvent;};

    regEventPPP = (handleEvent) => { this.handleEventPPP = handleEvent;};

    handleLoaded = (e) => {
        if (this.loading === true && this.props.properties.width === 0 && this.props.properties.height === 0) {
            if (e.currentTarget.naturalWidth && this.handleEventWidth) {
                this.width = e.currentTarget.naturalWidth * 25.4 / this.props.properties.original_ppp;
                this.handleEventWidth(Number.parseFloat(this.width || 0).toFixed(2));
            }
            if (e.currentTarget.naturalHeight && this.handleEventHeight) {
                this.height = e.currentTarget.naturalHeight * 25.4 / this.props.properties.original_ppp;
                this.handleEventHeight(Number.parseFloat(this.height || 0).toFixed(2));
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
        newHeight = Number.parseFloat(newHeight).toFixed(2)
        width = Number.parseFloat(width).toFixed(2);
        this.update({width:width,height:newHeight});
        this.handleEventHeight(newHeight);
    };

    styleDropZone = () => {
        if (this.state.dataURL === null || this.state.dataURL === "")
            return ({cursor:'grab',height:400});
        return ({cursor:'grab'});
    };

    loadImage = () => {
        if (this.state.dataURL === null || this.state.dataURL === "") {
            return null;
        }
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

    valueDisplay=(currentHeight)=>{
        if(currentHeight > 10)
            currentHeight = currentHeight / 10;
        return  Number.parseFloat(currentHeight).toFixed(2);
    };

    render() {
        const {properties} = this.props;
        //comparre name
        const text_align = properties.x ? this.props.text_align : this.props.properties.text_align || "";
        return (
            <Form size="mini" className={'form-modal-image'}>
                <Grid columns={2} className={"grid-modal-image"}>
                    <Grid.Column width={8}>
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
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Grid.Row>
                            <Grid column={2}>
                                <Grid.Row className={'row-modal-image1'}>
                                    <Grid.Column width={8}>
                                        <Form.Field disabled={this.state.dataURL === null || this.state.dataURL ===''} 
                                                    control={CustomInput} label='Largeur (mm)' type='float-abs-image' 
                                                    regEvent={this.regEventWidth} 
                                                    value={this.valueDisplay(this.props.properties.width || 0)} 
                                                    onResult={(r)=>{this.handleWidth(r)}}/>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Form.Field disabled={this.state.dataURL === null || this.state.dataURL ===''} 
                                                    control={CustomInput} label='Hauteur (mm)' type='float-abs-image'  
                                                    regEvent={this.regEventHeight} 
                                                    value={this.valueDisplay(this.props.properties.height || 0)} 
                                                    onResult={(r)=>{this.handleHeight(r)}}/>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row className={'row-modal-image2'}>
                                    <Grid.Column width={8}>
                                        <Form.Field disabled={this.state.dataURL === null || this.state.dataURL ===''} 
                                                    control={CustomInput} label='Rotation (°)' type='angle' 
                                                    value={this.props.properties.rotate} 
                                                    onResult={(r)=>{this.update({rotate:r})}}/>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Form.Field disabled={this.state.dataURL === null || this.state.dataURL ===''} 
                                                    control={CustomInput} label='Définition (PPP)' type='integer-abs-nonull' 
                                                    value={this.props.properties.original_ppp} 
                                                    onResult={(r)=>{this.update({original_ppp:r})}}/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            {/*<Form.Field control={CustomInput} label='Position X' type='float' value={this.props.properties.x} onResult={(r)=>{this.update({x:r})}}/>*/}
                            {/*<Form.Field control={CustomInput} label='Position Y' type='float' value={this.props.properties.y} onResult={(r)=>{this.update({y:r})}}/>*/}
                        </Grid.Row>
                        <Grid.Row>
                            <label style={{fontSize: '11px', display: 'block', marginTop: '4px', fontWeight: 'bold'}}>Position du calque</label>
                            <Button.Group>
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
                            </Button.Group>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Form>
        );
    };
};

class ShapeContent extends Component {

    state = {
        dataURL: null
    };
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

    regEventHeight = (handleEvent) => { this.handleEventHeight = handleEvent;};

    regEventWidth = (handleEvent) => { this.handleEventWidth = handleEvent;};

    regEventPPP = (handleEvent) => { this.handleEventPPP = handleEvent;};

    handleLoaded = (e) => {
        if (this.loading === true && this.props.properties.width === 0 && this.props.properties.height === 0) {
            if (e.currentTarget.naturalWidth && this.handleEventWidth) {
                this.width = e.currentTarget.naturalWidth * 25.4 / this.props.properties.original_ppp;
                this.handleEventWidth(Number.parseFloat(this.width || 0).toFixed(2));
            }
            if (e.currentTarget.naturalHeight && this.handleEventHeight) {
                this.height = e.currentTarget.naturalHeight * 25.4 / this.props.properties.original_ppp;
                this.handleEventHeight(Number.parseFloat(this.height || 0).toFixed(2));
            }
            this.update({width:Number.parseFloat(this.width || 0).toFixed(2),height:Number.parseFloat(this.height || 0).toFixed(2)});
        }
        this.loading = false;
    };

    handleHeight = (height) => {
        let newWidth = 0;
        if(this.state.shapeType === SHAPE_TYPE.line){
        newWidth = height * 10;
        }else if(this.state.shapeType === SHAPE_TYPE.square){
        newWidth = height
        }else if(this.state.shapeType === SHAPE_TYPE.rectangle){
        newWidth = height * 2.5;
        }
        this.update({ height: height, width: newWidth });
        this.handleEventWidth(newWidth);
    };

    handleWidth = (width) => {
        let newHeight = 0;
        if(this.state.shapeType === SHAPE_TYPE.line){
        newHeight = width / 10;
        }else if(this.state.shapeType === SHAPE_TYPE.square){
        newHeight = width;
        }else if(this.state.shapeType === SHAPE_TYPE.rectangle){
        newHeight = width / 2.5;
        }
        this.update({ width: width, height: newHeight });
        this.handleEventHeight(newHeight);
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

    valueDisplay=(value)=>{
        return value;
        //> 10 ? currentHeight = currentHeight / 10 : currentHeight;
    };

    render() {
        const {properties} = this.props;
        return (
            <Form size="mini" className={'form-modal-shape'}>
                <Grid  className={"grid-modal-shape"}>
                    <Grid.Row className={'row-modal-shape1'}>
                        <Grid.Column width={3}>
                            <Form.Field control={CustomInput} label='Largeur (mm)' type='float-abs-shape' 
                                        regEvent={this.regEventWidth} 
                                        value={this.valueDisplay(this.props.properties.width || 0)} 
                                        onResult={(r)=>{this.handleWidth(r)}}/>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Form.Field control={CustomInput} label='Hauteur (mm)' type='float-abs-shape'  
                                        regEvent={this.regEventHeight} 
                                        value={this.valueDisplay(this.props.properties.height || 0)} 
                                        onResult={(r)=>{this.handleHeight(r)}}/>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Form.Field control={CustomInput} label='Rotation (°)' type='angle' 
                                        value={this.props.properties.rotate} 
                                        onResult={(r)=>{this.update({rotate:r})}}/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Form.Field control={CustomInput} label='Définition (PPP)' type='integer-abs-nonull' 
                                        value={this.props.properties.original_ppp} 
                                        onResult={(r)=>{this.update({original_ppp:r})}}/>
                        </Grid.Column>
                        <Grid.Column width={3} >
                            <Form.Field className={'ui buttons field-button'} control={CustomInput} label='' type='color' value={this.props.properties.color} onResult={(r)=>{this.update({color:r})}}/>
                        </Grid.Column> 
                    </Grid.Row>
                    <Grid.Row className={"shape-content-row-stroke row-modal-shape2"} columns={2}>
                        <Grid.Column width={6}>
                            <Form.Field>
                                <Checkbox type="checkbox" name="check" label="Couleur de contour" checked={this.state.stroke} onChange={(r, data) => { this.update({ stroke: data.checked }); }}/>
                            </Form.Field>
                        </Grid.Column>
                        {this.state.stroke && (<Grid.Column width={6}>
                                                    <Form.Field size="mini" control={CustomInput} label="Taille de contour" type="float-abs-shape" value={this.state.lineWidth || 0}
                                                    onResult={(r) => { this.update({ lineWidth: r}); }}/>
                                                </Grid.Column>)}
                                                                       
                    </Grid.Row>
                </Grid>
            </Form>
        );
    };
};
/*
                    <Form.Field control={CustomInput} label='Densité de pixels (PPP)' type='integer-abs-nonull' regEvent={this.regEventPPP} value={this.props.properties.ppp} onResult={(r)=>{this.update({ppp:r})}}/>
                    <Form.Field control={CustomInput} label='Réduction / Agrandissement (%)' type='integer-abs-nonull' value={this.computeRatio(-1)} onResult={(r)=>{this.computeRatio(r)}}/>
*/
export default class ModalLayer extends Component {
    constructor(props) {
        super(props);
        const {properties} = props.config || {};
        this.state = {  autoSpinner: true, 
                        selectedFile:'',
                        text_align: props.config == null ? "align-center": properties.text_align || "",
                        editLayer: true,};
    }

    defaultMount = {};

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
        text_align: 'align-center'
    };

    defaultImage = {
        name:"Image",
        x: this.props.canvasVectorCenter.canvas.width /2,
        y: this.props.canvasVectorCenter.canvas.height /2,
        width:0,
        height:0,
        ppp:300,
        original_ppp:300,
        rotate:0,
        resource_id:0,
        dataURL:"",
        text_align: 'align-center'
    };

    defaultShape = {
        name: LAYER_TYPE_SHAPE,
        x: this.props.canvasVectorCenter.canvas.width /2,
        y: this.props.canvasVectorCenter.canvas.height /2,
        width:0,
        height:0,
        ppp:30,
        original_ppp:30,
        rotate:0,
        resource_id:0,
        shapeType: '',
        color: '#000000',
        lineWidth: 10,
        stroke: false,
    };

    componentDidMount() {
        if (this.props.config == null) {
            const layerText = this.props.layers.filter((item=>item.layer_type === LAYER_TYPE_TEXT)) || [];
            const layerPicture = this.props.layers.filter((item=>item.layer_type === LAYER_TYPE_IMAGE)) || [];
            const layerShape = this.props.layers.filter((item=>item.layer_type === LAYER_TYPE_SHAPE)) || [];
            this.defaultText.name = LAYER_TYPE_TEXT + ' ' +(layerText.length + 1);
            this.defaultImage.name = LAYER_TYPE_IMAGE + ' ' +(layerPicture.length + 1);
            this.defaultShape.name = LAYER_TYPE_SHAPE + ' ' +(layerShape.length + 1);
            switch (this.props.type) {
                case LAYER_TYPE_TEXT:
                    this.setState(this.defaultText);
                    break;
                case LAYER_TYPE_IMAGE:
                    this.setState(this.defaultImage);
                    break;
                case LAYER_TYPE_SHAPE:
                    //TODO
                    this.setState(this.defaultShape);     
                    break;
                default:
            }
        }else{
            const {properties, layer_type} = this.props.config;
            if( layer_type === LAYER_TYPE_IMAGE )
                this.defaultText.text_align = properties.text_align || "";
            
            if( layer_type === LAYER_TYPE_TEXT )
                this.defaultText.text_align = properties.text_align || "";
            
            //TODO
            if( layer_type === LAYER_TYPE_SHAPE )
                this.defaultText.text_align = properties.text_align || "";
            
            const boundingRectMount = this.props.getBoundingRect();
            this.defaultBoundingRect = boundingRectMount.boundingRect;
            this.defaultMount = boundingRectMount.mount;
        };
    };

    sanityCheck() {
        let name = this.state.name ? this.state.name : (this.props.config ? this.props.config.layer_name : "Nouveau Calque");
        if (name == null || name === "" || this.props.checkLayerName(name) === false) 
            return false;
        if (this.props.type === LAYER_TYPE_TEXT) {
            let text = this.state.text ? this.state.text : ((this.props.config && this.props.config.properties) ? this.props.config.properties.text : "");
            if (text === "") 
                return false;
        } else if (this.props.type === LAYER_TYPE_IMAGE) {
            let url = (this.state.dataURL && this.state.dataURL !== "") ? this.state.dataURL : (this.props.config ? this.props.config.properties.dataURL : "");
            if (!url || url === "") 
                return false;
        }else if (this.props.type === LAYER_TYPE_SHAPE) {
            let shapeType = (this.state.shapeType && this.state.shapeType !== "") ? this.state.shapeType : (this.props.config ? this.props.config.properties.shapeType : "");
            if (!shapeType || shapeType === "") 
                return false};
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
            const canvas = document.createElement("CANVAS");
            const context = canvas.getContext("2d");
            let testWidth = 0, textLarge = 0, testHeight = 0;
            // text
            if( r.hasOwnProperty('font_size') ){
                let lines = r.text.split(/\r\n|\r|\n/);
                lines = _.compact(lines);
                lines = lines.map((item, index)=>{
                    item = item.trim();
                    if( index && index < lines.length )
                        return ['',item];
                    return item;});
                lines = _.flatten(lines);
                lines.forEach( (text) => {
                    context.font = r.font_style+' ' + r.font_weight+' ' + (r.font_size/0.2645833333)/2*0.72  + 'px ' + r.font_family;
                    const metrics = context.measureText(text? text +'gb': '')
                    testHeight += Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent)
                    var metricWidth = context.measureText(text);
                    if (metricWidth.width > testWidth)
                        testWidth = metricWidth.width;
                    if( text === '' )
                        testHeight += (r.font_size -15) < 0 ? 0 : r.font_size -15;
                });
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
                        textLarge = 5
                        r = {...r,y: h/2 + textLarge};
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
            delete r.controlledPosition
        
        this.props.onResult(r);
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
                if( index && index < lines.length)
                    return ['',item];
                return item;});
            lines = _.flatten(lines);
            lines.forEach((text) => {
                text = text.trim();
                context.font = properties.font_style + ' ' + properties.font_weight + ' ' + (properties.font_size/0.2645833333)/2*0.72  + 'px ' + properties.font_family;
                const metrics = context.measureText(text? text +'gb': '');
                testHeight += Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);
                var metricWidth = context.measureText(text);
                if (metricWidth.width > testWidth)
                    testWidth = metricWidth.width;
                
                if(text === '')
                    testHeight += (properties.font_size - 15) < 0 ? 0 : properties.font_size - 15;
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

    render() {
        const elem = this.props.type === LAYER_TYPE_TEXT ? "texte" : LAYER_TYPE_IMAGE;
        console.log("this.props.config", this.props.config);
        //const title = this.props.config ? "Modification du calque " + this.props.config.layer_name : "Creation d'un calque " + elem;
        const title = this.props.config ? "Modification du calque " : "Creation d'un calque " + elem;
        const {config = {}, size={}} = this.props;
        const popupText = document.getElementsByClassName('inverted.menu');
        let clientWidthPopup = 0, clientHeightPopup = 0;
        if( popupText[0] ){
            clientWidthPopup = popupText[0].clientWidth;
            clientHeightPopup = popupText[0].clientHeight;
        }
        const xBox = size.l*2 + 2*size.w;
        const yBox = size.h*3;
        let {properties = {x:0,y: 0}, layer_type} = config || {};
        //console.log(clientWidthPopup,clientHeightPopup, 'width height popup' )
//        console.log(xBox, yBox, properties.x,properties.y,'start', this.defaultBoundingRect)
        let x = properties.x, y = properties.y ,overArea = false;

        if( x + clientHeightPopup >= xBox ){
            //console.log('x1')
            x = x - clientWidthPopup;
            y = y - 2.5*this.defaultBoundingRect.left;
            overArea = true;
        }

        if( y +clientWidthPopup >= yBox || y < clientWidthPopup ){
            //console.log('y1')
            y = y - this.defaultBoundingRect.top;
            overArea = true;
        }

        if( layer_type === LAYER_TYPE_IMAGE ){
             x = properties.x - clientHeightPopup - this.defaultBoundingRect.left * 1.2;
             y = properties.y - 50;
        }

        if( layer_type === LAYER_TYPE_TEXT ){
            x = properties.x + 50;
            y = properties.y - 50;
        }

        if(!overArea){
            x = x - 1.5 * this.defaultBoundingRect.left;
            y = y - this.defaultBoundingRect.top;
        }

        console.log("this.props.type",this.props.type);
        if(!config){
            x = 0; y = 0;
        }
        return (
            <React.Fragment>
             <Draggable
                 handle=".inverted.menu"
                        //defaultPosition={{x: Math.round(x), y: Math.round(y)}}
                        defaultPosition={{x: 0, y: 0}}
                        position={null}
             >
                <Modal className={'inverted.menu'} dimmer={true} closeOnDimmerClick={true} size="tiny" centered={false} open={this.props.open} onClose={() => this.handleResult(null)}>
                    <Menu borderless color="blue" inverted size='huge' style={{ margin: '0', borderRadius: 0, cursor:"all-scroll", color:"#fff"}}>
                    <Menu.Item>
                        <h5><Icon name={this.props.type === LAYER_TYPE_TEXT ? 'text cursor' : this.props.type === LAYER_TYPE_SHAPE ? "box" : LAYER_TYPE_IMAGE} />{title}</h5>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                    <Menu.Item>
                        <Icon style={{cursor:"pointer"}} onClick={() => this.props.handleEditLayer(-1)} name='close' />
                    </Menu.Item>
                    </Menu.Menu>
                    </Menu>
                    <Modal.Content className={'modal-content'}>
                        {this.props.type === LAYER_TYPE_TEXT && <TextContent    name={this.props.config ? this.props.config.layer_name : this.defaultText.name}
                                                                                properties={this.props.config ? this.props.config.properties : this.defaultText}
                                                                                AlignPosition={this.Align}
                                                                                text_align={this.state.text_align}
                                                                                layers={this.props.layers}
                                                                                onResult={(r)=>{this.update(r)}}/>
                        }
                        {this.props.type === LAYER_TYPE_IMAGE && <ImageContent  name={this.props.config ? this.props.config.layer_name : this.defaultImage.name}
                                                                                properties={this.props.config ? this.props.config.properties : this.defaultImage}
                                                                                AlignPosition={this.Align}
                                                                                layers={this.props.layers}
                                                                                text_align={this.state.text_align}
                                                                                onResult={(r)=>{this.update(r)}}/>
                        }
                        {this.props.type === LAYER_TYPE_SHAPE && <ShapeContent  name={this.props.config ? this.props.config.layer_name : this.defaultShape.name}
                                                                                properties={this.props.config ? this.props.config.properties : this.defaultShape}
                                                                                AlignPosition={this.Align}
                                                                                layers={this.props.layers}
                                                                                text_align={this.state.text_align}
                                                                                onResult={(r)=>{this.update(r)}}/>
                        }
                    </Modal.Content>
                    <Modal.Actions className={'modal-action'}>
                        <center>
                        <Button compact style={{marginRight:5}} onClick={() => this.props.handleEditLayer(-1)}>Annuler</Button>
                        <Button compact style={{marginLeft:5}} disabled={!this.sanityCheck()} onClick={() => this.handleResult(this.state)} color='blue'>Enregistrer</Button>
                        </center>
                    </Modal.Actions>
                </Modal>
             </Draggable>
            </React.Fragment>
        );
    }
};

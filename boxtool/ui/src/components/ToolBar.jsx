import React, { Component } from 'react'
import {Dropdown, Icon, Menu, Responsive} from 'semantic-ui-react'
import ReactTooltip from 'react-tooltip'
import {Link} from "react-router-dom"
import ModalLayer from './ModalLayer'
import ColorPicker from './ColorPicker'
import IconMenu from './IconMenu'
import { parseQuery } from '../store/helper'
import iconImage from './../resources/icon/menu/icon-image.png'
import iconText from './../resources/icon/menu/icon-text.png'
import iconForme from './../resources/icon/menu/icon-forme.png'
import iconFond from './../resources/icon/menu/icon-fond.png'
import iconGabarit from './../resources/icon/menu/icon-gabarit.png'
import iconIn from './../resources/icon/menu/icon-in.png'
import iconOut from './../resources/icon/menu/icon-out.png'
import iconHideLine from './../resources/icon/menu/hideLine.png'
import iconShowLine from './../resources/icon/menu/showLine.png'
import ModalConfirm from "./ModalConfirm"
import DimensionBox from "./DimensionBox"
import RabatBox from "./RabatBox"
import ImageBox from './ImageBox'
import TextBox from './TextBox'
import ShapeBox from './ShapeBox';
import LayerBox from './LayerBox';

export default class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            modal : false,
            type : 'text',
            color : '#000000',
            edition : !props.is3D,
            brush: false,
            helpers: true,
            menu_active:'',
            designName: props.project.name_project || "",
            showHideLine: false,
        };
    };

    init = false;

    componentWillReceiveProps(nextProps){
        if(nextProps.is3D!==this.props.is3D)
            this.setState({edition: this.props.is3D });
    };

    modalResult = (r) => {
        this.setState({modal:false});
        this.props.modalResult(r);
    };

    handleSelectColor = (color, toggle = false) => {
        this.props.handleBrush(toggle ? !this.state.brush :true, color);
        this.setState({color:color, brush: toggle ? !this.state.brush :true});
    }

    handleBrush = (e) => {
        this.props.handleBrush(!this.state.brush, this.state.color);
        this.setState({brush:!this.state.brush});
    };

    handleColor = (c) => {
        if (this.state.brush === false && this.init === true) {
            this.props.handleBrush(!this.state.brush, c);
            this.setState({brush:!this.state.brush,color:c});
        }else {
            this.props.handleBrush(this.state.brush, c);
            this.setState({color:c});
        }
        this.init = true;
    };

    handleShowColor = () => {
        this.props.handleEditLayer(-1);
        this.setState({'menu_active':'color_open'});
        this.props.handleMenuClick('color_open');
    };

    zoomBox = (zoomType, event)=>{
        event.preventDefault();
        this.props.onWheelButton(zoomType, false);
    };

    handleCloseConfirme = (e, confirm) => {
        if (confirm === true)
            this.props.handleDeleteLayer(this.state.modalConfirm - 1);
        this.setState({modalConfirm:0});
    };

    handleShowModelConfirm = (layerIndex) =>{
        this.setState({modalConfirm:layerIndex});
    };

    render() {
        const {isLoading, project, edition=false, baseProperties, is3D, startDrag} = this.props;
        const boxParamInfo = parseQuery(window.location.search);
        const { productName="", productId="", customerEmail="" } = boxParamInfo || {};
        const {menu_active} = this.state;
        return (
            <div className={'box-tool-bar'}>
                <Responsive as ={Menu.Menu} //maxWidth={789}
                            maxWidth={1025}
                            position='right'>
                    <Dropdown
                            // item
                            icon={<Icon size='big' data-tip="Ajouter une image" name='bars'/>}
                            // text={<Button.Group style={{marginRight:10}}>
                            //     <Button data-tip="Passer en mode 3D" onClick={(e)=>{this.props.on3D();this.setState({edition:false});this.init=false}} active={!this.state.edition} style={{backgroundColor:this.state.edition === false ? '#00a2e8' : null}}>3D</Button>
                            //     <Button.Or text='/'/>
                            //     <Button data-tip="Passer en mode édition" onClick={(e)=>{this.props.on2D();this.setState({edition:true});this.init=true}} active={this.state.edition} style={{
                            //         float: 'left',
                            //         left: '-2px',
                            //         zIndex:'1',
                            //         marginLeft: '-6px',backgroundColor:this.state.edition === true ? '#00a2e8' : null}}>2D</Button>
                            // </Button.Group>}
                            >
                        {this.state.edition === true ? <Dropdown.Menu>
                            <Dropdown.Item>{this.state.edition === true && <Icon size='big' data-tip="Ajouter une image" name='image' onClick={()=>{this.setState({modal:true,type:'picture'})}}/>}</Dropdown.Item>
                            <Dropdown.Item>{this.state.edition === true && <Icon size='big' data-tip="Ajouter un texte" name='text cursor' onClick={()=>{this.setState({modal:true,type:'text'})}}/>}</Dropdown.Item>
                            <Dropdown.Item>{this.state.edition === true && <Icon size='big' data-tip="Ajouter un texte" name='stop' onClick={()=>{this.setState({modal:true,type:'shape'})}}/>}</Dropdown.Item>
                            {/*<Dropdown.Item>{this.state.edition === true && <Icon size='big' data-tip="Enregistrer le projet" name='save' onClick={()=>{this.props.handleSave()}}/>}</Dropdown.Item>*/}
                            <Dropdown.Item>{this.state.edition === true && <Icon size='big' data-tip="Exporter le projet" name='download' onClick={this.props.exportFile}/>}</Dropdown.Item>
                            <Dropdown.Item>{this.state.edition === true && <Icon style={{marginTop:'5px'}} size='big' data-tip="Exporter le projet" name='file pdf' onClick={this.props.handleExportFilePdf}/>}</Dropdown.Item>
                            <Dropdown.Item>{this.state.edition && <ColorPicker
                                brush={this.state.brush}
                                initialHexColor={this.state.color}
                                onColorChanged={(color) => this.handleSelectColor(color.hex) }
                                onClick={ (e, color) => { ReactTooltip.hide();  this.handleSelectColor(color.hex, true) } } /> }</Dropdown.Item>
                            <Dropdown.Item>
                                {this.state.edition === true && <Icon size='big' data-tip="Repositionner la vue" name='expand arrows alternate' onClick={this.props.zoomCenter}/>}
                            </Dropdown.Item>
                            <Dropdown.Item>
                                {this.state.edition === true &&
                                <Icon size='big' data-tip="Coupeurs / Raineurs"
                                      name={this.state.helpers ? "eye" : "eye slash"}
                                      onClick={() => {
                                          this.props.toogleHelpers(!this.state.helpers)
                                          this.setState({...this.state, helpers: !this.state.helpers})
                                      }
                                      }
                                />
                                }
                            </Dropdown.Item>
                        </Dropdown.Menu> : <Dropdown.Menu></Dropdown.Menu> }
                    </Dropdown>
                </Responsive>
                <div className={'menu-tool-bar'}>
                    <Menu compact icon='labeled' vertical className={'ui vertical pointing menu menu-tool-bar-ul'} style={{height:'100%'}}>
                        <LayerBox
                            baseProperties={baseProperties}
                            model={project}
                            isLoading={isLoading}
                            is3D={is3D}
                            edition={edition}
                            onClick={()=>{  this.props.handleBrush(false, this.state.color);
                                            this.setState({'menu_active':'layer', type:'layer'});
                                            this.props.handleEditLayer(-1);}}
                            handleSaveDimension={this.props.handleSaveDimension}
                            edit={true}
                            type={'Layer'}
                            layers={this.props.layers}
                            onResult={this.modalResult}
                            iconLayer={iconImage}
                            titleMenu ={"layer"}
                            onSelectLayer = {this.props.onSelectLayer}
                            handleUpdateEditLayer = {this.props.handleUpdateEditLayer}
                            handleShowModelConfirm = {this.handleShowModelConfirm}
                            isOpen={menu_active === "layer" ? true : false}
                            key={menu_active}
                            handleEditLayer={this.props.handleEditLayer}
                        />

                        <DimensionBox
                            baseProperties={baseProperties}
                            model={project}
                            isLoading={isLoading}
                            is3D={is3D}
                            edition={edition}
                            onClick={()=>{  this.props.handleBrush(false, this.state.color);
                                            this.setState({'menu_active':'dimension'});
                                            this.props.handleEditLayer(-1);}}
                            handleSaveDimension={this.props.handleSaveDimension}
                            edit={true}
                        />

                        <ImageBox
                            baseProperties={baseProperties}
                            model={project}
                            isLoading={isLoading}
                            is3D={is3D}
                            edition={edition}
                            onClick={()=>{  this.props.handleBrush(false, this.state.color);
                                            this.setState({'menu_active':'create_image', type:'picture'});
                                            this.props.handleEditLayer(-1);}}
                            handleSaveDimension={this.props.handleSaveDimension}
                            edit={true}
                            canvasVectorCenter={this.props.canvasVectorCenter}
                            checkLayerName={this.props.checkLayerName}
                            type={'picture'}
                            layers={this.props.layers}
                            onResult={this.modalResult}
                            iconLayer={iconImage}
                            titleMenu ={"Image"}
                        />

                        <TextBox
                            baseProperties={baseProperties}
                            model={project}
                            isLoading={isLoading}
                            is3D={is3D}
                            edition={edition}
                            onClick={()=>{  this.props.handleBrush(false, this.state.color);
                                            this.setState({'menu_active':'create_text', type:'text'});
                                            this.props.handleEditLayer(-1);}}
                            handleSaveDimension={this.props.handleSaveDimension}
                            edit={true}
                            canvasVectorCenter={this.props.canvasVectorCenter}
                            checkLayerName={this.props.checkLayerName}
                            type={'text'}
                            layers={this.props.layers}
                            onResult={this.modalResult}
                            iconLayer={iconText}
                            titleMenu={"Texte"}
                        />

                        {/* <Dropdown className={ !isLoading && this.state.edition === true ? "":"item-inactive" } item floating icon={<IconMenu src={iconImage} onClick={()=>{
                            this.props.handleBrush(false, this.state.color);
                            this.props.handleMenuClick('create_image');
                            this.setState({modal:true, 'menu_active':'create_image', type:'picture'})}} title={'image'}/>}>
                        </Dropdown>
                        <Dropdown className={ !isLoading && this.state.edition === true ? "":"item-inactive" } item floating icon={<IconMenu src={iconText} onClick={()=>{
                            this.props.handleBrush(false, this.state.color);this.props.handleMenuClick('create_text');
                            this.setState({modal:true,'menu_active':'create_text',type:'text'})}} title={'texte'}/>}>
                        </Dropdown> */}
                        <ShapeBox
                            baseProperties={baseProperties}
                            model={project}
                            isLoading={isLoading}
                            is3D={is3D}
                            edition={edition}
                            onClick={()=>{  this.props.handleBrush(false, this.state.color);
                                            this.setState({'menu_active':'create_shape', type:'shape'});
                                            this.props.handleEditLayer(-1);}}
                            handleSaveDimension={this.props.handleSaveDimension}
                            edit={true}
                            canvasVectorCenter={this.props.canvasVectorCenter}
                            checkLayerName={this.props.checkLayerName}
                            type={'shape'}
                            layers={this.props.layers}
                            onResult={this.modalResult}
                            iconLayer={iconForme}
                            titleMenu={"forme"}
                        />
                        {/* <Dropdown className={ !isLoading && this.state.edition === true ? "":"item-inactive" } item floating icon={<IconMenu src={iconForme} onClick={()=>{
                            this.props.handleBrush(false, this.state.color);
                            this.setState({'menu_active':'forme'})}} title={'forme'}/>}>
                        </Dropdown> */}

                        <ColorPicker
                            isLoading={isLoading}
                            edition={this.state.edition}
                            src={iconFond} title={'fond'}
                            brush={this.state.brush}
                            initialHexColor={this.state.color}
                            handleShowColor={this.handleShowColor}
                            onColorChanged={(color) => this.handleSelectColor(color.hex) }
                            onClick={ (e, color) => {   console.log(1);
                                                        ReactTooltip.hide();
                                                        this.handleSelectColor(color.hex, true);}} />

                        {/* <Dropdown className={ !isLoading && this.state.edition === true ? "":"item-inactive" } item floating icon={<IconMenu src={iconDesigner}
                            onClick={()=>{ this.props.handleBrush(false, this.state.color);
                            this.setState({'menu_active':'folder_open'});
                            this.props.handleMenuClick('folder_open');}}
                            title={'enregister'}/>}>
                        </Dropdown> */}

                        <Dropdown className={ !isLoading && this.state.edition === true ? "":"item-inactive" } item floating icon={<IconMenu src={iconGabarit} onClick={()=>{
                            this.props.handleBrush(false, this.state.color);
                            this.props.handleMenuClick("file_pdf");
                            this.props.handleExportFilePdf();
                            this.props.handleEditLayer(-1);
                            this.setState({'menu_active':'file_pdf'})}} title={'gabarit 2d'}/>}>
                        </Dropdown>

                        <Dropdown className={ !isLoading && this.state.edition === true ? "":"item-inactive" } item floating icon={
                                <IconMenu src={this.state.helpers ? iconHideLine : iconShowLine} onClick={() => {
                                    this.props.toogleHelpers(!this.state.helpers)
                                    this.setState({...this.state, helpers: !this.state.helpers})
                                }} title={'show line'}/>
                        }>

                        </Dropdown>

                        <div style={{width:'100', height:'5px', background:'#d8edce', marginTop:'10px', marginBottom:'10px'}}/>
                            <Responsive className={ !isLoading && this.state.edition === true ? "item-inactive":"" } as={Menu.Item} minWidth={790} name={''}>
                                <IconMenu src={iconIn} title={''} onClick={this.zoomBox.bind(this,'zoom-in')}/>
                            </Responsive>

                            <Responsive className={ !isLoading && this.state.edition === true ? "item-inactive":"" } as={Menu.Item} minWidth={790} name={''}>
                                <IconMenu src={iconOut} title={''} onClick={this.zoomBox.bind(this,'zoom-out')}/>
                            </Responsive>

                        <div style={{textTransform: 'uppercase', color:'#ffffff', textAlign: 'center', fontWeight:'bold'}}/>
                        {/*{*/}
                        {/*    !isLoading && this.state.edition === 'true' && <Responsive as={Menu.Item} minWidth={790} name={''}>*/}
                        {/*        <Icon size='big' style={{marginTop:'5px'}} data-tip="Exporter le projet" name='download' onClick={()=>{*/}
                        {/*            this.props.handleBrush(false, this.state.color);this.setState({'menu_active':'file_pdf'});this.props.exportFile();this.props.handleMenuClick('file_pdf')}*/}
                        {/*        }/>*/}
                        {/*    </Responsive>*/}
                        {/*}*/}
                        <RabatBox
                            isLoading={isLoading}
                            is3D={is3D}
                            edition={this.state.edition}
                            config={this.props.config}
                            onRangeChange={this.props.onRangeChange}
                        />
                    </Menu>
                </div>
                <div className={'menu-tool-bar-sub'} style={{display: menu_active==='folder_open' && !is3D && project.customer_email_list.length ?"block" :"none"}}>
                    { !isLoading && this.state.edition === true && menu_active==='folder_open' ? <React.Fragment>
                            {project.customer_email_list.length?
                                <Menu pointing secondary className={'ui vertical icon vertical-submenu'} style={{height:'80%',overflowX: 'hidden', borderRightStyle:'none'}}>
                                    {
                                        project.customer_email_list.map((val, index) => {
                                            return <Responsive key={index} as={Menu.Item} minWidth={790} active={val.workspace_id===this.props.project.workspace_id} name={''} title={val.name_project} onClick={()=>{this.props.handleBrush(false, this.state.color)}}>
                                                <Link to={"/boxo-frontend/workspace/"+val.workspace_id+"?customerEmail="+customerEmail+"&productName="+productName+"&productId="+productId}>
                                                    <Icon size='big' data-tip="Ajouter une image" name='folder outline'/> Version: {val.workspace_id}
                                                </Link>
                                            </Responsive>
                                        })
                                    }
                                </Menu>

                                    : null
                            }
                        </React.Fragment>
                        :
                        null
                    }
                </div>
                {((this.state.modal || this.props.openLayer) && !startDrag) && <ModalLayer canvasVectorCenter={this.props.canvasVectorCenter}
                                                                           key={this.props.openLayer}
                                                                           layers={this.props.layers}
                                                                           getBoundingRect={this.props.getBoundingRect}
                                                                           controlledPosition={this.props.controlledPosition}
                                                                           checkLayerName={this.props.checkLayerName}
                                                                           open={true}
                                                                           size={this.props.size}
                                                                           project={project}
                                                                           config={this.props.openLayer}
                                                                           type={this.props.openLayer ? this.props.openLayer.layer_type : this.state.type}
                                                                           onResult={this.modalResult}
                                                                           handleEditLayer={this.props.handleEditLayer}
                                                                           />}
                {this.state.modalConfirm > 0 && <ModalConfirm label={this.props.layers[this.state.modalConfirm - 1].layer_name} handleCloseConfirme={this.handleCloseConfirme}/>}
            </div>
        );
    };
};

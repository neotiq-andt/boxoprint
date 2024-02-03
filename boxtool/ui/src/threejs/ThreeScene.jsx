import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';
import * as THREE from 'three';
import {OrbitControls} from './OrbitControls';
import {TransformControls} from './TransformControls';
import {
    Dimmer,
    Grid, Icon, Loader, Segment
} from 'semantic-ui-react';
import Cube from './Cube';
import PropertyGridControl from '../PropertyControl/PropertyGrid';
import PDFDocument from '@react-pdf/pdfkit'
import blobStream from 'blob-stream'
import SVGLoader from "./SVGLoader";
import {TrackballControls} from './TrackballControls';
import LayerBar from '../components/LayerBar';
import ToolBar from '../components/ToolBar';
/* eslint-disable */
import { makeCancelable } from '../store/utils'
import axios from "axios";
import {apiUrl} from "../constants";
import { LAYER_TYPE_SHAPE, SHAPE_TYPE } from "../constants/index";
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const box3DZoomMax = 30
const box3DZoom = 15
const box2DZoom = 10
const minZoom = 2
let orbitControls;
class ThreeScene extends Component {

    constructor(props) {
        super(props);
        if (this.props.parent){
            this.props.parent.onCenter = this.centerForm;
            this.props.parent.zoomInForm = this.zoomInForm;
            this.props.parent.toogleHelpers = this.toogleHelpers;
        }
        var loader = new SVGLoader();
        var {paths, root} = loader.parse(this.props.svg);
        this.cubes = new Cube(paths, {
            ...this.props, ...root
        }, this.props.svg);
        this.root = root;
        this.state = {percentZoom: 0, zoom2D: false, autoSpinner: true, selectedFile:'', updateScene: true, startDrag: false, canvasVectorCenter:{x:0, y:0}}
        this.boxZoomIn = minZoom
        this.percentZoom = Math.round(this.props.boxZoomIn/box3DZoom*100)
    }


    toogleHelpers = (helpers) => {
        this.cubes.update_helpers(helpers);
    };

    centerForm = () => {
        this.controls.reset();
        this.transformControls.reset();
        this.cubes.fitCameraToObject(this.camera);
        this.boxZoomIn = minZoom
    }

    zoomInForm = (zoom) => {
        this.controls.reset();
        this.transformControls.reset();
        this.cubes.fitCameraToZoom(this.camera, this.props.is3D, zoom)
    }

    handleRangeChange = (preset, property, value) => {
        this.cubes.fold(property, value);
    }

    onWindowResize = () => {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    initControls = () => {

        var that = this;
        // fix focus scene.
        /*
        window.addEventListener("wheel", (e) => {
            if (document.activeElement.tagName !== 'INPUT' &&
            document.activeElement.tagName !== 'TEXTAREA')
                that.orbitControls.enabled = that.props.isControlled;
            else
                that.orbitControls.enabled = false;
        });
        window.addEventListener("keydown", function (e) {
            if (e.target &&
                (e.target.tagName === 'INPUT' ||
                 e.target.tagName === 'TEXTAREA'))
                that.orbitControls.enabled = false;
            else
                that.orbitControls.enabled = that.props.isControlled;
        });
*/
        // ADD CONTROLS
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.noRotate = !this.props.is3D;
        this.controls.noZoom = false;
        //this.controls.noPan = !this.props.isControlled;
        this.controls.noPan = true;
        this.controls.enabled = this.props.isControlled;

        orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
        orbitControls.update();
        orbitControls.addEventListener( 'change', this.renderScene );

        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        //this.orbitControls.setSpace("local");
        this.transformControls.setMode("rotate");
        this.transformControls.attach(this.cubes.pivot);
        this.transformControls.addEventListener( 'change', this.renderScene );
        this.transformControls.addEventListener( 'dragging-changed', function ( event ) {
            var object = this.object;
            if(!that.props.is3D ){
                if (object.type === 'Mesh'){
                    var working_box = new THREE.Box3().setFromObject(object);
                    console.log(object);
                    console.log(working_box);
                    if (!isNaN(working_box.max.y) && !isNaN(working_box.max.x))
                        if (object.app_layer.layer_type === 'picture') {
                            that.cubes.layers.forEach((value, index)=>{
                                const {layer} = value
                                if(layer.layer_name === object.app_layer.layer_name){
                                    // layer.properties.height = (working_box.max.y - working_box.min.y);
                                    // layer.properties.width = (working_box.max.x - working_box.min.x);
                                    layer.properties.height = object.scale.y;
                                    layer.properties.width = object.scale.x;
                                    // that.transformControls.setScaleX(layer.properties.width/10);
                                    // that.transformControls.setScaleY(layer.properties.height/10);
                                    that.transformControls.setSize(1);
                                }
                            })
                            that.cubes.update_texture();
                        } else if (object.app_layer.layer_type === 'text') {
                            that.cubes.layers.forEach((value, index)=>{
                                const {layer} = value
                                if(layer.layer_name === object.app_layer.layer_name && object.scale.y / 10 !== layer.properties.scaleHeight ){
                                    console.log(layer);
                                    layer.properties.font_size = object.scale.y / 10 - 5;
                                    // that.transformControls.setSize(object.scale.y / 10);
                                    that.transformControls.setSize(1);
                                    // layer.properties.font_size = object.scale.y - 5;
                                }
                            })
                            that.cubes.update_texture();
                        }else if(object.app_layer.layer_type === LAYER_TYPE_SHAPE){
                            that.cubes.layers.forEach((value, index)=>{
                                const {layer} = value
                                if(layer.layer_name === object.app_layer.layer_name){
                                    if(layer.properties.shapeType === SHAPE_TYPE.circle || layer.properties.shapeType === SHAPE_TYPE.square)
                                    {
                                        layer.properties.height = object.scale.x;
                                        layer.properties.width = object.scale.x;
                                    }else{
                                        layer.properties.height = object.scale.y;
                                        layer.properties.width = object.scale.x;
                                    }
                                    that.transformControls.setSize(1);
                                }
                            })
                            that.cubes.update_texture();
                        }
                }
            }
            orbitControls.enabled = ! event.value;
        } );

        orbitControls.enabled = false;
        this.transformControls.enableZoom = true
        this.transformControls.zoomSpeed = 1
        this.scene.add(this.transformControls);

        this.scene.add(orbitControls);
        /**
         * TODO
         * @type {boolean}
         */

        // this.orbitControls.addEventListener('start', (event) => console.log("Controls Start Event",event))
        // this.orbitControls.addEventListener('change', (event) => {console.log("Controls Change", event); })
        this.transformControls.addEventListener('end', (event) => {
            if( this.props.setOrbitControl ){
                this.props.setOrbitControl(this.transformControls);
            }
        })
        this.transformControls.domElement.addEventListener('wheel', (event) => {
            //zoom 3d
            if( !this.props.is3D ){
                this.setState({zoom2D: true})
            }
            if( this.props.is3D ){
                const dollyScale = Math.pow( 0.95, orbitControls.zoomSpeed );
                if( event.deltaY < 0 ){
                    if( this.boxZoomIn >= minZoom && this.boxZoomIn < box3DZoomMax ){
                        this.boxZoomIn = this.boxZoomIn + 1
                        if( this.boxZoomIn === box3DZoomMax ){
                            orbitControls.enableZoom = false
                        }else{
                            orbitControls.enableZoom = true
                        }
                    }else{
                        orbitControls.enableZoom = false
                    }
                }
                if( event.deltaY > 0 ){
                    if( this.boxZoomIn > minZoom && this.boxZoomIn <= box3DZoomMax ){
                        orbitControls.enableZoom = true
                        if( this.boxZoomIn === box3DZoomMax ){
                            orbitControls.object.zoom = Math.max( orbitControls.minZoom, Math.min( orbitControls.maxZoom, orbitControls.object.zoom * dollyScale ) );
                            orbitControls.object.updateProjectionMatrix();
                        }
                        this.boxZoomIn = this.boxZoomIn - 1
                        if( this.boxZoomIn === minZoom){
                            orbitControls.enableZoom = false
                        }
                    }else{
                        orbitControls.enableZoom = false
                    }
                }
                this.percentZoom = Math.round((this.boxZoomIn/box3DZoom)*100)
                this.props.setBoxZoomIn(this.boxZoomIn)
            }
            this.setState({percentZoom: this.percentZoom})
        })

        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            ZOOM: THREE.MOUSE.MIDDLE,
        }

        /**
         * End todo
         * @type {boolean}
         */
        // this.orbitControls.minDistance = 2;
        // controls.maxDistance = 5;
        this.transformControls.enablePan = false;
        this.transformControls.enabled = false;
        this.transformControls.visible = false;
    }

    onWheelButton = (zoomType, wheel = false, update=true)=>{
        if( this.props.is3D ){
            const dollyScale = Math.pow( 0.95, this.transformControls.zoomSpeed );
            if( zoomType === 'zoom-in' ){
                if( this.boxZoomIn >= minZoom && this.boxZoomIn < box3DZoomMax ){
                    this.boxZoomIn = this.boxZoomIn + 1
                    orbitControls.enableZoom = true
                    if( !wheel ){
                        orbitControls.object.zoom = Math.max( orbitControls.minZoom, Math.min( orbitControls.maxZoom, orbitControls.object.zoom / dollyScale ) );
                        orbitControls.object.updateProjectionMatrix();
                    }
                    if( this.boxZoomIn === box3DZoomMax ){
                        orbitControls.enableZoom = false
                    }
                }else{
                    orbitControls.enableZoom = false
                }
            }
            if( zoomType === 'zoom-out' ){
                if( this.boxZoomIn > minZoom && this.boxZoomIn <= box3DZoomMax ){
                    orbitControls.enableZoom = true
                    this.boxZoomIn = this.boxZoomIn - 1
                    if( !wheel ){
                        orbitControls.object.zoom = Math.max( orbitControls.minZoom, Math.min( orbitControls.maxZoom, orbitControls.object.zoom * dollyScale ) );
                        orbitControls.object.updateProjectionMatrix();
                    }
                }else{
                    orbitControls.enableZoom = false
                }
            }
        }

        this.percentZoom = Math.round((this.boxZoomIn/box3DZoom)*100)
        if(update || this.percentZoom=== 100 || this.props.updateZoom){
            if(update){
                this.props.setBoxZoomIn(this.boxZoomIn)
            }
            if( this.props.updateZoom && this.percentZoom >100 ){
                return
            }
            this.setState({percentZoom: this.percentZoom})
        }
    }

    componentDidMount() {
        this.boxZoomIn = 2
        var width = this.mount.clientWidth
        var height = this.mount.clientHeight
        this.mount.addEventListener('resize', this.onWindowResize, false);

        //ADD SCENE
        this.scene = new THREE.Scene();
        this.grid = new THREE.GridHelper( 800, 80, 0x808080, 0x808080 );
        this.grid.geometry.rotateX( Math.PI / 2 );
        this.grid.position.z = -100;
        this.scene.add( this.grid );
        // ADD LIGHT
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
        hemiLight.groundColor.setHSL(0.095, 0, 0.75);
        hemiLight.position.set(0, 50, 0);
        this.scene.add(hemiLight);
        // var hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
        // this.scene.add(hemiLightHelper);

        var light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.x = 300;
        light.position.y = 250;
        light.position.z = -500;
        this.scene.add(light);


        // 1.6 -> 20 / 75
        var factor = 1;
        if (this.root && this.root.base && this.root.base.height)
            factor = (this.root.base.width / this.root.base.height) / 1.7;
        if (factor === 0) factor = 1;

        //ADD CAMERA
        var VIEW_ANGLE = 70, ASPECT = width / height, NEAR = 1, FAR = 20000;
        //this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera = new THREE.PerspectiveCamera(
            44.387,
//            Math.round( factor * (this.props.is3D ? 20 : 75) ),
            width / height,
            1,
            1000000
        )
        this.camera.rotation.order = 'YXZ';


        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({
            antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference:'high-performance'
        })
        this.renderer.setClearColor(this.props.scene, 1)
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(window.devicePixelRatio);

        if (this.props.isControlled) {
            setInterval(() => {
                if (this.mount &&
                    width !== this.mount.clientWidth) {
                    width = this.mount.clientWidth
                    height = this.mount.clientHeight
                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();
                    this.renderer.setSize(width, height);
                }
            }, 500);
        }


        var params = {
            exposure: 1.0
        };
        //        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = params.exposure;
        this.renderer.gammaOutput = true;
        this.renderer.domElement.id='box-canvas';
        this.renderer.domElement.addEventListener("click", this.onClickBox, false)
        this.renderer.domElement.addEventListener( 'mousedown', (event)=>{
            event.preventDefault();
            if(this.props.is3D){
                return
            }
            const boundingRect = this.renderer.domElement.getBoundingClientRect()
            mouse.x = ( (event.clientX - boundingRect.left )/ this.mount.clientWidth ) * 2 - 1;
            mouse.y = - ( ( event.clientY - boundingRect.top ) / this.mount.clientHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, this.camera );
            const intersects = raycaster.intersectObjects( this.cubes.group.children, false );
            if ( intersects.length > 0 ) {
                if( intersects[0].object.app_info.face==='texture' ){
                    if(this.props.selectedLayer){
                        this.props.onSelectLayer( '' )
                    }
                    this.props.handleBrush(false, '');
                    let layer_name = intersects[0].object.app_layer.layer_name
                    !this.props.selectedLayer ? this.props.onSelectLayer( layer_name ) :"";
                    this.cubes.layers.forEach((value, index)=>{
                        const {layer} = value
                        if(layer.layer_name === layer_name){
                            
                            // TODO
                            let indexLayer = value.layer.order - 1;
                            this.props.handleEditLayer(indexLayer);
                            
                            this.setState({updateScene: false});
                            var objectAttach = this.transformControls.object;
                            if (intersects[0].object !== objectAttach) {
                                this.transformControls.reset();
                                this.transformControls.attach(intersects[0].object);
                            }
                            this.transformControls.visible = true;
                            this.transformControls.enable = true;
                            this.transformControls.showZ = false;
                            this.transformControls.showY = true;
                            this.transformControls.showX = true;
                            this.transformControls.setMode("scale");
                        }
                    })
                }
            } else {
                this.cubes.selectLayer("");
                this.setState({updateScene: true});
                this.props.handleEditLayer(-1);
                // this.transformControls.reset();
                // this.transformControls.attach(this.cubes.pivot);
                // this.transformControls.visible = false;

            }
        }, false );

        /*this.renderer.domElement.addEventListener( 'mouseup', (event)=>{
            event.preventDefault()
            const boundingRect = this.renderer.domElement.getBoundingClientRect()
            mouse.x = ( (event.clientX - boundingRect.left )/ this.mount.clientWidth ) * 2 - 1;
            mouse.y = - ( ( event.clientY - boundingRect.top ) / this.mount.clientHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, this.camera );
            const intersects = raycaster.intersectObjects( this.cubes.group.children, false );
            console.log('intersects', intersects);
            if ( intersects === undefined || intersects.length === 0 ) {
                this.props.handleEditLayer(-1);
                this.transformControls.reset();
                this.transformControls.visible = false;
            }
            this.setState({autoSpinner: false})
        }, false );*/

        this.mount.appendChild(this.renderer.domElement)

        this.initControls();
        this.scene.add(this.cubes.pivot);
        // var control = new TransformControls(this.camera, this.renderer.domElement);
        // control.addEventListener('dragging-changed',  (event) => {
        //     this.orbitControls.enabled = !event.value;
        // });
        // control.setSpace("local");
        // control.setMode("rotate");
        // control.attach(this.cubes.group);
        // this.scene.add(control);


        // debug helpers
        // if (!this.props.asAxes) {
        //this.scene.add(new THREE.AxesHelper(5));
        //this.scene.add(new THREE.BoxHelper(this.cubes.pivot));
        // }
        this.cubes.fitCameraToObject(this.camera);
        this.cubes.brushcontrols(this.camera, this.renderer, this.controls);
        this.cubes.brushcontrols.addEventListener('dragstart', (event)=>{
            const {startDrag} = this.state;
            if(this.props.is3D){
                return
            }
            if(!startDrag && this.props.selectedLayer){
                this.props.handleEditLayer(-1)
                this.setState({startDrag: true})
            }
        }, false)
        this.cubes.brushcontrols.addEventListener('dragend', (event)=>{
            if(this.props.is3D){
                return
            }
            this.cubes.layers.forEach((value, index)=>{
                const {layer} = value
                if(layer.layer_name === this.props.selectedLayer){
                    this.props.handleEditLayer(index)
                    this.setState({startDrag: false, updateScene: false})
                }
            })
        }, false)
        this.cubes.dragcontrols(this.camera, this.renderer, this.controls);
        this.cubes.initCallback((e) => {
            if (this.props.onSelectLayer)
                this.props.onSelectLayer(e);
        },
        (key, color) => {
            if (this.props.onBrush) {
                this.setState({updateScene: false});
                this.props.onBrush(key, color);}
        });

        if (this.props.selectedLayer)
            this.cubes.selectLayer(this.props.selectedLayer);

        if( this.props.updateZoom ){
            if( Object.keys(this.props.orbitControl).length ){
                this.camera.position.set( this.props.orbitControl.position.x, this.props.orbitControl.position.y, this.props.orbitControl.position.z);
                this.transformControls.update();
            }
        }

        this.cubes.updateLayers(this.props);
        this.camera.lookAt(this.cubes.pivot);
        this.start()
    }

    onClickBox = (event)=>{
        this.setState({autoSpinner: false})
    }

    componentDidUpdate(prevProps/*, prevState, snapshot*/) {
        if (this.props.isControlled) {
            this.controls.enabled = !this.props.is3D;
            this.transformControls.enabled = true;
            //this.transformControls.visible = false;
            orbitControls.enabled = this.props.is3D;
            this.cubes.brushcontrols.enabled = !this.props.is3D;
            this.grid.visible = !this.props.is3D;
        }
        /*
        if 2d reset auto spinner
         */
        if(!this.props.is3D){
            this.state.autoSpinner = true;
            this.cubes.lines.forEach(line => {
                line.visible = true;
            });
        } else {
            this.cubes.lines.forEach(line => {
                line.visible = false;
            });
        }
        if (!this.props.is3D && prevProps.is3D !== this.props.is3D && !this.props.updateZoom) {
            // on passe de 3D vers 2D
            this.transformControls.visible = false;
            this.controls.reset();
            this.transformControls.reset();
            this.cubes.fitCameraToObject(this.camera);
        }

        if( (( this.props.is3D !== prevProps.is3D && this.props.is3D) && this.props.is3D) || JSON.stringify(prevProps.baseProperties) !== JSON.stringify(this.props.baseProperties) ){
            this.transformControls.reset();
            this.transformControls.visible = true;
            this.transformControls.attach(this.cubes.pivot);
            this.transformControls.setMode("rotate");
            this.transformControls.showZ = true;
            this.transformControls.showX = true;
            this.transformControls.showY = true;
            this.transformControls.setSize(1);
            this.transformControls.setScaleX(1);
            this.transformControls.setScaleY(1);
            this.transformControls.setScaleZ(1);
            if( this.state.zoom2D ){
                this.controls.reset();
                this.transformControls.reset();
                this.controls.update()
                this.transformControls.update();
                this.cubes.fitCameraToObject(this.camera);
                this.state.zoom2D = false
            }
            for(let i=2; i<this.props.boxZoomIn; i++){
                this.onWheelButton('zoom-in', false, false)
            }
        }

        if (prevProps.selectedLayer !== this.props.selectedLayer){
            this.cubes.selectLayer(this.props.selectedLayer);
        }
        else{

            if (this.state.updateScene || !this.props.is3D && prevProps.is3D !== this.props.is3D) {
                this.cubes.updateLayers(this.props);
            }
        }
        //console.log("🚀 ~ file: ThreeScene.jsx ~ line 518 ~ ThreeScene ~ componentDidUpdate ~ cubes", this.cubes.group.children);
        //this.renderScene()
    }

    componentWillUnmount() {
        this.stop()
        if (this.renderer) this.mount.removeChild(this.renderer.domElement)
        if (this.cubes) delete this.cubes;
        if (this.renderer) this.renderer.forceContextLoss();
        if (this.camera) delete this.camera
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        if( this.props.is3D ){
            if( this.state.autoSpinner ){
                this.cubes.pivot.rotation.z = -2;
                this.cubes.pivot.rotation.y = 0;
                this.cubes.pivot.rotation.x = 14.17;
            }
        }else{
            this.cubes.pivot.rotation.z = 0;
            this.cubes.pivot.rotation.y = 0;
            this.cubes.pivot.rotation.x = 0;
            if (this.transformControls.object !== undefined && !this.transformControls.object.parent) {
                this.transformControls.object.parent = this.cubes.pivot;
            }
        }
        this.frameId = requestAnimationFrame(this.animate)
        this.renderScene()
        if (!this.props.is3D) this.controls.update();
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    handleSaveThree =  (name_project) => {
        this.renderer.render(this.scene, this.camera);
        this.props.handleSave(name_project, this.renderer.domElement.toDataURL());
        this.props.handleLogin(name_project, this.renderer.domElement.toDataURL());
    }

    handleOnModalResult =  (r) => {
        this.setState({updateScene: true})
        this.props.modalResult(r)
    }

    handleExportThree =  () => {
        this.grid.visible = false;
        this.renderer.setClearColor( 0xffffff, 0)
        this.renderer.render(this.scene, this.camera);
        const  data = this.renderer.domElement.toDataURL();
        let compress = false,
            pagewidth = 612,
            pageheight = 729,
            x = 10,
            y = 10;
        let options = {
            useCSS: false,
            assumePt: false,
            preserveAspectRatio: '',
            width: 400,
            height: 400
        };

        let doc = new PDFDocument({compress: compress, size: [compress.pagewidth || 612, compress.pageheight || 792]});
        doc.image(new Buffer(data.replace('data:image/png;base64,',''), 'base64'), 0, 0, {
            fit: [620, 600],
            align: 'center',
            valign: 'center'
        });
        let stream = doc.pipe(blobStream());
        stream.on('finish', function() {
            const pdfURL = stream.toBlobURL("application/pdf")
            window.open(pdfURL, '_blank')
        })
        doc.end()
        this.renderer.setClearColor(this.props.scene, 1)
    }

    getBoundingRect= ()=>{
        const boundingRect = this.renderer.domElement.getBoundingClientRect() || {}
        const mount = this.mount;
        return {boundingRect, mount}
    }

    render() {
        const {isLoading} = this.props
        return (
            <Fragment>
                {this.props.isWorkspace ?
                    <Fragment>
                        <Grid.Column className="ui-grid-left" style={{height:"100%"}} floated='left' width={1}>
                            <ToolBar baseProperties={this.props.project.base.properties}
                                     exportFile={this.props.exportFile}
                                     handleSaveDimension={this.props.handleSaveDimension}
                                     handleExportFilePdf={this.handleExportThree}
                                     handleZoomIn={()=>{}}
                                     checkLayerName={this.props.checkLayerName}
                                     toogleHelpers={this.props.toogleHelpers}
                                     zoomCenter={this.props.zoomCenter}
                                     modalResult={this.handleOnModalResult}
                                     on2D={()=>{
                                         this.props.on2D();
                                         this.props.setOrbitControl({});
                                         this.props.setBoxZoomIn(box3DZoom);
                                         this.props.checkUpdateZoom3D(false);
                                         this.setState({updateScene: false, percentZoom: minZoom});
                                         if( this.props.is3D ) {this.boxZoomIn = minZoom;}
                                     }}
                                     on3D={()=>{
                                         this.props.on3D();
                                         this.props.checkUpdateZoom3D(true);
                                         if( !this.props.is3D ) {this.boxZoomIn = minZoom;}
                                         this.setState({updateScene: true, percentZoom: 100})
                                     }}
                                     handleSave={this.props.handleSave}
                                     handleLogin={this.props.handleLogin}
                                     startDrag = {this.state.startDrag}
                                     handleBrush={this.props.handleBrush}
                                     openLayer={this.props.openLayer}
                                     canvasVectorCenter={this.cubes}
                                     is3D={this.props.is3D}
                                     edition={this.state.edition}
                                     history={this.props.history}
                                     isLoading={isLoading}
                                     onWheelButton={this.onWheelButton}
                                     percentZoom={this.percentZoom}
                                     size={this.props.project.base.properties}
                                     getBoundingRect={this.getBoundingRect}
                                     onSelectLayer={this.props.onSelectLayer}
                                     handleEditLayer={this.props.handleEditLayer}
                                     handleOrderLayer={this.props.handleOrderLayer}
                                     layers={this.props.layers}
                                     project={this.props.project}
                                     menu_active={this.props.menu_active}
                                     handleMenuClick={this.props.handleMenuClick}
                                     handleDeleteLayer={this.props.handleDeleteLayer}
                                     config={this.props.config}
                                     onRangeChange={this.handleRangeChange}
                                     handleUpdateEditLayer = {this.props.handleUpdateEditLayer}
                            />
                        </Grid.Column>
                        <Grid.Column className="ui-grid-center" style={{height:"100%"}} floated='left' width={12}>
                            <div style={{ width: "100%", height: "100%", display: isLoading ? "none":"block", position: 'relative' }} ref={(mount) => { this.mount = mount }}>
                                <div style={{ display: this.props.is3D ? "block":"none",right: '0px', padding: '10px', opacity: '0.5', position: 'absolute' }}>
                                    <Icon size='big' style={{cursor:'pointer'}} name='zoom-in' onClick={()=>this.onWheelButton('zoom-in', false)}/>
                                    {this.percentZoom+' % '}
                                    <Icon size='big' style={{cursor:'pointer'}} name='zoom-out' onClick={()=>this.onWheelButton('zoom-out', false)} />
                                </div>
                            </div>
                            <div style={{ width: "100%", height: "100%", display: isLoading ? "block":"none" }}>
                                <Segment style={{height:'100%', width: '100%'}}>
                                    <Dimmer active inverted>
                                        <Loader indeterminate>Mise à jour du modèle</Loader>
                                    </Dimmer>
                                </Segment>
                            </div>
                        </Grid.Column>
                        { ( this.props.is3D && this.props.config.presets || isLoading) &&
                            <Grid.Column floated='right' width={3}>
                                <PropertyGridControl handleSave={this.props.handleSave}
                                                     project={this.props.project}
                                                     size={this.props.size}
                                                     isLoading={isLoading}
                                                     percentZoom={this.percentZoom}
                                                     onWheelButton={this.onWheelButton}
                                                     handleSaveDimension={this.props.handleSaveDimension}
                                                     handleZoomIn={this.props.handleZoomIn}
                                                     onRangeChange={this.handleRangeChange}
                                                     is3D={this.props.is3D}
                                                     on2D={()=>{
                                                         this.props.on2D();
                                                         this.props.setOrbitControl({});
                                                         this.props.setBoxZoomIn(box3DZoom);
                                                         this.props.checkUpdateZoom3D(false);
                                                         this.setState({updateScene: false, percentZoom: minZoom});
                                                         if( this.props.is3D ) {this.boxZoomIn = minZoom;}
                                                     }}
                                                     on3D={()=>{
                                                         this.props.on3D();
                                                         this.props.checkUpdateZoom3D(true);
                                                         if( !this.props.is3D ) {this.boxZoomIn = minZoom;}
                                                         this.setState({updateScene: true, percentZoom: 100})
                                                     }}
                                                     selectedLayer={this.props.selectedLayer}
                                                     onBrush={this.handleBrushMesh}
                                                     onSelectLayer={this.props.onSelectLayer}
                                                     brush={this.props.brush}
                                                     user_config={this.props.user_config}
                                                     svg={this.props.project.base.svg}
                                                     config={this.props.config}/>
                            </Grid.Column>
                        }
                        {!isLoading && !this.props.is3D && <Grid.Column className="ui-grid-right" floated='right' width={3}>
                            <LayerBar baseProperties={this.props.project.base.properties}
                                      onSelectLayer={this.props.onSelectLayer}
                                      selectLayerIndex={this.state.selectIndex}
                                      layers={this.props.layers}
                                      onResult={this.props.onResult}
                                      handleEditLayer={this.props.handleEditLayer}
                                      handleDeleteLayer={this.props.handleDeleteLayer}
                                      handleSaveDimension={this.props.handleSaveDimension}

                                      handleAddToCard={this.props.handleAddToCard}
                                      handleLogin={this.props.handleLogin}
                                      handleCreateUser = {this.props.handleCreateUser}
                                      createUserInfo = {this.props.createUserInfo}
                                      boxParamInfo = {this.props.boxParamInfo}
                                      loginResult =  {this.props.loginResult}
                                      createUserResult = {this.props.createUserResult}
                                      handleZoomIn={this.props.handleZoomIn}
                                //handleSave={this.props.handleSave}
                                      handleSave={this.handleSaveThree}
                                      project={this.props.project}
                                      percentZoom={this.percentZoom}
                                      parent={this}
                                      isWorkspace={true}
                                      selectedLayer={this.props.selectedLayer}
                                      onBrush={this.handleBrushMesh}
                                      handleBrush={this.props.handleBrush}
                                      config={this.props.config}
                                      brush={this.props.brush}
                                      user_config={this.props.user_config}
                                      is3D={!this.props.is3D} w='100%' h='600px'
                                      isControlled={true}
                                      isLoading={isLoading}
                                      size={this.props.project.base.properties}
                                      svg={this.props.project.base.svg}
                                      warningElement={this.cubes.checkWarningElement || []}
                                      on2D={()=>{
                                          this.props.on2D();
                                          this.props.setOrbitControl({});
                                          this.props.setBoxZoomIn(box3DZoom);
                                          this.props.checkUpdateZoom3D(false);
                                          this.setState({updateScene: false, percentZoom: minZoom});
                                          if( this.props.is3D ) {this.boxZoomIn = minZoom;}
                                      }}
                                      on3D={()=>{
                                          this.props.on3D();
                                          this.props.checkUpdateZoom3D(true);
                                          if( !this.props.is3D ) {this.boxZoomIn = minZoom;}
                                          this.setState({updateScene: true, percentZoom: 100})
                                      }}
                                      key={JSON.stringify(this.props.project.base.svg)+JSON.stringify(this.props.user_config)}
                            />
                        </Grid.Column>
                        }
                    </Fragment>
                    :
                    <div
                        style={{ width: `${this.props.w}`, height: `${this.props.h}` }}
                        ref={(mount) => { this.mount = mount }}
                    >
                    </div>
                }
            </Fragment>
        )
    }
}


ThreeScene.propTypes = {
    isControlled: PropTypes.bool,
    isWorkspace: PropTypes.bool,
    h: PropTypes.string,
    w: PropTypes.string,
    label: PropTypes.bool,
    lines: PropTypes.bool,
    scene: PropTypes.number,
    line_color: PropTypes.number,
    face_mono: PropTypes.bool,
    face_color: PropTypes.number,
    svg: PropTypes.string.isRequired,
    checkWarningElement: PropTypes.func,
};
ThreeScene.defaultProps = {
    isControlled: false,
    isWorkspace: false,
    isLoading: false,
    label: true,
    lines: false,
    scene: 0xe1e8ea,
    brush: null,
    line_color: 0xff0000,
    face_mono: false,
    face_color: 0xffffff,
    w: '300px',
    h: '300px',
    checkWarningElement: ()=>{}
};



export default withRouter(ThreeScene);


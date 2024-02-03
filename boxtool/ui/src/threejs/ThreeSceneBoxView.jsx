import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router"
import PropTypes from 'prop-types'
import {Grid, Popup} from 'semantic-ui-react'
import {OrbitControls} from './OrbitControls'
import * as THREE from 'three'

import Cube from './Cube'
import SVGLoader from "./SVGLoader"
import {TrackballControls} from './TrackballControls';
import {TransformControls} from "./TransformControls";

class ThreeSceneBoxView extends Component {

    constructor(props) {
        super(props);

        if (this.props.parent){
            this.props.parent.onCenter = this.centerForm;
            this.props.parent.toogleHelpers = this.toogleHelpers;
        }
        var loader = new SVGLoader();
        var {paths, root} = loader.parse(this.props.svg);
        this.cubes = new Cube(paths, {
            ...this.props, ...root
        }, this.props.svg);
        this.root = root;
    }


    toogleHelpers = (helpers) => {
        this.cubes.update_helpers(helpers);
    };

    centerForm = () => {
        this.controls.reset();
        this.orbitControls.reset();
        this.cubes.fitCameraToObject(this.camera);
    }

    handleRangeChange = (preset, property, value) => {
        this.cubes.fold(property, value);
    }

    onWindowResize = () => {
        const width = this.mount.clientWidth
        //const height = this.mount.clientHeight
        this.camera.aspect = width / width;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, width);
    }

    initControls = () => {
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.noRotate = !this.props.is3D;
        this.controls.noPan = !this.props.isControlled;
        this.controls.enabled = this.props.isControlled;
        this.orbitControls = new TransformControls(this.camera, this.renderer.domElement);
        this.orbitControls.attach(this.cubes.group);
        this.orbitControls.enablePan = false;
        this.orbitControls.enabled = false;
    }

    componentDidMount() {
        var width = this.mount.clientWidth
        var height = this.mount.clientHeight
        this.mount.addEventListener('resize', this.onWindowResize, false);
        //ADD SCENE
        this.scene = new THREE.Scene()
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
        //var VIEW_ANGLE = 70, ASPECT = width / height, NEAR = 1, FAR = 20000;
        //this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera = new THREE.PerspectiveCamera(
            44.387,
            width / height,
            1,
            1000000
        )

        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
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
        //     this.scene.add(new THREE.AxesHelper(5));
        //     this.scene.add(new THREE.BoxHelper(this.cubes.pivot));
        // }
        this.cubes.fitCameraToObject(this.camera);
        this.cubes.brushcontrols(this.camera, this.renderer, this.controls);
        this.cubes.dragcontrols(this.camera, this.renderer, this.controls);
        this.cubes.initCallback((e) => {
            if (this.props.onSelectLayer) this.props.onSelectLayer(e);
        }, (key, color) => {
            if (this.props.onBrush) this.props.onBrush(key, color);
        });

        if (this.props.selectedLayer)
            this.cubes.selectLayer(this.props.selectedLayer);

        this.cubes.updateLayers(this.props);

        this.camera.lookAt(this.cubes.pivot);
        this.start()
        this.onWindowResize();
        this.cubes.updateLayers({...this.props, is3D: !this.props.is3D});
    }

    componentDidUpdate(prevProps/*, prevState, snapshot*/) {
        if(!this.props.is3D){
            this.cubes.lines.forEach(line => {
                line.visible = true;
            });
        } else {
            this.cubes.lines.forEach(line => {
                line.visible = false;
            });
        }
        this.cubes.updateLayers(this.props);
        this.cubes.brushcontrols.enabled = false;
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

        if( !this.props.is3D ){
            this.cubes.pivot.rotation.z = 0;
            this.cubes.pivot.rotation.y = 0;
        }else{
            this.cubes.pivot.rotation.z = -2;
            this.cubes.pivot.rotation.y = 0;
            this.cubes.pivot.rotation.x = 14.17;
        }
        this.frameId = requestAnimationFrame(this.animate)
        this.renderScene()
        if (!this.props.is3D) {
            this.controls.update();
        }
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    switchRender = () => {
        // đang 3d
        if( !this.props.is3D ){
            this.props.on2D()
        }
        //đang 2d
        if( this.props.is3D ){
            this.props.on3D()
        }
    }

    render() {
        return (
            <Fragment>
                <Grid.Column style={{height:"100%"}} floated='left' width={this.props.config.presets ? 11 : this.props.is3D ? 16 : 11}>
                    <Popup
                        trigger={
                            <div
                                data-tip data-for="registerTip"
                                style={{ width: "100%", height: "100%" }}
                                ref={(mount) => { this.mount = mount }}
                                onClick={this.switchRender.bind(this)}
                            >
                            </div>
                        }
                        content='Click this to toggle the view between 2d or 3d'
                        position='left center'
                        inverted
                    />

                </Grid.Column>
            </Fragment>
        )
    }
}


ThreeSceneBoxView.propTypes = {
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
};
ThreeSceneBoxView.defaultProps = {
    isControlled: false,
    isWorkspace: false,
    label: true,
    lines: false,
    scene: 0xe1e8ea,
    brush: null,
    line_color: 0xff0000,
    face_mono: false,
    face_color: 0xffffff,
    w: '300px',
    h: '300px',
};



export default withRouter(ThreeSceneBoxView);

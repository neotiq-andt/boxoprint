import * as THREE from 'three';
import * as BufferGeometryUtils from "./utils/BufferGeometryUtils";
import {DragControls} from "./DragControls";
import {DragControlsNoMove} from "./DragControlsNoMove";
import _ from 'lodash';
import { LAYER_TYPE_SHAPE, SHAPE_TYPE, LAYER_TYPE_IMAGE, LAYER_TYPE_TEXT } from "../constants/index";

/*eslint no-unused-vars: "off" */
/*eslint no-lone-blocks: 'off' */


var extrudeSettings = {
    depth: -0.5,
//    amount: -0.5,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: -1,
    bevelSegments: 1,
    material: true
};

var extrudeSettingsClone = {
    depth: 0.01,
//    amount: -0.5,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: -1,
    bevelSegments: 1,
    material: true
};

var extrudeSettingsLine = {
    depth: 10,
    // bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1,
    material: true
};

var MAX = 2000,
    VAL = 1500,
    PPP = 72,
    RESOLUTION = 10,
    RESOLUTION_TEXT = 25.4 / PPP,
    MESH_EXTRUDED = 0,
    MESH_RECTO = 1,
    MESH_VERSO = 2,
    FALLOFF = 30,
    RATIO = 1.125;
var Cube = (function () {
    function Cube(paths, options, svg) {
        this.options = {line_color: 0xff0000, is3D: false, ...options};
        extrudeSettings.depth = this.options !== undefined && this.options.config !== undefined && this.options.config.thickness > 0 ? this.options.config.thickness * -1 : -0.5;
        this.is3D = this.options.is3D || false;
        this.offset = 1.25;
        this.initialize(svg);
        this.parse_shapes(paths);
        // console.log(this.faces3D);
        this.calculateBase(this.faces3D);

        var base = null;
        // if (_options.base.length && _faces[_options.base] != undefined) {
        //     var idx = _faces[_options.base];
        //     if (idx >= 0)
        //         base = cube.sides[idx];
        // }
        if (base == null) {
            base = this.faces3D[0];
            this.faces3D.forEach(face => {
                if (face.sideChildren2 > base.sideChildren2)
                    base = face;
            });
        }

        this.basef = base;
        this.buildCubeFrom(base);
        this.group.add(base);

        this.manage_texture(base);
        // if (this.options.isControlled) {
        //     this.options.user_config.front.forEach(item => {
        //         if (item.layer_type === 'text')
        //             this.addText(item, false);
        //         else if(item.layer_type === "picture")
        //             this.addImage(item, false);
        //     }, this)
        // }

        //https://stackoverflow.com/questions/28848863/threejs-how-to-rotate-around-objects-own-center-instead-of-world-center/28860849
        // todo: voir si on centre l'objet sur la base ?
        var box = new THREE.Box3();
        box.setFromObject(this.group);
        //box.getCenter(this.group.position).multiplyScalar(-1);
        this.group.translateX((box.min.x - box.max.x) / 2);
        this.group.translateY((box.max.y - box.min.y) / 2);
        this.group.translateZ((box.min.z - box.max.z) / 2);
    };

    Cube.prototype = {
        fitCameraToObject: function (camera, object, offset, controls) {
            offset = offset || 1.25;
            object = this.group;
            const boundingBox = new THREE.Box3();

            // get bounding box of object - this will be used to setup controls and camera
            boundingBox.setFromObject(object);
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            const size =  new THREE.Vector3();
            boundingBox.getSize(size);

            let cameraZ = 0;
            if (this.Zoom2D) {
                cameraZ = this.Zoom2D;
            }
            else{
                // get the max side of the bounding box (fits to width OR height as needed )
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2)); //Applied fifonik correction
                cameraZ *= offset; // zoom out a little so that objects don't fill the screen
                this.Zoom2D = cameraZ;
            }
            camera.position.z = cameraZ/22;

            const minZ = boundingBox.min.z;
            const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

            camera.far = cameraToFarEdge * 3;
            camera.updateProjectionMatrix();

            if (controls) {

                // set camera to rotate around center of loaded object
                controls.target = center;

                // prevent camera from zooming out far enough to create far plane cutoff
                controls.maxDistance = cameraToFarEdge * 2;

                controls.saveState();

            } else {

                //camera.lookAt(center)

            }
        },
        fitCameraToZoom: function (camera, is3D = false, zoom = 0, object, offset, controls) {
            let min = zoom*0.85/100;
            offset = this.offset - min
            object = this.group;
            const boundingBox = new THREE.Box3();
            boundingBox.setFromObject(object);
            // const center = new THREE.Vector3();
            // boundingBox.getCenter(center);
            const size =  new THREE.Vector3();
            boundingBox.getSize(size);
            let cameraZ = 0;
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2)); //Applied fifonik correction
            cameraZ *= offset; // zoom out a little so that objects don't fill the screen
            camera.position.z = cameraZ/22;

            // const minZ = boundingBox.min.z;
            // const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;
            //
            // camera.far = cameraToFarEdge * 3;
            // camera.updateProjectionMatrix();
            //
            // if (controls) {
            //     // set camera to rotate around center of loaded object
            //     controls.target = center
            //     // prevent camera from zooming out far enough to create far plane cutoff
            //     controls.maxDistance = cameraToFarEdge * 2;
            //     controls.saveState();
            // } else {
            //     //camera.lookAt(center)
            // }
        },

        initCallback: function (onSelect, onBrush) {
            this.onSelect = onSelect;
            this.onBrush = onBrush;
        },

        // selection du layer par la liste
        selectLayer: function(layer_name){
            this.selectedLayerName = layer_name;
            this.draggables.splice(0, this.draggables.length);

            if (this._selected)
                this._selected.material.visible = false;
            this._selected = null;
            if (this.selectedLayerName !== null) {
                this.group.children.forEach(item => {
                    if (item.app_layer && item.app_layer.layer_name === this.selectedLayerName) {
                        item.material.visible = true;
                        this._selected = item;
                        this.draggables.push(item)
                    }
                }, this);
            }
        },

        buildLayers: function() {
            this.img = 0;

            this._selected = null;
            for(var i = 0; i< this.group.children.length; ) {
                let item = this.group.children[i];
                if (item.app_layer)
                    this.group.remove(item);
                else
                    i++;
            }
            this.draggables.splice(0, this.draggables.length);
            this.layers = [];
            if (!this.options.user_config || !this.options.user_config.front) {
                console.log("Pb de configuration");
                return;
            }
            let orderLayers = [...this.options.user_config.front];
            orderLayers = orderLayers.sort((a, b) => (a.order > b.order) ? -1 : ((b.order > a.order) ? 1 : 0));
            this.initLayer(orderLayers);
        },

        initLayer: function (orderLayers) {
            this.layers = orderLayers.map(item => {
                if (item.layer_type === LAYER_TYPE_TEXT)
                    return {layer: item };
                else if (item.layer_type === LAYER_TYPE_SHAPE){
                    return {layer: item };
                }
                else if (item.layer_type === LAYER_TYPE_IMAGE) {
                    if (!item.properties.dataURL) return undefined;
                    this.img++;
                    let base_image = new Image();
                    base_image.src = item.properties.dataURL;
                    base_image.onload = () => {
                        this.img--;
                        if (this.img === 0)
                            this.update_texture();
                    };
                    return {layer: item, base_image}
                }
                return undefined;
            }, this);
        },

        fold: function (side, value) {
            let c = this.foldSideCall[side];
            c && c(value);
        },

        update_helpers:  function (display = false) {
            this.lines.forEach(line => {
                line.visible = display;
            });
            /*this.faces3D.forEach(face => {
                var mesh = face.children[MESH_EXTRUDED + 2];
                mesh.visible = display;
            });*/
        },

        updateLayers: function(info) {
            if (info.is3D){
                this.dragControls.enabled = false;
                this.group.children.forEach(item => {
                    if (item.app_layer)
                        item.material.visible = false;
                })
                if (!this.is3D) {
                    this.is3D = true;
                    var box1 = new THREE.Box3(); box1.setFromObject(this.basef.children[0]);
                    if (this.options.config && this.options.config.presets) {
                        var preset = this.options.config.presets["default"];
                        var preset_info = preset['0'];
                        for (var propertyName in preset_info) {
                            var a = preset_info[propertyName];
                            var c = this.foldSideCall[propertyName];
                            c && c(a);
                        }
                    }
                    var box = new THREE.Box3(); box.setFromObject(this.group);
                    this.group.translateZ(-this.group.position.z - (box.min.z - box.max.z) / 2);
                    this.tx = -(box1.min.x + box1.max.x) /2;
                    this.group.translateX(this.tx);
                }
            }else{
                if (this.is3D){
                    this.group.translateZ(-this.group.position.z);
                    this.group.translateX(-this.tx);
                    this.is3D = false;
                    for (var propName in this.foldSideCall) {
                        this.foldSideCall[propName](0);
                    }
                }
                this.dragControls.enabled = true;
            }
            this.options.brush = info.brush;
            this.buildLayers();
            if (this.img === 0)
                this.update_texture();
        },

        update_texture: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.options.user_config.front && (this.layers === null || this.layers === [] )) {
                let orderLayers = [...this.options.user_config.front];
                orderLayers = orderLayers.sort((a, b) => (a.order > b.order) ? -1 : ((b.order > a.order) ? 1 : 0));
                this.initLayer(orderLayers);
            }
            this.layers.forEach(item => {
                if (item.layer.layer_type === LAYER_TYPE_TEXT){
                    this.addText(item.layer);
                } else if (item.layer.layer_type === LAYER_TYPE_IMAGE){
                    this.addImage(item);
                } else if(item.layer.layer_type === LAYER_TYPE_SHAPE){
                    this.addShape(item);
                }
            }, this)
            this.texture.needsUpdate = true;
            this.checkWarningElement = this.check_warning_element()
        },
        getRotationCube: function(){
            const object = this.group;
            const boundingBox = new THREE.Box3();
            boundingBox.setFromObject(object);
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            const size =  new THREE.Vector3();
            boundingBox.getSize(size);
            boundingBox.getParameter(size);
            return this.group.parent.rotation
        },
        check_warning_element: function(){
            const width = this.canvas.width, height = this.canvas.height
            let arrLayer = []
            this.layers.forEach(item => {
                const {layer} = item;

                if (layer.layer_type === LAYER_TYPE_TEXT){
                    var lines = layer.properties.text.split('\n');
                    lines.forEach(line => {
                        var moveCenterX = layer.properties.x
                        var moveCenterY = layer.properties.y;
                        if( moveCenterX > width || moveCenterY > height || (moveCenterX < 0 || moveCenterY < 0 ) ){
                            arrLayer = arrLayer.concat([layer.layer_name]);
                        }
                    })
                }
                if (layer.layer_type === LAYER_TYPE_IMAGE){
                    var moveCenterX = layer.properties.x;     
                    var moveCenterY = layer.properties.y;
                    if( moveCenterX > width || moveCenterY > height  || (moveCenterX < 0 || moveCenterY < 0 ) ){
                        arrLayer = arrLayer.concat([layer.layer_name]);
                    }
                }
                if (layer.layer_type === LAYER_TYPE_SHAPE){
                    var moveCenterX = layer.properties.x;
                    var moveCenterY = layer.properties.y;
                    if( moveCenterX > width || moveCenterY > height  || (moveCenterX < 0 || moveCenterY < 0 ) ){
                        arrLayer = arrLayer.concat([layer.layer_name]);
                    }
                }
            })
            return arrLayer
        },
        addText: function(layer) {
            var update = false;
            this.group.children.forEach(item => {
                if (item.app_layer && item.app_layer.layer_name === layer.layer_name) {
                    update = true;
                }
            });

            var lines = layer.properties.text.split('\n');
            var lh = 0;
            this.context.font = layer.properties.font_style+' ' + layer.properties.font_weight+' ' + (layer.properties.font_size/0.2645833333)/2*7.2  + 'px ' + layer.properties.font_family;
            this.context.fillStyle = layer.properties.color;
            //this.context.scale(1,1);
            var testWidth = 0;
            let testHeight = 0;
            lines = lines.reverse()
            lines = _.compact(lines)
            lines = lines.map((item, index)=>{
                item = item.trim()
                if( index && index < lines.length ){
                    return ['',item]
                }
                return item
            })
            lines = _.flatten(lines)
            lines.forEach(line => {
                var metrics = this.context.measureText(line? line +'gb': '');
                testHeight += Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent)
                var metricWidth = this.context.measureText(line);
                if( line === '' ){
                    testHeight += (layer.properties.font_size -15) < 0 ? 0 : layer.properties.font_size -15
                }
                if (metricWidth.width > testWidth)
                    testWidth = metricWidth.width;
                lh += layer.properties.line_height;
            })
            var tmp_lh = lh;
            this.offsetText = new THREE.Vector2(testWidth/2, lh/2);

            var angleInRadians = THREE.Math.degToRad(layer.properties.rotate);
            this.context.rotate(angleInRadians);
            lines.forEach(line => {
                var moveCenterX = layer.properties.x
                var moveCenterY = layer.properties.y;

                var moveCenterRotX = (-moveCenterY * Math.sin(-angleInRadians) + moveCenterX * Math.cos(-angleInRadians))
                var moveCenterRotY = (moveCenterY * Math.cos(-angleInRadians) + moveCenterX * Math.sin(-angleInRadians))

                //this.context.fillText(line, moveCenterRotX-this.offsetText.y, moveCenterRotY + tmp_lh - this.offsetText.y);
                this.context.fillText(line, Math.round(moveCenterRotX-this.offsetText.x), Math.round(moveCenterRotY + testHeight / 3.5));
                tmp_lh -= layer.properties.line_height;
            })
            this.context.rotate(-angleInRadians);

            if (update === false){
                var material = new THREE.MeshLambertMaterial({
                    wireframe: true,
                    color: 'black',
                    visible: this.options.isControlled ? !this.is3D : false
                });
                var geometry = new THREE.PlaneGeometry(1, 1);
                var mesh = new THREE.Mesh(geometry, material);
                mesh.app_info = {face: "texture"}
                mesh.scale.set(testWidth, testHeight, 1)
                mesh.position.z = 0.4;
                mesh.position.x = Math.round(layer.properties.x)
                mesh.position.y = Math.round(layer.properties.y)
                layer.properties.scaleHeight = testHeight;

                mesh.app_layer = layer;
                mesh.range = {
                    w: testWidth / 2,
                    h: lh / 2
                }
                mesh.rotation.z = angleInRadians;

                if (!this.is3D && this.selectedLayerName && this.selectedLayerName === layer.layer_name) {
                    this._selected = mesh;
                    this._selected.material.visible = true;
                    this.draggables.push(mesh)
                } else
                    material.visible= false;

                var geometryDimension = new THREE.PlaneGeometry(2, 2);
                var materialDimension = new THREE.MeshLambertMaterial({
                    color: '0xdddddd',
                    visible: this.options.isControlled ? !this.is3D : false
                });

                var meshOne = new THREE.Mesh(geometryDimension, materialDimension);
                meshOne.app_info = {face: "texture_dimension"}
                meshOne.scale.set(4, 4, 1)
                meshOne.position.z = 0.4;
                meshOne.position.x = Math.round(layer.properties.x) - testWidth / 2
                meshOne.position.y = Math.round(layer.properties.y) - lh / 2 - 5
                meshOne.app_layer = {...layer, layer_name:'dimension_one_'+layer.layer_name}
                meshOne.range = {
                    w: 2,
                    h: 2
                }
                meshOne.rotation.z = angleInRadians;

                var meshTwo = new THREE.Mesh(geometryDimension, materialDimension);
                meshTwo.app_info = {face: "texture_dimension"}
                meshTwo.scale.set(4, 4, 1)
                meshTwo.position.z = 0.4;
                meshTwo.position.x = Math.round(layer.properties.x) + testWidth / 2
                meshTwo.position.y = Math.round(layer.properties.y) - lh / 2 - 5
                meshTwo.app_layer = {...layer, layer_name:'dimension_two_'+layer.layer_name}
                meshTwo.range = {
                    w: 2,
                    h: 2
                }
                meshTwo.rotation.z = angleInRadians;

                var meshThree = new THREE.Mesh(geometryDimension, materialDimension);
                meshThree.app_info = {face: "texture_dimension"}
                meshThree.scale.set(4, 4, 1)
                meshThree.position.z = 0.4;
                meshThree.position.x = Math.round(layer.properties.x) - testWidth / 2
                meshThree.position.y = Math.round(layer.properties.y) + lh / 2+5
                meshThree.app_layer = {...layer, layer_name:'dimension_three_'+layer.layer_name}
                meshThree.range = {
                    w: 2,
                    h: 2
                }
                meshThree.rotation.z = angleInRadians;

                var meshFour = new THREE.Mesh(geometryDimension, materialDimension);
                meshFour.app_info = {face: "texture_dimension"}
                meshFour.scale.set(4, 4, 1)
                meshFour.position.z = 0.4;
                meshFour.position.x = Math.round(layer.properties.x) + testWidth / 2
                meshFour.position.y = Math.round(layer.properties.y) + lh / 2+5
                meshFour.app_layer = {...layer, layer_name:'dimension_four_'+layer.layer_name}
                meshFour.range = {
                    w: 2,
                    h: 2
                }
                meshFour.rotation.z = angleInRadians;

                var meshMiddleTop = new THREE.Mesh(geometryDimension, materialDimension);
                meshMiddleTop.app_info = {face: "texture_dimension"}
                meshMiddleTop.scale.set(4, 4, 1)
                meshMiddleTop.position.z = 0.4;
                meshMiddleTop.position.x = Math.round(layer.properties.x)
                meshMiddleTop.position.y = Math.round(layer.properties.y) - lh / 2 - 5
                meshMiddleTop.app_layer = {...layer, layer_name:'dimension_middle_top_'+layer.layer_name}
                meshMiddleTop.range = {
                    w: 2,
                    h: 2
                }
                meshMiddleTop.rotation.z = angleInRadians;

                var meshMiddleBottom = new THREE.Mesh(geometryDimension, materialDimension);
                meshMiddleBottom.app_info = {face: "texture_dimension"}
                meshMiddleBottom.scale.set(4, 4, 1)
                meshMiddleBottom.position.z = 0.4;
                meshMiddleBottom.position.x = Math.round(layer.properties.x)
                meshMiddleBottom.position.y = Math.round(layer.properties.y) + lh / 2+5
                meshMiddleBottom.app_layer = {...layer, layer_name:'dimension_middle_bottom_'+layer.layer_name}
                meshMiddleBottom.range = {
                    w: 2,
                    h: 2
                }
                meshMiddleBottom.rotation.z = angleInRadians;

                if (!this.is3D && this.selectedLayerName && this.selectedLayerName === layer.layer_name) {
                    if( 'dimension_one_'+this.selectedLayerName === 'dimension_one_'+layer.layer_name ){
                        console.log('gggggggggggg-ggggggggggg------------')
                        this._selected = meshOne;
                        this._selected.material.visible = true;
                        this.draggables.push(meshOne)
                    }
                }else{
                    meshOne.visible= false;
                    meshTwo.visible= false;
                    meshThree.visible= false;
                    meshFour.visible= false;
                    meshMiddleTop.visible= false;
                    meshMiddleBottom.visible= false;
                }

                this.group.add(meshOne);
                this.group.add(meshTwo);
                this.group.add(meshThree);
                this.group.add(meshFour);
                this.group.add(meshMiddleTop);
                this.group.add(meshMiddleBottom);

                this.group.add(mesh);
            }
            else{
                this.group.children.forEach(item=> {
                    //move
                    if (item.app_layer && item.app_layer.layer_name === 'dimension_one_'+layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }
                        item.position.x = Math.round(layer.properties.x) - testWidth / 2
                        item.position.y = Math.round(layer.properties.y) - lh / 2 - 5
                        item.rotation.z = angleInRadians;
                    }
                    if (item.app_layer && item.app_layer.layer_name === 'dimension_two_'+layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }
                        item.position.x = Math.round(layer.properties.x) + testWidth / 2
                        item.position.y = Math.round(layer.properties.y) - lh / 2 - 5
                        item.rotation.z = angleInRadians;
                    }
                    if (item.app_layer && item.app_layer.layer_name === 'dimension_three_'+layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }
                        item.position.x = Math.round(layer.properties.x) - testWidth / 2
                        item.position.y = Math.round(layer.properties.y) + lh / 2+5
                        item.rotation.z = angleInRadians;
                    }
                    if (item.app_layer && item.app_layer.layer_name === 'dimension_four_'+layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }
                        item.position.x = Math.round(layer.properties.x) + testWidth / 2
                        item.position.y = Math.round(layer.properties.y) + lh / 2+5
                        item.rotation.z = angleInRadians;
                    }
                    if (item.app_layer && item.app_layer.layer_name === 'dimension_middle_top_'+layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }
                        item.position.x = Math.round(layer.properties.x)
                        item.position.y = Math.round(layer.properties.y) - lh / 2 - 5
                        item.rotation.z = angleInRadians;
                    }
                    if (item.app_layer && item.app_layer.layer_name === 'dimension_middle_bottom_'+layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }
                        item.position.x = Math.round(layer.properties.x)
                        item.position.y = Math.round(layer.properties.y) + lh / 2+5
                        item.rotation.z = angleInRadians;
                    }
                    if (item.app_layer && item.app_layer.layer_name === layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }

                        item.range = {
                            w: testWidth / 2,
                            h: lh / 2
                        }
                        item.position.x = Math.round(layer.properties.x);
                        item.position.y = Math.round(layer.properties.y);
                        item.scale.set(testWidth, testHeight, 1);
                        item.rotation.z = angleInRadians;
                    }
                }, this);
            }
            //this.texture.needsUpdate = true;
        },
        addImage: function(item) {
            var layer = item.layer;
            if (!layer.properties.dataURL) return;

            var update = false;
            this.group.children.forEach(item => {
                if (item.app_layer && item.app_layer.layer_name === layer.layer_name) {
                    update = true;
                }
            });

            var offsetImage = new THREE.Vector2(layer.properties.width / 2, layer.properties.height / 2);
            var angleInRadians = THREE.Math.degToRad(layer.properties.rotate);
            var moveCenterX = layer.properties.x;
            var moveCenterY = layer.properties.y;
            var offsetImageX = (offsetImage ? offsetImage.x : 0);
            var offsetImageY = (offsetImage ? offsetImage.y : 0);

            var moveCenterRotX = (-moveCenterY * Math.sin(-angleInRadians) + moveCenterX * Math.cos(-angleInRadians))
            var moveCenterRotY = (moveCenterY * Math.cos(-angleInRadians) + moveCenterX * Math.sin(-angleInRadians))

            this.context.rotate(angleInRadians);
            this.context.drawImage(item.base_image,
                Math.round(moveCenterRotX - offsetImageX), Math.round(moveCenterRotY - offsetImageY),
                layer.properties.width, layer.properties.height);
            this.context.rotate(-angleInRadians);

            if (update === false) {
                var material = new THREE.MeshLambertMaterial({
                    wireframe: true,
                    color: 'black',
                    // transparent: true,
                    visible: this.options.isControlled ? !this.is3D : false
                });

                var geometry = new THREE.PlaneGeometry(1, 1);
                var mesh = new THREE.Mesh(geometry, material);
                mesh.scale.set(layer.properties.width, layer.properties.height, 1);
                const toto = new THREE.Box3().setFromObject(mesh);

                mesh.app_info = {
                    face: "texture"
                }
                mesh.rotation.z = angleInRadians;

                mesh.position.z = 0.4;
                mesh.position.x = Math.round(layer.properties.x);// + (layer.properties.width / 2);
                mesh.position.y = Math.round(layer.properties.y);// - (layer.properties.height / 2);
                mesh.app_layer = layer;
                mesh.range = {
                    w: layer.properties.width / 2,
                    h: layer.properties.height / 2
                }

                if (!this.is3D && this.selectedLayerName && this.selectedLayerName === layer.layer_name) {
                    this._selected = mesh;
                    this._selected.material.visible = true;
                    this.draggables.push(mesh)
                } else
                    material.visible = false;

                this.group.add(mesh);
            } else {
                this.group.children.forEach(item => {
                    if (item.app_layer && item.app_layer.layer_name === layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }

                        item.range = {
                            w: layer.properties.width / 2,
                            h: layer.properties.height / 2
                        }
                        // item.position.set(0, 0, 0)
                        // item.rotation.z = angleInRadians;

                        item.position.x = Math.round(layer.properties.x);// + item.range.w;
                        item.position.y = Math.round(layer.properties.y);// - item.range.h;
                        item.position.z = 0.4;

                        item.scale.set(layer.properties.width, layer.properties.height, 1);
                        item.rotation.z = angleInRadians;
                    }
                }, this);
            }

        },
        addShape: function(item) {
            var layer = item.layer;
            // if (!layer.properties.dataURL) return;

            var update = false;
            this.group.children.forEach(item => {
                if (item.app_layer && item.app_layer.layer_name === layer.layer_name) 
                    update = true;
            });

            var offsetImage = new THREE.Vector2(layer.properties.width / 2, layer.properties.height / 2);
            var angleInRadians = THREE.Math.degToRad(layer.properties.rotate);

            var moveCenterX = layer.properties.x;
            var moveCenterY = layer.properties.y;
            var offsetImageX = (offsetImage ? offsetImage.x : 0);
            var offsetImageY = (offsetImage ? offsetImage.y : 0);

            var moveCenterRotX = (-moveCenterY * Math.sin(-angleInRadians) + moveCenterX * Math.cos(-angleInRadians));
            var moveCenterRotY = (moveCenterY * Math.cos(-angleInRadians) + moveCenterX * Math.sin(-angleInRadians));

            this.context.beginPath();
            if(layer.properties.shapeType === SHAPE_TYPE.circle){
                this.context.arc(Math.round(moveCenterRotX - offsetImageX + layer.properties.width / 2), Math.round(moveCenterRotY - offsetImageY + layer.properties.width / 2), layer.properties.width / 2, 0, 2 * Math.PI);
            }else if(layer.properties.shapeType === SHAPE_TYPE.triangle){
                let height = 200 * Math.cos(Math.PI / 6);
                this.context.beginPath();
                this.context.moveTo(100, 300);
                this.context.lineTo(300, 300);
                this.context.lineTo(200, 300 - height);
                this.context.closePath();

                // the outline
                this.context.lineWidth = 10;
                this.context.strokeStyle = '#666666';
                this.context.stroke();

                // the fill color
                this.context.fillStyle = "#FFCC00";
                this.context.fill();
            }else{
                this.context.rect(Math.round(moveCenterRotX - offsetImageX), Math.round(moveCenterRotY - offsetImageY),
                layer.properties.width, layer.properties.height);
            }
            this.context.lineWidth = layer.properties.lineWidth;
            this.context.strokeStyle = layer.properties.color;
            this.context.fillStyle = layer.properties.color;

            layer.properties.stroke ? this.context.stroke() : this.context.fill();
            
            if (update === false) {
                var material = new THREE.MeshLambertMaterial({
                    wireframe: true,
                    color: 'black',
                    // transparent: true,
                    visible: this.options.isControlled ? !this.is3D : false
                });

                var geometry = new THREE.PlaneGeometry(1, 1);
                var mesh = new THREE.Mesh(geometry, material);
                mesh.scale.set(layer.properties.width, layer.properties.height, 1);
                mesh.app_info = {
                    face: "texture"
                }
                mesh.rotation.z = angleInRadians;
                mesh.position.z = 0.4;
                mesh.position.x = Math.round(layer.properties.x);// + (layer.properties.width / 2);
                mesh.position.y = Math.round(layer.properties.y);// - (layer.properties.height / 2);
                mesh.app_layer = layer;
                mesh.range = {
                    w: layer.properties.width / 2,
                    h: layer.properties.height / 2
                }

                if (!this.is3D && this.selectedLayerName && this.selectedLayerName === layer.layer_name) {
                    this._selected = mesh;
                    this._selected.material.visible = true;
                    this.draggables.push(mesh)
                } else{
                    material.visible = false;
                }   
                this.group.add(mesh);
            } else {
                this.group.children.forEach(item => {
                    if (item.app_layer && item.app_layer.layer_name === layer.layer_name) {
                        if (this.selectedLayerName && this.selectedLayerName === item.app_layer.layer_name) {
                            this._selected = item;
                            this._selected.material.visible = true;
                        }

                        item.range = {
                            w: layer.properties.width / 2,
                            h: layer.properties.height / 2
                        }
                        // item.position.set(0, 0, 0)
                        // item.rotation.z = angleInRadians;

                        item.position.x = Math.round(layer.properties.x);// + item.range.w;
                        item.position.y = Math.round(layer.properties.y);// - item.range.h;
                        item.position.z = 0.4;

                        item.scale.set(layer.properties.width, layer.properties.height, 1);
                        item.rotation.z = angleInRadians;
                    }
                }, this);
            }
        },
        createMeshShape: function(mesh, properties){

        },
        resizeCanvasImage: function(img, dx, dy, maxWidth, maxHeight, width, height, step) {
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            if (img.width * step > width) { // For performance avoid unnecessary drawing
                var mul = 1 / step;
                var cur = {
                    width: Math.floor(img.width * step),
                    height: Math.floor(img.height * step)
                }

                oc.width = cur.width;
                oc.height = cur.height;

                octx.drawImage(img, 0, 0, cur.width, cur.height);

                while (cur.width * step > width) {
                    cur = {
                        width: Math.floor(cur.width * step),
                        height: Math.floor(cur.height * step)
                    };
                    octx.drawImage(oc, 0, 0, cur.width * mul, cur.height * mul, 0, 0, cur.width, cur.height);
                }

                this.context.drawImage(oc, dx, dy);
            } else {
                this.context.drawImage(img, dx, dy);
            }

        },
        brushcontrols: function(camera, renderer, controls) {
            this.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            var that = this;
            //console.log(this.brushables);
            this.brushcontrols = new DragControlsNoMove(this.brushables, camera, renderer.domElement);
            this.brushcontrols.enabled = true;
            var has_focus = false;
            var hover_func = function (event) {
                // si c'est une face & quele brush est activé.
                setTimeout(() => {
                    has_focus = true;
                    if (that.options.brush !== null && !that.is3D) {
                        renderer.domElement.style.cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADqklEQVRIS+2VTWhdRRTHz7lzZubem/eS18QPjEEQrQvFRZ+6UCsVqoKtaPADujFUF5F0ZfG7YFva0oK06KZWXITWVitWKym4sEGpCNIoClYQNcGFUsEHib68vHvnzteVG6KU5r7XLLp0tvOf85vzP2fOIHReEQCoMAyvc85tyPN8o3PuqkLOGJtHxI+NMYcBoN0lBmDZZhRFTyiltjPGfgOA1US0Tyk1CQB/A4ADgJoQYhQAbtJaPwkAvhNkGYBzPuK9H+Wc/2CMuR0RdZ7n5zjnJ5RSXxVZLQWLEXFSSrlNKfXFSgEhEU1Za9cwxg4yxs5rrffEcVxXSh0HAJJSjqRpWoByKeWzzjlhrX1tJQAiog8RccIYcwQAJvr7+1+am5v78d/DRHQvIj6U5/nN3vspIkLv/YK1dv8lAWEY3qO1Hvfe3wIAFSI6Za1d2+Egl1Luy7JsjHP+njHmdQCYAQB9sf6/GhSWVCqV8Waz+S0R3R0Ewf1a652dbiaEuNVaexQRtyHiHkScMsaMdQL0EdFJa+36ogs555PGmB0A8GUZoK+vb1WSJG8yxt5aKjAxxk465x4uBUgpx4wxV3jvd1er1bWtVusgAKwpa784jq9RSp3mnI9nWVZYs/Q0FgGPlAE4Ip4Jw/CFojsYYx9EUXTIWuucc8cQ8f3BwcG9jUbjLqVUYd1GIcT2JElOXRBMENGEtfbBMsDViPhpvV6/Y3p6+rYkSZ631j5erVafXlhY2J/n+WKdEDGN43hzu90+XWJbL+f8bWPMpmUAKeVq59wbQRC8aIz5nHO+Tmv9UxEzjuMC+AsApABgOhU8DMPN1toBa+2BZYBi1hhj3kFE7Onp2dVsNj/rNltK9kQQBN8xxp4yxnxTZhEr2hIA9jrnbBzHu9vt9oohRHQfAOyy1q4ry3LR397e3hvn5+d/r1Qqd6ZpugURr8zz/LCUcjJJkj+6ZcQ5PyKEONBut8+V6TCKomvTND0rhHhZa/3ukiiM4/jVJEm2hmF4fGhoaMvMzEx2cYBarfZoq9Uads6NdBwVRPRcEASrvPd1a+2GC4VRFA1lWTYcBMEDeZ7/RUQnsiz7pBh0xUv23h8iohGl1K/dAGettcOMsR0DAwM7G43Gn2XiMAzXG2OKkeCFEMe01puiKBpttVo/d7MQiehrKeUrSqlnarXa1tnZ2fNdDgghxA2IeH2WZd8DQDftYpiiBo+laXqUc/6RMab4nS7rKv0yLyfhf8Al3fwH19egKIbd+hcAAAAASUVORK5CYII="),auto';
                        return;
                    }
                    renderer.domElement.style.cursor = 'auto';
                }, 1);
            };
            var hover2_func = function (event) {
                has_focus = false;
                setTimeout(() => {
                    renderer.domElement.style.cursor = 'auto';
                }, 1);
            };
            var hover3_func = function (event) {
                if (has_focus) return hover_func();
                setTimeout(() => {
                    renderer.domElement.style.cursor = 'auto';
                }, 1);
            };
            this.brushcontrols.addEventListener('dragstart', function(event){
                if (that.options.brush !== null){
                    if (that._selected) {
                        that._selected.material.visible = false;
                        that.onSelect();
                    }
                    // that._selected = null;
                    that.onBrush(event.object.app_info.id, that.options.brush);
                    event.object.material[2].color.set(that.options.brush);
                    //event.object.material[1].color.set(that.options.brush);
                    event.object.material[0].color.set(that.options.brush);
                }
            });
            this.brushcontrols.addEventListener('drag', hover_func);
            this.brushcontrols.addEventListener('hoveron', hover_func);

            this.brushcontrols.addEventListener('hoveroff', hover2_func);
            this.brushcontrols.addEventListener('dragend', hover3_func);
        },
        dragcontrols: function(camera, renderer, controls) {
            var that  = this;
            this.dragControls = new DragControls(this.draggables, camera, renderer.domElement); // objects contients la listes des meshs à controler
            this.dragControls.addEventListener('dragstart', function (event) {
                if(!that.dragControls.enabled) return;
//                that.onSelect(event.object.app_layer.layer_name);
//                if (that._selected) that._selected.material.color.setHex('0x000000');
//                that._selected = event.object;
//                that._selected.material.color.setHex('0xff0000');
                controls.enabled = false;
                that.current_z = event.object.position.z;
                // console.log('dragstart');
            });

            this.dragControls.addEventListener('drag', function (event) {
                event.object.app_layer.properties.x = Math.round((event.object.position.x ) * 100) / 100;
                event.object.app_layer.properties.y = Math.round((event.object.position.y ) * 100) / 100;
                that.update_texture();
            });

            this.dragControls.addEventListener('dragend', function (event) {
                if (!that.dragControls.enabled) return;
                controls.enabled = true;
                event.object.app_layer.properties.x = Math.round((event.object.position.x ) * 100) / 100;
                event.object.app_layer.properties.y = Math.round((event.object.position.y ) * 100) / 100;
                event.object.position.z = that.current_z;
                that.update_texture();
                // console.log('dragend');
            });
        },
        initialize: function(svg){
            // svg = svg.replace('meet', 'slice');
            // svg = svg.replace(/stroke\s*=\s*"[^"]*"/g, '');

            this.group = new THREE.Group();
            this.group.scale.multiplyScalar(0.1);
            this.group.scale.y *= -1;

            this.foldSideCall = {};
            this.pivot = new THREE.Group();
            this.pivot.add(this.group);
            this.canvas = document.createElement("CANVAS");

            // this.canvas.width = this.options.base.width * RESOLUTION;
            // this.canvas.height = this.options.base.height * RESOLUTION;
            this.canvas_draw = [];


            this.texture = new THREE.CanvasTexture(this.canvas);
            //document.body.insertBefore(this.canvas, document.body.firstChild);

            this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
            this.texture.flipY = false;


            this.faces3D = [];
            this.faces2D = [];

            this.draggables = [];
            this.brushables = [];

            this.lines = [];
            this.material_line = new THREE.LineBasicMaterial({
                color: 0xff0000,
                linewidth: 10,
                dashSize: 10,
                gapSize: 10,
                side: THREE.DoubleSide
            });
        },


        manage_texture: function(base) {
            const working_box = new THREE.Box3().setFromObject(this.group);
            // console.log(working_box);
            const range = new THREE.Vector2((working_box.max.x - working_box.min.x) * RESOLUTION, (working_box.max.y - working_box.min.y) * RESOLUTION);
            const offset_box = new THREE.Vector2(0 - working_box.min.x * RESOLUTION, 0 - working_box.min.y * RESOLUTION);
            const offset = new THREE.Vector2(offset_box.x, (range.y - offset_box.y));

            range.x = range.x - offset.x;
            range.y = range.y - offset.y;
            if (!this.canvas_init){
                this.canvas.width = range.x;
                this.canvas.height = range.y;
                this.context = this.canvas.getContext("2d");
                this.context.imageSmoothingQuality = "high";
                this.canvas_init = true;
            }


            this.faces3D.forEach(group => {
                const mesh = group.children[MESH_RECTO + 1];
                mesh.material.normalMapType = THREE.ObjectSpaceNormalMap;
                const material = mesh.material;
                const geometry = mesh.geometry;
                geometry.computeBoundingBox();

                // var max = geometry.boundingBox.max,
                //     min = geometry.boundingBox.min;
                //var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
                //var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
                material.map = this.texture;
                const uvAttribute = geometry.getAttribute("uv");
                const uvArray = uvAttribute.array;
                for (let i = 0; i < uvAttribute.count; i++) {
                    uvArray[i * 2 ] = uvArray[i * 2]/range.x;
                    uvArray[i * 2 + 1] = uvArray[i * 2 + 1]/range.y;
                }
                /*var faces = geometry.faces;
                for (var i = 0; i < faces.length; i++) {

                    var v1 = geometry.vertices[faces[i].a],
                        v2 = geometry.vertices[faces[i].b],
                        v3 = geometry.vertices[faces[i].c];

                    geometry.faceVertexUvs[0].push([
                        new THREE.Vector2((v1.x ) / range.x, (v1.y ) / range.y),
                        new THREE.Vector2((v2.x ) / range.x, (v2.y ) / range.y),
                        new THREE.Vector2((v3.x ) / range.x, (v3.y ) / range.y)
                    ]);
                }*/
                geometry.uvsNeedUpdate = true;
            });

        },

        merge_geometry: function (geometry1, geometry2) {
            //var mesh1 = new THREE.Mesh(geometry1);
            //var mesh2 = new THREE.Mesh(geometry2);
            var groupGeometry = [geometry1, geometry2]
            var singleGeometry = new BufferGeometryUtils.mergeBufferGeometries(groupGeometry, true);
            //mesh1.updateMatrix(); // as needed
            //singleGeometry.merge(mesh1.geometry, mesh1.matrix);

            //mesh2.updateMatrix(); // as needed
            //singleGeometry.merge(mesh2.geometry, mesh2.matrix);
            return singleGeometry;
        },

        parse_shapes: function (paths) {
            paths.forEach((path, pidx) => {
                var shapes = path.toShapes(true);
                var props_shape = {
                    group: null,
                    geometry2D: null,
                    geometry3D: null
                };
                shapes.forEach((shape, sidx) => {
                    if (sidx > 0 || shape.curves.length > 1) {
                        var geometry3D = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                        var geometry3DClone = new THREE.ExtrudeGeometry(shape, extrudeSettingsClone);
                        var geometry2D = new THREE.ShapeGeometry(shape);
                        if (path.label && path.label.startsWith("Line")) {
                            console.log(geometry3D);
                            var mesh = new THREE.Mesh(geometry2D, new THREE.MeshLambertMaterial({
                                transparent: true
                            }));
                            mesh.p = {
                                "x": path.currentPath.curves[0].v0.x,
                                "y": path.currentPath.curves[1].v2.y
                            };
                            mesh.index = this.lines.length;
                            mesh.faces = [];
                            this.lines.push(mesh);
                        } else {
                            if (sidx === 0) {
                                props_shape.geometry2D = geometry2D;
                                props_shape.geometry3D = geometry3D;
                                props_shape.geometry3DClone = geometry3DClone;
                                props_shape.group = new THREE.Group();
                                props_shape.group.label = path.label || ('' + (this.faces3D.length + 1));
                                props_shape.group.index = this.faces3D.length;
                                props_shape.group.lines = [];
                                props_shape.group.sideChildren2 = 0;
                                this.faces3D.push(props_shape.group);
                            }
                            else {
                                // la face est composée d'une forme complexe
                                // donc on merge les geometries en 1 seule
                                props_shape.geometry2D = this.merge_geometry(props_shape.geometry2D, geometry2D);
                                props_shape.geometry3D = this.merge_geometry(props_shape.geometry3D, geometry3D);
                                props_shape.geometry3DClone = this.merge_geometry(props_shape.geometry3DClone, geometry3DClone);
                            }
                        }
                    } else {
                        // on est sur la definition d'une ligne pour le pliage
                        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettingsLine);
                        var line = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                            color: 0xff0000,
                            side: THREE.DoubleSide
                        }));
                        line.visible = true;
                        line.p = {
                            "x": line.geometry.attributes.position.getX(0) === line.geometry.attributes.position.getX(1) ? line.geometry.attributes.position.getX(0) : 0,
                            "y": line.geometry.attributes.position.getY(0) === line.geometry.attributes.position.getY(1) ? line.geometry.attributes.position.getY(0) : 0
                        };
                        line.geometry.attributes.position.array[2] = 1;
                        line.geometry.attributes.position.array[5] = 1;
                        line.index = this.lines.length;
                        line.faces = []; // init le tableau qui contiendra les faces liées pour le pliage
                        this.lines.push(line);
                    }
                });
                if (props_shape.group){
                    props_shape.group.initial_color = path.color;
                    var materialTop = new THREE.MeshLambertMaterial({
                        color: 0xdddddd,
                        transparent:true,
                        side: THREE.BackSide
                    });
                    var materialBottom = new THREE.MeshLambertMaterial({
                        color: 0xdddddd,
                        transparent:true,
                        side: THREE.FrontSide
                    });
                    var materialSide = new THREE.MeshLambertMaterial({
                        color: 0xdddddd,
                        transparent:true,
                        side: THREE.DoubleSide
                    });
                    var materialClone = new THREE.MeshLambertMaterial({
                        color: 0xdddddd,
                        transparent:true,
                        side: THREE.DoubleSide
                    });
                    let materials = [
                        materialTop, // top
                        materialSide, // side
                        materialBottom, // back
                    ];
                    // props_shape.geometry3D = this.bender(props_shape.geometry2D, "z", 10);
                    // on créé la mesh 2D & extructed de la face qu'on ajoute groupe
                    // qui contient des metas info (label, coleur, ...)
                    const materialBack = { start: 0, count: props_shape.geometry3D.groups[ 0 ].count / 2, materialIndex: 0 };
                    const materialFront = { start: props_shape.geometry3D.groups[ 0 ].count / 2, count: props_shape.geometry3D.groups[ 0 ].count, materialIndex: 2 };
                    props_shape.geometry3D.groups = [ materialBack, materialFront, props_shape.geometry3D.groups[ 1 ] ];
                    var mesh = new THREE.Mesh(props_shape.geometry3D, materials);
                    var meshClone = new THREE.Mesh(props_shape.geometry3DClone, materialClone);
                    meshClone.position.z = 0 - this.options && this.options.config && this.options.config.thickness ? this.options.config.thickness : 0 - 2;
                    // meshClone.visible = false;

                    mesh.m2D = new THREE.Mesh(props_shape.geometry2D, new THREE.MeshLambertMaterial({
                        transparent: true
                    }));

                    if (this.options.user_config.colors && this.options.user_config.colors.hasOwnProperty(props_shape.group.label)) {
                        materialBottom.color.set(this.options.user_config.colors[props_shape.group.label]);
                        materialTop.color.set(this.options.user_config.colors[props_shape.group.label]);
                    }
                    mesh.app_info= {face: "extruded", id: props_shape.group.label}
                    mesh.m2D.app_info = {
                        face: "front"
                    }
                    this.brushables.push(mesh);
                    props_shape.group.add(mesh);
                    props_shape.group.add(meshClone);
                    mesh.m2D.position.z = 0.02;
                    props_shape.group.add(mesh.m2D);

                    const edges = new THREE.BufferGeometry(props_shape.geometry2D);
                    const edgesMaterial = new THREE.LineBasicMaterial({
                        color: 0x000000
                    });

                    var border = new THREE.LineSegments(edges, edgesMaterial);
                    border.position.z= 0.021
                    props_shape.group.add(border);

                }

            })
        },

        /**
         * Plie la face de 'angle'° en fonction de l'axe auto déterminé
         */
        foldSide: function (pivot, angle) {
            if (!pivot.config) return;
            if (pivot.config.ax.y)
                pivot.rotation.y = THREE.Math.degToRad(angle);
            if (pivot.config.ax.x)
                pivot.rotation.x = THREE.Math.degToRad(angle);
            //render();
        },

        /**
         * Fonction permettant de mettre la face dans un object
         * afin de lui permttre de pivoter sur le bon axe.
         * Ajoute une entrée dans l'interface pour piloter l'angle.
         */
        createPivot: function (base, side, line) {
            let pivot = new THREE.Object3D();
            side.position.x = -line.p.x;
            pivot.position.x = line.p.x;
            side.position.y = -line.p.y;
            pivot.position.y = line.p.y;
            if (line.p.x !== 0)
                pivot.config = {
                    ax: {
                        y: 1
                    }
                };
            if (line.p.y !== 0)
                pivot.config = {
                    ax: {
                        x: 1
                    }
                };

            pivot.add(side);
            let l = "" + side.label + " sur " + base.label;
            this.foldSideCall[l] = (value) => {
                this.foldSide(pivot, value);
            };
            /*
            cube.sideUI2[l] = 0;
            let c = cube.foldUI.add(cube.sideUI2, l, -180, 180);
            c.onChange(function (value) {
                foldSide(pivot, value);
            });
            c.onFinishChange(function (value) {
                foldSide(pivot, value);
            });
*/
            return pivot;
        },

        /**
         * Ajoute la dépendance entre les faces
         */
        buildCubeFrom: function (base) {
            for (var l = 0; base.lines.length > l; l++) {
                var line = base.lines[l];
                if (line.done)
                    continue;

                line.done = true;
                for (var s = 0; line.faces.length > s; s++) {
                    var face = line.faces[s];
                    if (face.index !== base.index) {
                        line.geometry.translate(0, 0, 0.05);
                        base.add(line);
                        base.add(this.createPivot(base, face, line));
                        this.buildCubeFrom(face);
                    }
                }
            }
        },

        //==================================================================================
        //
        //==================================================================================

        /**
         * Affiche un texte au centre d'une face (avec un recule de 1 sur z pour etre visible)
         */
        printText: function (face, msg) {
            var color = 0x000000;
            var matDark = new THREE.LineBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });

            var bbox = new THREE.Box3().setFromObject(face);
            var size = Math.min((bbox.max.x - bbox.min.x), (bbox.max.y - bbox.min.y), 25) - 5;
            if (size <= 0)
                size = 5;

            var shapes = this.font.generateShapes('' + msg, size);
            var tgeometry = new THREE.ShapeBufferGeometry(shapes);
            tgeometry.computeBoundingBox();
            var maxy = (tgeometry.boundingBox.max.y - tgeometry.boundingBox.min.y) / 2;
            var maxx = (tgeometry.boundingBox.max.x - tgeometry.boundingBox.min.x) / 2 + 5;

            tgeometry.translate(bbox.min.x + (bbox.max.x - bbox.min.x) / 2 - maxx,
                bbox.min.y + (bbox.max.y - bbox.min.y) / 2 - maxy, -1.06);

            var text = new THREE.Mesh(tgeometry, matDark);
            face.add(text);
            //cube.labels.push(text);
        },


        /**
         * Fonction permettant de dire si [AB] contient [CD]
         */
        validateDistance: function (a, b, c, d) {
            var ab = a.distanceTo(b);
            var cd = c.distanceTo(d);

            var ac = a.distanceTo(c);
            var ad = a.distanceTo(d);
            if (ac > ad) {
                var cb = c.distanceTo(b);
                return ((ad + cd + cb) === ab);
            } else {
                var db = d.distanceTo(b);
                return ((ac + cd + db) === ab);
            }
        },

        tripleProduct: function(a, b, c) {
            return a.clone().dot(
                (new THREE.Vector3()).crossVectors(b, c)
            );
        },
        /**
         * Fonction permettant de vérifier que la ligne servant d'axe de pliage
         * se trouve sur une arrête d'une face
         */
        calculateLine: function (a, b, line) {
            // var c = new THREE.Vector3(line.geometry.attributes.position.getX(0), line.geometry.attributes.position.getY(0), line.geometry.attributes.position.getZ(0));
            var c = new THREE.Vector3(line.geometry.attributes.position.getX(0), line.geometry.attributes.position.getY(0), 0);
            // var d = new THREE.Vector3(line.geometry.attributes.position.getX(1), line.geometry.attributes.position.getY(1), line.geometry.attributes.position.getZ(1));
            var d = new THREE.Vector3(line.geometry.attributes.position.getX(1), line.geometry.attributes.position.getY(1), 0);

            var ab = b.clone().sub(a);
            var ac = c.clone().sub(a);
            var ad = d.clone().sub(a);

            // On vérifie qu'on est sur le même plan
            if (this.tripleProduct(ab, ac, ad) === 0) {
                // On vérifie que les vecteurs sont colinéaires
                if (((ab.x * ac.y) - (ab.y * ac.x) === 0) &&
                    ((ab.x * ad.y) - (ab.y * ad.x) === 0)) {
                    // on vérifie que les lignes se superposent
                    var d_ab = a.distanceTo(b);
                    var d_cd = c.distanceTo(d);

                    if (d_ab >= d_cd) {
                        return {
                            match: this.validateDistance(a, b, c, d),
                            diff: (d_ab === d_cd) ? 0 : 1
                        };
                    } else {
                        return {
                            match: this.validateDistance(c, d, a, b),
                            diff: -1
                        };
                    }
                }
            }
            return {
                match: false
            };
        },

        /**
         * Cette fonction recherche si l'arête de la face match
         * avec une ligne décrite pour le pliage
         */
        checkFoldLine: function (a, b) {
            for (var i = 0; this.lines.length > i; i++) {
                var line = this.lines[i];
                var info = this.calculateLine(a, b, line);
                if (info.match) {
                    // 0 meme longueur
                    // 1 line plus petite
                    // -1 line plus grande
                    info.line = line;
                    return info;
                }
            }
            return {
                match: false
            };
        },
        /**
         * Cette fonction permet de trouver les dependances entre les faces
         * et les lignes servant pour le pliage
         *
         * La face avec le plus de lignes de pliage sera la face de base
         * (sauf si une autre base est définie)
         */
        calculateBase: function(faces) {
            //
            faces.forEach(side => {
                //for (var g = 0; side.children.length > g; g++) {
                var mesh = side.children[MESH_EXTRUDED];
                var f = new THREE.Vector3(mesh.m2D.geometry.attributes.position.getX(0), mesh.m2D.geometry.attributes.position.getY(0), mesh.m2D.geometry.attributes.position.getZ(0));
                var l = 0;
                for (var j = 0; mesh.m2D.geometry.attributes.position.count > (j + 1); j++) {
                    var a = new THREE.Vector3(mesh.m2D.geometry.attributes.position.getX(j), mesh.m2D.geometry.attributes.position.getY(j), mesh.m2D.geometry.attributes.position.getZ(j));
                    l = new THREE.Vector3(mesh.m2D.geometry.attributes.position.getX(j+1), mesh.m2D.geometry.attributes.position.getY(j+1), mesh.m2D.geometry.attributes.position.getZ(j+1));
                    var info = this.checkFoldLine(a, l);
                    if (info.match) {
                        info.line.faces.push(side);
                        side.lines.push(info.line);
                        side.sideChildren2++;
                    }
                }
                if (l !== 0) {
                    // eslint-disable-next-line
                    var info = this.checkFoldLine(f, l);
                    if (info.match) {
                        info.line.faces.push(side);
                        side.lines.push(info.line);
                        side.sideChildren2++;
                    }
                }
//                }

            }, this);
        },
        bender: function(geometry, axis: string, angle: number) {
            let theta = 0;
            if (angle !== 0) {
                const v = geometry.attributes.position.array;
                for (let i = 0; i < v.length; i += 3) {
                    let x = v[i]
                    let y = v[i + 1]
                    let z = v[i + 2]

                    switch (axis) {
                        case 'x':
                            theta = z * angle
                            break
                        case 'y':
                            theta = x * angle
                            break
                        default:
                            //z
                            theta = x * angle
                            break
                    }

                    let sinTheta = Math.sin(theta)
                    let cosTheta = Math.cos(theta)

                    switch (axis) {
                        case 'x':
                            v[i] = x
                            v[i + 1] = (y - 1.0 / angle) * cosTheta + 1.0 / angle
                            v[i + 2] = -(y - 1.0 / angle) * sinTheta
                            break
                        case 'y':
                            v[i] = -(z - 1.0 / angle) * sinTheta
                            v[i + 1] = y
                            v[i + 2] = (z - 1.0 / angle) * cosTheta + 1.0 / angle
                            break
                        default:
                            //z
                            v[i] = -(y - 1.0 / angle) * sinTheta
                            v[i + 1] = (y - 1.0 / angle) * cosTheta + 1.0 / angle
                            v[i + 2] = z
                            break
                    }
                }
            }
            geometry.attributes.position.needsUpdate = true;
        },
        planeCurve: function(g, z){
            let p = g.parameters;
            let hw = p.width * 0.5;

            let a = new THREE.Vector2(-hw, 0);
            let b = new THREE.Vector2(0, z);
            let c = new THREE.Vector2(hw, 0);

            let ab = new THREE.Vector2().subVectors(a, b);
            let bc = new THREE.Vector2().subVectors(b, c);
            let ac = new THREE.Vector2().subVectors(a, c);

            let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));

            let center = new THREE.Vector2(0, z - r);
            let baseV = new THREE.Vector2().subVectors(a, center);
            let baseAngle = baseV.angle() - (Math.PI * 0.5);
            let arc = baseAngle * 2;

            let uv = g.attributes.uv;
            let pos = g.attributes.position;
            let mainV = new THREE.Vector2();
            for (let i = 0; i < uv.count; i++){
                let uvRatio = 1 - uv.getX(i);
                let y = pos.getY(i);
                mainV.copy(c).rotateAround(center, (arc * uvRatio));
                pos.setXYZ(i, mainV.x, y, -mainV.y);
            }

            pos.needsUpdate = true;

        },
        downScaleImage: function(img, scale) {
            var imgCV = document.createElement('canvas');
            imgCV.width = img.width;
            imgCV.height = img.height;
            var imgCtx = imgCV.getContext('2d');
            imgCtx.drawImage(img, 0, 0);
            return this.downScaleCanvas(imgCV, scale);
        },
        downScaleCanvas: function(cv, scale) {
            if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
            var sqScale = scale * scale; // square scale =  area of a source pixel within target
            var sw = cv.width; // source image width
            var sh = cv.height; // source image height
            var tw = Math.floor(sw * scale); // target image width
            var th = Math.floor(sh * scale); // target image height
            var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
            var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
            var tX = 0, tY = 0; // rounded tx, ty
            var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
            // weight is weight of current source point within target.
            // next weight is weight of current source point within next target's point.
            var crossX = false; // does scaled px cross its current px right border ?
            var crossY = false; // does scaled px cross its current px bottom border ?
            var sBuffer = cv.getContext('2d').getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
            var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
            var sR = 0, sG = 0,  sB = 0; // source's current point r,g,b

            for (sy = 0; sy < sh; sy++) {
                ty = sy * scale; // y src position within target
                tY = 0 | ty;     // rounded : target pixel's y
                yIndex = 3 * tY * tw;  // line index within target array
                crossY = (tY !== (0 | ( ty + scale )));
                if (crossY) { // if pixel is crossing botton target pixel
                    wy = (tY + 1 - ty); // weight of point within target pixel
                    nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
                }
                for (sx = 0; sx < sw; sx++, sIndex += 4) {
                    tx = sx * scale; // x src position within target
                    tX = 0 |  tx;    // rounded : target pixel's x
                    tIndex = yIndex + tX * 3; // target pixel index within target array
                    crossX = (tX !== (0 | (tx + scale)));
                    if (crossX) { // if pixel is crossing target pixel's right
                        wx = (tX + 1 - tx); // weight of point within target pixel
                        nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
                    }
                    sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
                    sG = sBuffer[sIndex + 1];
                    sB = sBuffer[sIndex + 2];
                    if (!crossX && !crossY) { // pixel does not cross
                        // just add components weighted by squared scale.
                        tBuffer[tIndex    ] += sR * sqScale;
                        tBuffer[tIndex + 1] += sG * sqScale;
                        tBuffer[tIndex + 2] += sB * sqScale;
                    } else if (crossX && !crossY) { // cross on X only
                        w = wx * scale;
                        // add weighted component for current px
                        tBuffer[tIndex    ] += sR * w;
                        tBuffer[tIndex + 1] += sG * w;
                        tBuffer[tIndex + 2] += sB * w;
                        // add weighted component for next (tX+1) px
                        nw = nwx * scale
                        tBuffer[tIndex + 3] += sR * nw;
                        tBuffer[tIndex + 4] += sG * nw;
                        tBuffer[tIndex + 5] += sB * nw;
                    } else if (!crossX && crossY) { // cross on Y only
                        w = wy * scale;
                        // add weighted component for current px
                        tBuffer[tIndex    ] += sR * w;
                        tBuffer[tIndex + 1] += sG * w;
                        tBuffer[tIndex + 2] += sB * w;
                        // add weighted component for next (tY+1) px
                        nw = nwy * scale
                        tBuffer[tIndex + 3 * tw    ] += sR * nw;
                        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                    } else { // crosses both x and y : four target points involved
                        // add weighted component for current px
                        w = wx * wy;
                        tBuffer[tIndex    ] += sR * w;
                        tBuffer[tIndex + 1] += sG * w;
                        tBuffer[tIndex + 2] += sB * w;
                        // for tX + 1; tY px
                        nw = nwx * wy;
                        tBuffer[tIndex + 3] += sR * nw;
                        tBuffer[tIndex + 4] += sG * nw;
                        tBuffer[tIndex + 5] += sB * nw;
                        // for tX ; tY + 1 px
                        nw = wx * nwy;
                        tBuffer[tIndex + 3 * tw    ] += sR * nw;
                        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                        // for tX + 1 ; tY +1 px
                        nw = nwx * nwy;
                        tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                        tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                        tBuffer[tIndex + 3 * tw + 5] += sB * nw;
                    }
                } // end for sx
            } // end for sy

            // create result canvas
            var resCV = document.createElement('canvas');
            resCV.width = tw;
            resCV.height = th;
            var resCtx = resCV.getContext('2d');
            var imgRes = resCtx.getImageData(0, 0, tw, th);
            var tByteBuffer = imgRes.data;
            // convert float32 array into a UInt8Clamped Array
            var pxIndex = 0; //
            for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
                tByteBuffer[tIndex] = 0 | ( tBuffer[sIndex]);
                tByteBuffer[tIndex + 1] = 0 | (tBuffer[sIndex + 1]);
                tByteBuffer[tIndex + 2] = 0 | (tBuffer[sIndex + 2]);
                tByteBuffer[tIndex + 3] = 255;
            }
            // writing result to canvas.
            resCtx.putImageData(imgRes, 0, 0);
            return resCV;
        }

    }
    return Cube;
})();



export default Cube;

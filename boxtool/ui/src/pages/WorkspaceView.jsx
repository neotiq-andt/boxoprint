import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Segment, Header, Input, Dimmer, Loader, Form, Grid } from 'semantic-ui-react';
import { withRouter } from "react-router";
import SVGtoPDF from 'svg-to-pdfkit'
import PDFDocument from '@react-pdf/pdfkit'
import blobStream from 'blob-stream'
import * as THREE from 'three'

import ThreeScene from '../threejs/ThreeScene'

import actions from "../actions/app"
import { makeCancelable } from '../store/utils'
import { parseQuery } from '../store/helper'

import SVGLoader from "../threejs/SVGLoader"
import { LAYER_TYPE_SHAPE, SHAPE_TYPE, LAYER_TYPE_IMAGE, LAYER_TYPE_TEXT } from "../constants/index";

function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

class WorkspaceView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loading: true,
      edition: true,
      brush: false,
      color: "",
      layerIndex : -1,
      selectIndex : -1,
      selectLayerName : null,
      currentConfig: {
        version:1,
        thickness:4,
        thickness_resource_id:0,
        colors: {},
        front:[],
        back:[]
      },
      warningElement:[],
      workspace_id:'',
      menu_active:'',
      boxZoomIn: 15,
      updateZoom: false,
      orbitControl: {},
      boxParamInfo: {
        baseUrl:'',
        currentUrl:'',
        designName:'',
        formKey: '',
        loginUrl:'',
        productId: '',
        productName: '',
        registerUrl: '',
      },
      loginResult : {error : false, message : '', email: ''},
      createUserResult : {error : false, message : '', email: ''},
      creatUser: {userName : '', password: ''},
      layerCount: 0,
    };

    this.props.set_title("Mon project");
    this.getDataWorkSpace(this.props.workspace_id);
  };

  componentDidMount(){
    const params = parseQuery(window.location.search);
    const {baseUrl, currentUrl,designName,formKey, loginUrl, productId,productName,registerUrl} = params;
    this.setState({boxParamInfo : {baseUrl, currentUrl, designName, formKey, loginUrl, productId, productName, registerUrl}});
    let isIframe = false; // check page is loaded by iframe
    if( JSON.parse(process.env.REACT_APP_ISCHECKIFRAME)){
      isIframe = window.location !== window.parent.location;
      if(!isIframe)
          this.props.history.push('/boxo-frontend/404');
      let urlParent = window.parent.location.origin+window.parent.location.pathname;
      if( isIframe && currentUrl !== urlParent )
          window.parent.location.reload();
    }
  };

  componentWillUnmount() {
    if (this.get_ws) this.get_ws.cancel();
    if (this.update_name) this.update_name.cancel();
    if (this.save_project) this.save_project.cancel();
  };

  componentWillReceiveProps(nextProps){
    if( nextProps.workspace_id !== this.props.workspace_id )
      this.getDataWorkSpace(nextProps.workspace_id);
  };

  getDataWorkSpace = (workspace_id)=>{
    const boxParamInfo = parseQuery(window.location.search);
    let paramsQuery = {workspace_id: workspace_id, customer_email:''}, customer_email = '';
    if(Object.keys(boxParamInfo).length){
      customer_email = boxParamInfo['customerEmail'] ||'';
      paramsQuery = {...paramsQuery,...{customer_email}};
    };
    this.get_ws = makeCancelable(this.props.get_workspace(paramsQuery));
    this.get_ws.promise.then(payload => {
      payload.base = JSON.parse(payload.base);
      payload.config = JSON.parse(payload.config);
      let price = payload.base.properties.l*payload.base.properties.w*payload.base.properties.h/80000 || 0;
      price = Number(price).toFixed(2);
      this.setState({ project: {...payload, customer_email, price}, currentConfig: payload.config, label: payload.label, loading: false });
    }).catch(error => {
      if (error.isCanceled) return;
      this.props.history.push('/boxo-frontend/home');
    });
  };

  handleSaveProject = async (imageBase64) => {
    this.setState({loading: true});
    let save_projects;
    const {project} = this.state;

    const type_defined = 0;
    let template_parent_id = 0;
    const template_id = project.workspace_id || type_defined;
    const owner_id = project.owner_id || type_defined;
    const workspace_price = project.price || type_defined;
    const customer_email = project.customer_email || '';

    const form_key = this.state.boxParamInfo.formKey || '';
    const product_id = this.state.boxParamInfo.productId;
    template_parent_id = project.template_parent_id?  project.template_parent_id : project.workspace_id;
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var workspace_svg = this.createFileSVG();
    this.save_project = save_projects = await makeCancelable(this.props.create_workspace_from_available(this.state.label,
                                                                                                        this.state.project.base,
                                                                                                        this.state.currentConfig,
                                                                                                        type_defined,
                                                                                                        this.state.boxParamInfo.designName,
                                                                                                        owner_id,
                                                                                                        template_id,
                                                                                                        date,
                                                                                                        template_parent_id,
                                                                                                        customer_email,
                                                                                                        workspace_price,
                                                                                                        imageBase64,
                                                                                                        workspace_svg,
                                                                                                        form_key,
                                                                                                        product_id));
    await this.save_project.promise.then(async (payload)=>{
          this.setState({workspace_id: payload.workspace_id, loading: false});
          await window.top.postMessage('callBackResultSaveProject', '*');
          return payload.workspace_id;
    }).catch(error => {
        if (error.isCanceled) return;
        this.setState({ error, loading: false,});
        return 0;
    });
    return save_projects;
  };

  handleAddToCardProject = async (imageBase64) => {
    this.setState({ loading: true});
    let save_projects;
    const {project} = this.state;
    const type_defined = 0;
    let template_parent_id = 0;
    const template_id = project.workspace_id || type_defined;
    const owner_id = project.owner_id || type_defined;
    const workspace_price = project.price || type_defined;
    const customer_email = project.customer_email || '';
    const formKey = this.state.boxParamInfo.formKey || '';
    const productId = this.state.boxParamInfo.productId;
    template_parent_id = project.template_parent_id?  project.template_parent_id : project.workspace_id;
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var workspace_svg = this.createFileSVG();
    this.save_project = save_projects = await makeCancelable(this.props.create_workspace_from_available(this.state.label,
                                                                                                        this.state.project.base,
                                                                                                        this.state.currentConfig,
                                                                                                        type_defined,
                                                                                                        this.state.designName,
                                                                                                        owner_id,
                                                                                                        template_id,
                                                                                                        date,
                                                                                                        template_parent_id,
                                                                                                        customer_email,
                                                                                                        workspace_price,
                                                                                                        imageBase64,
                                                                                                        workspace_svg,
                                                                                                        formKey,
                                                                                                        productId));
    await this.save_project.promise.then(async (payload)=>{
          this.setState({workspace_id: payload.workspace_id, loading: false});
          await window.top.postMessage({formData: { image_base: imageBase64,
                                                    workspace_id: payload.workspace_id,
                                                    w: this.state.project.base.properties.w,
                                                    l: this.state.project.base.properties.l,
                                                    h: this.state.project.base.properties.h,
                                                    price: this.state.project.price }, name:'callBackSaveProject'}, '*');
          return payload.workspace_id;
    }).catch(error => {
        if (error.isCanceled) return;
        this.setState({ error, loading: false});
    });
    return save_projects;
  };

  handleLogin = async (information) => {
    const {project} = this.state;
    let logins;
    this.login = logins = await makeCancelable(this.props.login_user( information.userName,
                                                                      information.password,
                                                                      this.state.boxParamInfo.loginUrl,
                                                                      this.state.boxParamInfo.formKey));
    await this.login.promise.then(async (payload)=>{
        project.customer_email = payload.email;
        project.form_key = this.state.boxParamInfo.formKey;
        project.product_id = this.state.boxParamInfo.productId;
        this.setState({loginResult : {error: payload.error, message: payload.message, email: payload.email}, project});

        // login success to save project
        if(!payload.error){ this.handleSaveProject();}
      }).catch(error => {
          if (error.isCanceled) return;
          this.setState({ error });
      });
      return logins;
  };

  handleCreateUserBox = async (information) => {
    const {creatUser} = this.state;
    let createUserReturns;
    this.createUserReturn = createUserReturns = await makeCancelable(this.props.create_user_box(information.firstName,
                                                                                                information.lastName,
                                                                                                information.email,
                                                                                                information.password,
                                                                                                information.passwordConfirm,
                                                                                                this.state.boxParamInfo.formKey,
                                                                                                this.state.boxParamInfo.registerUrl));
    await this.createUserReturn.promise.then(async (payload)=>{
        creatUser.userName = information.email;
        creatUser.password = information.password;
        this.setState({createUserResult : {error: payload.error, message: payload.message, email: payload.email}, creatUser});
        // create user success to login
        if(payload.error === false) this.handleLogin(creatUser);
      }).catch(error => {
          if (error.isCanceled) return;
          this.setState({error});
      });
      return createUserReturns;
  };

  handleSaveName = () => {
    if (this.state.label === this.state.project.label) return;
    const {project} = this.state;
    project.label = this.state.label;
    this.setState({ project });

    this.update_name = makeCancelable(this.props.update_workspace(this.props.workspace_id, this.state.label));
    this.update_name.promise.then(()=>{}).catch(error => {
      if (error.isCanceled) return;
      this.setState({ error, loading: false});
    });
  };

  handle2D = ()=>{
      this.setState({edition:true});
  };

  handle3D = ()=>{
      this.setState({edition:false});
  };

  handleSaveDimension = (params) => {
      const {svg,properties} = params;
      let {project, edition=false} = this.state;

      //3d
      if( !edition )
        this.setState({ edition: true, isLoading: true });

      let {base, price} = project;

      if (edition && base.properties.l === properties.l && base.properties.w === properties.w && base.properties.h === properties.h)
          return;

      base = {...base, svg, properties };
      price = properties.l*properties.w*properties.h/80000;
      price = Number(price).toFixed(2);
      project = {...project, base, price};
      this.setState({ project });
      if( !edition ){
        //3d
        this.checkUpdateZoom3D(!edition);
        setTimeout( ()=> {this.setState({edition:false, isLoading: false})}, 300);
      };
  };

  checkUpdateZoom3D = (is3D = false)=>{
    if(is3D)
        this.setState({updateZoom: true});
    else
        this.setState({updateZoom: false});
  };

  setBoxZoomIn = (boxZoomIn)=>{
    this.setState({boxZoomIn});
  };

  setOrbitControl = (orbitControl)=>{
    this.setState({orbitControl});
  };

  handleBrush = (flag, color) => {
    this.setState({brush:flag,color:color});
  };

  handleMenuClick = (menu_active) => {
    this.setState({menu_active});
  };

  handleLayers = (layers) => {
    let current = this.state;
    current.currentConfig.front = layers;
    this.setState(current);
  };

  handleEditLayer = (layerIndex) => {
    this.setState({layerIndex:layerIndex});
  };

  handleOrderLayer = (layerIndex, type) => {
    let current = this.state;
    var maxOrder = 0;
    if (current.currentConfig.front.length > 0) {
      maxOrder = Math.max.apply(Math, current.currentConfig.front.map(function(o) { return o.order; }));
    }
    if (type === 1) {
      if  (layerIndex > 0) {
        const currentOrder = current.currentConfig.front[layerIndex - 1].order;
        current.currentConfig.front[layerIndex - 1].order = currentOrder + 1;
        current.currentConfig.front[layerIndex].order = currentOrder;
      }
    } else if (type === -1) {
      if  (layerIndex < current.currentConfig.front.length) {
        const currentOrder = current.currentConfig.front[layerIndex + 1].order;
        current.currentConfig.front[layerIndex + 1].order = currentOrder - 1;
        current.currentConfig.front[layerIndex].order = currentOrder;
      }
    } else if (type === 0) {
      current.currentConfig.front[layerIndex].order = 1;
      for (let i = 0; i < current.currentConfig.front.length; i++) {
        if (i < layerIndex)
          current.currentConfig.front[i].order = current.currentConfig.front[i].order + 1;
        if (i > layerIndex)
          current.currentConfig.front[i].order = current.currentConfig.front[i].order - 1;
      }
    } else if (type === 2) {
      current.currentConfig.front[layerIndex].order = maxOrder;
      for (let i = layerIndex; i < current.currentConfig.front.length; i++) {
        current.currentConfig.front[i].order = current.currentConfig.front[i].order - 1;
      }
    }
    this.setState(current);
  }

  handleUpdateEditLayer = (layers) =>{
    let current = this.state;
    current.currentConfig.front = layers;
    this.setState(current);
  }

  handleDeleteLayer = (layerIndex) => {
    let current = this.state;
    current.currentConfig.front.splice(layerIndex, 1);
    if (layerIndex === current.selectIndex) {
        current.selectIndex--;
        if (current.selectIndex === -1)
          setTimeout(() => this.setState({selectLayerName:null}), 1);
        else
          setTimeout(() => this.setState({selectLayerName:current.currentConfig.front[current.selectIndex].layer_name}), 1);
    }
    this.setState(current);
  };

  modalResult = (r) => {

    if (r === null) {
      this.setState({layerIndex:-1});
      return;
    }
    let current = this.state;
    current.layerCount = current.layerCount + 1;

    
    if(r.addLayer){
      let layer = {};
      if (r.text != null){
        layer.layer_type = LAYER_TYPE_TEXT;
        layer.layer_name = 'Text ' + current.layerCount;
      }else if(r.shapeType != null){
        layer.layer_type = LAYER_TYPE_SHAPE;
        layer.layer_name = 'Shape ' + current.layerCount;
      }else{
        layer.layer_type = LAYER_TYPE_IMAGE;
        layer.layer_name = 'Picture ' + current.layerCount;
      }
      //layer.layer_name = r.name;

      delete r['name'];


      layer.properties = {};
      for (let key in r){
        layer.properties[key] = r[key];
      }
      layer.properties['size'] = layer.properties['font_size'];
      layer.properties['line_height'] = layer.properties['size'] - 5;
      var maxOrder = 0;
      if (current.currentConfig.front.length > 0) {
        maxOrder = Math.max.apply(Math, current.currentConfig.front.map(function(o) { return o.order; }));
      }

      layer.order = maxOrder + 1;
      current.currentConfig.front.push(layer);
      setTimeout(() => { this.handleSelectLayer(layer.layer_name);}, 10000);
      this.setState(current);
    }

    if(r.editLayer){
      if (r.name) {
        current.currentConfig.front[current.layerIndex].layer_name = r.name;
        current.selectLayerName = current.currentConfig.front[current.selectIndex].layer_name;
        delete r['name'];
      }
      for (let key in r){
        current.currentConfig.front[current.layerIndex].properties[key] = r[key];
      }
      current.currentConfig.front[current.layerIndex].properties['size'] = current.currentConfig.front[current.layerIndex].properties['font_size'];
      current.currentConfig.front[current.layerIndex].properties['text_align'] = current.currentConfig.front[current.layerIndex].properties['text_align'];
      current.currentConfig.front[current.layerIndex].properties['line_height'] = current.currentConfig.front[current.layerIndex].properties['size'] - 5;
      current.layerIndex = -1;
      this.setState(current);
    }
  };

  handleUpdateLayer = (r) => {
    if (this.state.selectIndex !== -1) {
      let current = this.state;
      for (let key in r) {
        current.currentConfig.front[current.selectIndex].properties[key] = r[key];
      }
      current.selectLayerName = current.currentConfig.front[current.selectIndex].layer_name;
      this.setState(current);
    }
  };

  handleSelectLayer = (layerName) => {
    if (layerName){
      for (let i = 0; i < this.state.currentConfig.front.length; i++) {
        
        if (layerName === this.state.currentConfig.front[i].layer_name) {
          this.setState({selectIndex:i,selectLayerName:layerName});
          return;
        }
      }
    }
    this.setState({selectIndex:-1,selectLayerName:null});
  };

  checkLayerName = (name) => {
  
    if (name === 'modèle de base')
      return false;
    if (this.state.layerIndex !== -1) {
        if (name === this.state.currentConfig.front[this.state.layerIndex].layer_name)
          return true;
    }
    for (let i = 0; i < this.state.currentConfig.front.length; i++) {
      if (name === this.state.currentConfig.front[i].layer_name)
        return false;
    }
    return true;
  };

  handleBrushMesh = (key, val) => {
    let current = this.state;
    if (current.currentConfig.colors == null)
        current.currentConfig.colors = {};

    current.currentConfig.colors[key] = val;
    this.setState(current);
  };

  handleZoomCenter = () => {
    if (this.onCenter) this.onCenter();
    this.setState({selectIndex:-1,selectLayerName:null});
  };

  handleToogleHelpers = (value) => {
    if (this.toogleHelpers) this.toogleHelpers(value);
  };

  handleExportFile = () => {
    if (this.onExport) this.onExport();

    var svg = this.createFileSVG();
    var s = new XMLSerializer();
    var str = s.serializeToString(svg);

    download(str, "export.svg", "image/svg+xml");
  };

  createFileSVG = () => {
    var loader = new SVGLoader();
    var { root } = loader.parse(this.state.project.base.svg);

    var xmlns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(xmlns, "svg");
    svg.setAttributeNS(null, "viewBox", root.x + " " + root.y + " " + root.width + " " + root.height);
    svg.setAttribute("xmlns", xmlns);
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("xmlns:svg", xmlns);
    svg.setAttribute("xmlns:inkscape", "http://www.inkscape.org/namespaces/inkscape");

    svg.setAttributeNS(null, "preserveAspectRatio", "xMinYMin meet");

    var def = document.createElementNS(xmlns, "defs");
    svg.appendChild(def);

    var clipPath = document.createElementNS(xmlns, "clipPath");
    clipPath.setAttribute("id", "pattern");
    def.appendChild(clipPath);

    root.nodes.forEach((node, pidx) => {  let n = node.cloneNode();
                                          n.removeAttribute("stroke");
                                          n.removeAttribute("fill");
                                          clipPath.appendChild(n);});

    var base_g = document.createElementNS(xmlns, "g");
    base_g.setAttribute("inkscape:label", "<<base>>");
    base_g.setAttribute("inkscape:groupmode", "layer");
    svg.appendChild(base_g);
    root.nodes.forEach((node, pidx) => {
      let n = node.cloneNode();
      if (this.state.project.config.colors.hasOwnProperty(node.id)) {
        n.removeAttribute("stroke");
        n.setAttribute("fill", this.state.project.config.colors[node.id]);
      }
      base_g.appendChild(n);
    });

    this.state.project.config.front.forEach((layer, pidx) => {
      let layer_g = document.createElementNS(xmlns, "g");
      layer_g.setAttribute("inkscape:label", layer.layer_name);
      layer_g.setAttribute("inkscape:groupmode", "layer");
      svg.appendChild(layer_g);
      if (layer.layer_type === LAYER_TYPE_TEXT) {
        let n = document.createElementNS(xmlns, LAYER_TYPE_TEXT);
        n.setAttribute("clip-path", "url(#pattern)");

        n.setAttribute("x", layer.properties.x);
        n.setAttribute("y", layer.properties.y);
        n.setAttribute("transform", "rotate(" + layer.properties.rotate + " " + layer.properties.x + "," + layer.properties.y + ")");

        n.setAttribute("fill", layer.properties.color);
        n.setAttribute("font-family", layer.properties.font_family);
        n.setAttribute("font-size", layer.properties.font_size);
        n.setAttribute("font-style", layer.properties.font_style);
        n.setAttribute("font-weight", layer.properties.font_weight);

        var textNode = document.createTextNode(layer.properties.text);
        n.appendChild(textNode);
        layer_g.appendChild(n);
      } else if (layer.layer_type === LAYER_TYPE_IMAGE) {
          let n = document.createElementNS(xmlns, "image");
          n.setAttribute("clip-path", "url(#pattern)");

          n.setAttribute("x", layer.properties.x - layer.properties.width / 2);
          n.setAttribute("y", layer.properties.y - layer.properties.height / 2);
          n.setAttribute("height", layer.properties.height);
          n.setAttribute("width", layer.properties.width);

          n.setAttribute("xlink:href", layer.properties.dataURL);
          n.setAttribute("transform", "rotate(" + layer.properties.rotate + " " + layer.properties.x + "," + layer.properties.y + ")");
          layer_g.appendChild(n);
        }
        else if (layer.layer_type === LAYER_TYPE_SHAPE) {
          let n = document.createElementNS(xmlns, LAYER_TYPE_SHAPE);
          n.setAttribute("clip-path", "url(#pattern)");

          n.setAttribute("x", layer.properties.x - layer.properties.width / 2);
          n.setAttribute("y", layer.properties.y - layer.properties.height / 2);
          n.setAttribute("height", layer.properties.height);
          n.setAttribute("width", layer.properties.width);

          n.setAttribute("xlink:href", layer.properties.dataURL);
          n.setAttribute("transform", "rotate(" + layer.properties.rotate + " " + layer.properties.x + "," + layer.properties.y + ")");
          layer_g.appendChild(n);
        }
    });

    var lines_g = document.createElementNS(xmlns, "g");
    lines_g.setAttribute("inkscape:label", "<<raineurs>>");
    lines_g.setAttribute("inkscape:groupmode", "layer");

    svg.appendChild(lines_g);
    root.lines.forEach((line, pidx) => {
      let n = line.cloneNode();
      n.removeAttribute("id");
      lines_g.appendChild(n);
    });

    var s = new XMLSerializer();
    var str = s.serializeToString(svg);
    return str;
  };

  handleExportFilePdf = () => {
    var loader = new SVGLoader();
    var {root} = loader.parse(this.state.project.base.svg);
    var xmlns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(xmlns, "svg");
    svg.setAttributeNS(null, "viewBox", root.x + " " + root.y + " " + root.width + " " + root.height);
    svg.setAttribute("xmlns", xmlns);
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("xmlns:svg", xmlns);
    svg.setAttribute("xmlns:inkscape", "http://www.inkscape.org/namespaces/inkscape");

    svg.setAttributeNS(null, "preserveAspectRatio", "xMinYMin meet");

    var def = document.createElementNS(xmlns, "defs");
    svg.appendChild(def);

    var clipPath = document.createElementNS(xmlns, "clipPath");
    clipPath.setAttribute("id", "pattern");
    def.appendChild(clipPath);

    root.nodes.forEach((node, pidx) => {
      let n = node.cloneNode();
      n.removeAttribute("stroke");
      n.removeAttribute("fill");
      clipPath.appendChild(n);
    });


    var base_g = document.createElementNS(xmlns, "g");
    base_g.setAttribute("inkscape:label", "<<base>>");
    base_g.setAttribute("inkscape:groupmode", "layer");
    svg.appendChild(base_g);
    root.nodes.forEach((node, pidx) => {
      let n = node.cloneNode();
      if (this.state.project.config.colors.hasOwnProperty(node.id)) {
        n.removeAttribute("stroke");
        n.setAttribute("fill", this.state.project.config.colors[node.id]);
      }
      base_g.appendChild(n);
    });

    this.state.project.config.front.forEach((layer, pidx) => {
      this.canvas = document.createElement("CANVAS");
      this.context = this.canvas.getContext("2d");
      let lh = 0 , testWidth = 0, layer_g = document.createElementNS(xmlns, "g");
      layer_g.setAttribute("inkscape:label", layer.layer_name);
      layer_g.setAttribute("inkscape:groupmode", "layer");
      svg.appendChild(layer_g);
      if (layer.layer_type === LAYER_TYPE_TEXT) {
        let metrics = this.context.measureText(layer.properties.text);
        if (metrics.width > testWidth)
          testWidth = metrics.width;
        lh += layer.properties.line_height;
        let tmp_lh = lh;
        this.offsetText = new THREE.Vector2(testWidth/2, lh/2);
        let angleInRadians = THREE.Math.degToRad(layer.properties.rotate);
        this.context.rotate(angleInRadians);
        let moveCenterX = layer.properties.x
        let moveCenterY = layer.properties.y;
        let moveCenterRotX = (-moveCenterY * Math.sin(-angleInRadians) + moveCenterX * Math.cos(-angleInRadians));
        let moveCenterRotY = (moveCenterY * Math.cos(-angleInRadians) + moveCenterX * Math.sin(-angleInRadians));

        let n = document.createElementNS(xmlns, LAYER_TYPE_TEXT);
        n.setAttribute("clip-path", "url(#pattern)");

        //n.setAttribute("x", moveCenterRotX-2*this.offsetText.x);
        n.setAttribute("x", moveCenterRotX - 4*(layer.properties.line_height/20)*this.offsetText.x);
        if( layer.properties.line_height > 20)
          n.setAttribute("x", moveCenterRotX - 4*(layer.properties.line_height/20*0.68)*this.offsetText.x);

        n.setAttribute("y", moveCenterRotY + tmp_lh - this.offsetText.y);
        n.setAttribute("transform", "rotate(" + layer.properties.rotate + " " + layer.properties.x + "," + layer.properties.y + ")");

        n.setAttribute("fill", layer.properties.color);
        n.setAttribute("font-family", layer.properties.font_family);
        n.setAttribute("font-size", (layer.properties.font_size/0.2645833333)/2*0.72);
        n.setAttribute("font-style", layer.properties.font_style);
        n.setAttribute("font-weight", layer.properties.font_weight);

        var textNode = document.createTextNode(layer.properties.text);
        n.appendChild(textNode);
        layer_g.appendChild(n);
      }
      else if (layer.layer_type === LAYER_TYPE_IMAGE) {
        let n = document.createElementNS(xmlns, "image");
        n.setAttribute("clip-path", "url(#pattern)");

        n.setAttribute("x", layer.properties.x - layer.properties.width / 2);
        n.setAttribute("y", layer.properties.y - layer.properties.height / 2);
        n.setAttribute("height", layer.properties.height);
        n.setAttribute("width", layer.properties.width);

        n.setAttribute("xlink:href", layer.properties.dataURL);
        n.setAttribute("transform", "rotate(" + layer.properties.rotate + " " + layer.properties.x + "," + layer.properties.y + ")");
        layer_g.appendChild(n);
      }else if (layer.layer_type === LAYER_TYPE_SHAPE) {
        let n = document.createElementNS(xmlns, LAYER_TYPE_SHAPE);
        n.setAttribute("clip-path", "url(#pattern)");

        n.setAttribute("x", layer.properties.x - layer.properties.width / 2);
        n.setAttribute("y", layer.properties.y - layer.properties.height / 2);
        n.setAttribute("height", layer.properties.height);
        n.setAttribute("width", layer.properties.width);

        n.setAttribute("xlink:href", layer.properties.dataURL);
        n.setAttribute("transform", "rotate(" + layer.properties.rotate + " " + layer.properties.x + "," + layer.properties.y + ")");
        layer_g.appendChild(n);
      }
    });

    var lines_g = document.createElementNS(xmlns, "g");
    lines_g.setAttribute("inkscape:label", "<<raineurs>>");
    lines_g.setAttribute("inkscape:groupmode", "layer");

    svg.appendChild(lines_g);
    root.lines.forEach((line, pidx) => {
      let n = line.cloneNode();
      n.removeAttribute("id");
      lines_g.appendChild(n);
    });

    var s = new XMLSerializer();
    var str = s.serializeToString(svg);
    let compress = false, pagewidth = 612, pageheight = 729, x = 10, y = 10;
    let options = {
      useCSS: false,
      assumePt: false,
      preserveAspectRatio: '',
      width: 400,
      height: 400
    };

    let doc = new PDFDocument({compress: compress, size: [pagewidth || 612, pageheight || 792]});
    SVGtoPDF(doc, str, x, y, options);
    let stream = doc.pipe(blobStream());
    stream.on('finish', function() {
        // let now = new Date();
        // now = now.toISOString()
        // let fileName = this.state.project.label;
        // fileName = fileName+now;
        // const link = document.createElement('a')
        // link.href = stream.toBlobURL()
        // link.download = fileName+'.pdf'
        // link.click()
        // link.remove()
        const pdfURL = stream.toBlobURL("application/pdf");
        window.open(pdfURL, '_blank');
    });
    doc.end();
  };

  /**
   * Zoom in out
   */
  handleZoomIn = (value) => {
    if (this.zoomInForm) this.zoomInForm(value);
  };

  /**
   * warning element
   */
  checkWarningElement = (warningElement) => {
      //this.setState({warningElement});
  };

  render_error = () => { setTimeout((e) => this.props.history.push('/boxo-frontend/home'), 100);};

  render() {
    if (this.state.loading)
      return (<Dimmer active inverted style={{marginTop:60}}>
                <Loader size='large'>Loading</Loader>
              </Dimmer>);

      setTimeout(()=> { this.props.set_title(<Form style={{width:'500px'}}>
                                              <Form.Group inline >
                                                <Form.Field >
                                                  <Header inverted as='h3'>Mon project:{' '}</Header>
                                                </Form.Field>
                                                <Form.Field width={10}>
                                                  <Input inverted transparent placeholder='Nom du projet' value={this.state.label} onChange={(event, {value}) => this.setState({label: value})} onBlur={this.handleSaveName} />
                                                </Form.Field>
                                              </Form.Group>
                                            </Form>);});

    if (this.state.project.base.svg){
    return (

      <Fragment>
        <Segment basic style={{ height:"100%", width: "100% " }} color='blue'>
          <Grid style={{height:"100%"}}>
            {/*<Grid.Column className="ui-grid-left" style={{height:"100%", display:'none'}} floated='left' width={2}>*/}
            {/*  <ToolBar exportFile={this.handleExportFile}*/}
            {/*           handleExportFilePdf={this.handleExportFilePdf}*/}
            {/*           handleZoomIn={this.handleZoomIn}*/}
            {/*           checkLayerName={this.checkLayerName}*/}
            {/*           toogleHelpers={this.handleToogleHelpers}*/}
            {/*           zoomCenter={this.handleZoomCenter}*/}
            {/*           modalResult={this.modalResult}*/}
            {/*           on2D={()=>this.setState({edition:true})}*/}
            {/*           on3D={()=>this.setState({edition:false})}*/}
            {/*           handleSave={this.handleSaveProject}*/}
            {/*           handleBrush={this.handleBrush}*/}
            {/*           openLayer={this.state.layerIndex !== -1 ? this.state.currentConfig.front[this.state.layerIndex] : null}/>*/}
            {/*</Grid.Column>*/}
              <ThreeScene
                  exportFile={this.handleExportFile}
                  handleExportFilePdf={this.handleExportFilePdf}
                  checkLayerName={this.checkLayerName}
                  toogleHelpers={this.handleToogleHelpers}
                  zoomCenter={this.handleZoomCenter}
                  modalResult={this.modalResult}
                  on2D={()=> this.handle2D() }
                  on3D={()=> this.handle3D() }
                  handleBrush={this.handleBrush}
                  layerIndex={this.state.layerIndex}
                  history = {this.props.history}
                  menu_active={this.state.menu_active}
                  handleMenuClick = {this.handleMenuClick}
                  openLayer={this.state.layerIndex !== -1 ? this.state.currentConfig.front[this.state.layerIndex] : null}

                  isLoading={this.state.isLoading}
                  key={JSON.stringify(this.state.project.base.properties)}
                  project={this.state.project}
                  parent={this}
                  workspace_created_id={this.state.workspace_id}
                  isWorkspace={true}
                  checkWarningElement={this.checkWarningElement}
                  checkUpdateZoom3D={this.checkUpdateZoom3D}
                  setBoxZoomIn={this.setBoxZoomIn}
                  setOrbitControl={this.setOrbitControl}
                  boxZoomIn={this.state.boxZoomIn}
                  updateZoom={this.state.updateZoom}
                  orbitControl={this.state.orbitControl}
                  selectedLayer={this.state.selectLayerName}
                  onBrush={this.handleBrushMesh}
                  onSelectLayer={this.handleSelectLayer}
                  config={this.state.project.base.conf3D}
                  brush={this.state.brush ? this.state.color: null}
                  user_config={this.state.currentConfig}
                  is3D={!this.state.edition}
                  edition={this.state.edition}
                  w='100%' h='600px'
                  isControlled={true}
                  size={this.state.project.base.properties}
                  svg={this.state.project.base.svg}
                  handleSaveDimension={this.handleSaveDimension}
                  handleZoomIn={this.handleZoomIn}

                  handleSave={this.handleSaveProject}
                  handleAddToCard={this.handleAddToCardProject}
                  handleLogin={this.handleLogin}
                  handleCreateUser = {this.handleCreateUserBox}
                  createUserInfo = {this.createUser}
                  boxParamInfo = {this.state.boxParamInfo}
                  loginResult =  {this.state.loginResult}
                  createUserResult = {this.state.createUserResult}

                  baseProperties={this.state.project.base.properties}
                  selectLayerIndex={this.state.selectIndex}
                  layers={this.state.currentConfig.front}
                  onResult={this.handleLayers}
                  workspaceUpload={this.props.workspace_upload}
                  handleEditLayer={this.handleEditLayer}
                  handleOrderLayer={this.handleOrderLayer}
                  handleDeleteLayer ={this.handleDeleteLayer}
                  handleUpdateEditLayer = {this.handleUpdateEditLayer}
              />

              {/*{this.state.edition === true && !this.state.isLoading &&*/}
              {/*<Grid.Column className="ui-grid-right" style={{display:'none'}} floated='right' width={3}>*/}
              {/*  <LayerBar baseProperties={this.state.project.base.properties}*/}
              {/*            onSelectLayer={this.handleSelectLayer}*/}
              {/*            selectLayerIndex={this.state.selectIndex}*/}
              {/*            layers={this.state.currentConfig.front}*/}
              {/*            onResult={this.handleLayers}*/}
              {/*            handleEditLayer={this.handleEditLayer}*/}
              {/*            handleDeleteLayer={this.handleDeleteLayer}*/}
              {/*            handleSaveDimension={this.handleSaveDimension}*/}
              {/*            handleZoomIn={this.handleZoomIn}*/}
              {/*            handleZoomOut={this.handleZoomOut}*/}
              {/*            handleSave={this.handleSaveProject}*/}
              {/*            project={this.state.project}*/}
              {/*            parent={this}*/}
              {/*            isWorkspace={true}*/}
              {/*            selectedLayer={this.state.selectLayerName}*/}
              {/*            onBrush={this.handleBrushMesh}*/}
              {/*            config={this.state.project.base.conf3D}*/}
              {/*            brush={this.state.brush ? this.state.color: null}*/}
              {/*            user_config={this.state.currentConfig}*/}
              {/*            is3D={!this.state.edition} w='100%' h='600px'*/}
              {/*            isControlled={true}*/}
              {/*            size={this.state.project.base.properties}*/}
              {/*            svg={this.state.project.base.svg}*/}
              {/*            key={JSON.stringify(this.state.project.base.svg)+JSON.stringify(this.state.currentConfig)}*/}
              {/*  />*/}
              {/*</Grid.Column>*/}
              {/*}*/}
          </Grid>
         </Segment>
      </Fragment>
    )}
    else{
        this.render_error()
        return null;
    }
  }
}

export default connect(null, {
  set_title: actions.title.update,
  get_workspace: actions.workspace.get,
  update_workspace: actions.workspace.update,
  create_workspace_from_available: actions.workspace.create_workspace_from_available,
  create_user_box: actions.workspace.create_user_box,
  login_user: actions.workspace.login_user,
  workspace_upload: actions.workspace.workspace_upload,
  create_user: actions.user.create
})(withRouter(WorkspaceView))

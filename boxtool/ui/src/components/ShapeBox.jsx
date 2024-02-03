import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import onClickOutside from "react-onclickoutside";
import actions from "../actions/app";
import IconMenu from "./IconMenu";
import { Button, Icon, Grid, Dropdown, Checkbox, Input, Form } from "semantic-ui-react";
import _ from "lodash";
import CustomInput from "./CustomInput";
import { LAYER_TYPE_SHAPE, SHAPE_TYPE } from "../constants/index";

class ShapeConfig extends Component {
  constructor(props) {
    super(props);
    const { properties,shapeType} = props;
    this.state = {
      lineWidth: properties.lineWidth,
      color: properties.color,
      stroke: properties.stroke,
      width: 0,
      height: 0,
      shapeType: shapeType,
    };
  }

  componentDidMount() {
    if (this.props.properties) {
      let current = this.props.properties;
      if (this.props.name) current.name = this.props.name;
      this.setState(current);
    }
    const {shapeType} = this.props;
    let w = 0, h = 0;
    
    switch (shapeType) {
      case SHAPE_TYPE.line:
        h = 10;
        w = 150;
        break;
      case SHAPE_TYPE.square:
        h = 150;
        w = 150;
        break;
      case SHAPE_TYPE.circle:
        h = 80;
        w = 80;
        break;
      case SHAPE_TYPE.rectangle:
        h = 100;
        w = 250;
        break;
      case SHAPE_TYPE.triangle:
        h = 150;
        w = 300;
      break;
    };
    
    this.handleEventHeight(h);
    this.handleEventWidth(w);
    this.update({ width: w, height: h });
    this.setState({height : h, width: w, shapeType : shapeType});
  }

  regEventHeight = (handleEvent) => {
    this.handleEventHeight = handleEvent;
  };

  regEventWidth = (handleEvent) => {
    this.handleEventWidth = handleEvent;
  };

  handleHeight = (height) => {
    let newWidth = 0;
    switch (this.state.shapeType) {
      case SHAPE_TYPE.line:
        newWidth = height * 10;
        break;
      case SHAPE_TYPE.square:
        newWidth = height;
        break;
      case SHAPE_TYPE.circle:
        newWidth = height;
        break;
      case SHAPE_TYPE.rectangle:
        newWidth = height * 2.5;
        break;
    }
    this.update({ height: height, width: newWidth });
    this.handleEventWidth(newWidth);
  };

  handleWidth = (width) => {
    let newHeight = 0;
    switch (this.state.shapeType) {
      case SHAPE_TYPE.line:
        newHeight = width / 10;
        break;
      case SHAPE_TYPE.square:
        newHeight = width;
        break;
      case SHAPE_TYPE.circle:
        newHeight = width;
        break;
      case SHAPE_TYPE.rectangle:
        newHeight = width / 2.5;
        break;
    }
    this.update({ width: width, height: newHeight });
    this.handleEventHeight(newHeight);
  };

  valueDisplay = (value) => {
    return value > 10 ? value / 10 : value;
  };

  update(u) {
    if (this.props.onResult) this.props.onResult(u);
    this.setState(u);
  };

  render() {
    return (
      <Grid columns={3} style={{padding : "10px 0"}}>
            <Grid.Row className={"shape-content-row"} columns={3}>
              <Grid.Column width={6}>
                <Form>
                  <Form.Field size="mini" control={CustomInput} label="Largeur (mm)" type="float-abs-shape" regEvent={this.regEventWidth} value={this.state.width || 0} onResult={(r) => { this.handleWidth(r); }}/>
                </Form>
              </Grid.Column>
              <Grid.Column width={6}>
                <Form>
                  <Form.Field size="mini" control={CustomInput} label="Hauteur (mm)" type="float-abs-shape" regEvent={this.regEventHeight} value={this.state.height || 0} onResult={(r) => { this.handleHeight(r); }}/>
                </Form>
              </Grid.Column>
              <Grid.Column width={4}>
                <Form>
                  <Form.Field size="mini" className={"ui buttons field-button"} control={CustomInput} label="" type="color" value={this.state.color} onResult={(r) => { this.update({ color: r }); }}/>
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className={"shape-content-row-stroke"} columns={2}>
              <Grid.Column width={8}>
                <Form>
                  <Form.Field>
                    <Checkbox type="checkbox" name="check" label="Couleur de contour" checked={this.state.stroke} onChange={(r, data) => { this.update({ stroke: data.checked }); }}/>
                  </Form.Field>
                </Form>
              </Grid.Column>
              {this.state.stroke && 
              (<Grid.Column width={8}>
                  <Form>
                    <Form.Field size="mini" control={CustomInput} label="Taille de contour" type="float-abs-shape" value={this.state.lineWidth || 0} onResult={(r) => { this.update({ lineWidth: r}); }}/>
                  </Form>
                </Grid.Column>)}
            </Grid.Row>
      </Grid>
    );
  }
}
class ShapeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shapeType: this.props.shapeType,
    };
  }

  onSelectShape(type) {
    this.setState({ shapeType: type });
    this.props.onSelectShapeType(type);
  }

  render() {
    const { shapeType } = this.state;
    return (<>
      <Grid columns={3} style={{padding : "10px 0"}}>
        <Grid.Row className={"shape-content-row"}>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.line ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.line)} title={"Line"}>
              <Icon className="icon-shapeBox icon-line" size="massive" />
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.rectangle ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.rectangle)} title={"Rectangle"}>
              <Icon className="icon-shapeBox icon-rectangle" size="massive" />
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button disabled={true} inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.rectangleRC ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.rectangleRC)} title={"Rectangle rounded corners"}>
              <Icon className="icon-shapeBox icon-rectangle-rounded-corners" size="massive"/>
            </Button>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className={"shape-content-row"}>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.square ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.square)} title={"Square"}>
              <Icon className="icon-shapeBox icon-square" size="massive" />
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button inverted color="green" disabled={true} icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.squareRC ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.squareRC)} title={"Square rounded corners"}>
              <Icon className="icon-shapeBox icon-square-rounded-corners" size="massive" />
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.circle ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.circle)} title={"Circle"}>
              <Icon className="icon-shapeBox icon-circle" size="massive" />
            </Button>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className={"shape-content-row"}>
          <Grid.Column>
            <Button disabled={true} inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.oval ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.oval)} title={"Oval"}>
              <Icon className="icon-shapeBox icon-oval" size="massive" />
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button disabled={true} inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.pentagon ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.pentagon)} title={"Pentagon"}>
              <Icon className="icon-shapeBox icon-pentagon" size="massive" />
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.triangle ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.triangle)}title={"Triangle"}>
              <Icon className="icon-shapeBox icon-triangle" size="massive" />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {/* <Grid columns={2} style={{padding : "10px 0"}}>
        <Grid.Row className={"shape-content-row"}>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.line ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.line)} title={"Line"}>
              <Icon className="icon-shapeBox icon-line" size="massive" />
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.rectangle ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.rectangle)} title={"Rectangle"}>
              <Icon className="icon-shapeBox icon-rectangle" size="massive" />
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className={"shape-content-row"}>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.square ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.square)} title={"square"}>
              <Icon className="icon-shapeBox icon-square" size="massive" />
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button inverted color="green" icon className="btn-shapeBox" active={shapeType === SHAPE_TYPE.circle ? true : false} onClick={() => this.onSelectShape(SHAPE_TYPE.circle)} title={"circle"}>
              <Icon className="icon-shapeBox icon-circle" size="massive" />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid> */}
</>
    );
  }
}
class ShapeBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.model.label || "",
      length: this.props.baseProperties.l || 0,
      width: this.props.baseProperties.w || 0,
      height: this.props.baseProperties.h || 0,
      disable_button: false,
      isOpen: false,
      autoSpinner: true,
      selectedFile: "",
      shapeType: "",
      addLayer: true,
    };
  }

  defaultShape = {
    name: LAYER_TYPE_SHAPE,
    x: this.props.canvasVectorCenter.canvas.width / 2,
    y: this.props.canvasVectorCenter.canvas.height / 2,
    width: 0,
    height: 0,
    ppp: 30,
    original_ppp: 30,
    rotate: 0,
    resource_id: 0,
    shapeType: "",
    color: "#000000",
    lineWidth: 10,
    stroke: false,
  };

  defaultBoundingRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    shapeType: "",
    color: "#000000",
    lineWidth: 10,
    stroke: false,
  };

  componentDidMount() {
    const layerText = this.props.layers.filter((item) => item.layer_type === LAYER_TYPE_SHAPE) || [];
    this.defaultShape.name = LAYER_TYPE_SHAPE + " " + (layerText.length + 1);
    if (this.props.type === LAYER_TYPE_SHAPE) this.setState(this.defaultShape);
  }

  sanityCheck() {
    if (this.props.type === LAYER_TYPE_SHAPE) {
      let current = this.state;
      if (current.shapeType === "" && current.width > 0 && current.height > 0) return false;
    }
    return true;
  }

  update(r) {
    let current = this.state;
    for (let key in r) current[key] = r[key];
    this.setState(current);
  }

  handleResult(r) {
    if (r && r.hasOwnProperty("autoSpinner")) delete r.autoSpinner;

    if (r && r.hasOwnProperty("selectedFile")) delete r.selectedFile;

    if (r && r.hasOwnProperty("controlledPosition")) delete r.controlledPosition;

    if (r !== null && typeof r.name === "undefined") {
      const layerShape = this.props.layers.filter((item) => item.layer_type === LAYER_TYPE_SHAPE) || [];
      if (layerShape.length > 0)
        r.name = LAYER_TYPE_SHAPE + " " + (layerShape.length + 1);
    }
    this.props.onResult(r);
    this.setIsOpen();
    this.setState({ shapeType: "" });
  }

  handleSelectShape = (type) => {
    this.setState({shapeType : type});
  };

  handleClickOutside = () => {
    let { isOpen = false } = this.state;
    if (isOpen) this.setIsOpen();
  };

  setIsOpen = () => {
    let { isOpen = false } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  render() {
    const { isOpen , shapeType} = this.state;
    const { config = {}, size = {},iconLayer, titleMenu } = this.props;
    const popupText = document.getElementsByClassName("inverted.menu");
    let clientWidthPopup = 0, clientHeightPopup = 0;
    if (popupText[0]) {
      clientWidthPopup = popupText[0].clientWidth;
      clientHeightPopup = popupText[0].clientHeight;
    }
    const xBox = size.l * 2 + 2 * size.w, yBox = size.h * 3;
    let { properties = { x: 0, y: 0 }, layer_type } = config || {};
    let x = properties.x, y = properties.y, overArea = false;
    if (x + clientHeightPopup >= xBox) {
      x = x - clientWidthPopup;
      y = y - 2.5 * this.defaultBoundingRect.left;
      overArea = true;
    }
    if (y + clientWidthPopup >= yBox || y < clientWidthPopup) {
      y = y - this.defaultBoundingRect.top;
      overArea = true;
    }
    if (layer_type === LAYER_TYPE_SHAPE) {
      x = properties.x + 50;
      y = properties.y - 50;
    }
    if (!overArea) {
      x = x - 1.5 * this.defaultBoundingRect.left;
      y = y - this.defaultBoundingRect.top;
    }
    if (!config) {
      x = 0;
      y = 0;
    }
    return (
      <>
        <Dropdown disabled={this.props.is3D} open={isOpen} item floating icon={ <IconMenu src={iconLayer} onClick={() => { this.setIsOpen(); this.props.onClick();}} title={titleMenu}/>}>
          <Dropdown.Menu className={"dropdown-menu"} style={{ width: "290px" }}>
            <Dropdown.Item onClick={(e) => e.stopPropagation()}>
              <div className={"row"}>
                {this.props.type === LAYER_TYPE_SHAPE && (<ShapeContent key={isOpen} 
                                                                        shapeType={shapeType} 
                                                                        onSelectShapeType={this.handleSelectShape}/>)
                }
              </div>
            </Dropdown.Item>
            {this.state.shapeType !== "" && (<> <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                                                  <div className={"row"}>
                                                    <ShapeConfig  key={shapeType}
                                                                  shapeType={shapeType} 
                                                                  properties={this.defaultShape}
                                                                  name={this.defaultShape.layer_name} 
                                                                  onResult={(r) => {this.update(r);}} />
                                                  </div>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                                                  <div className={"row"} style={{ textAlign: "center" }}>
                                                    <Button compact style={{ marginRight: 5 }} onClick={() => this.handleResult(null)}>Annuler</Button>
                                                    <Button compact style={{ marginLeft: 5 }} disabled={!this.sanityCheck()} onClick={() => this.handleResult(this.state)} color="blue">Enregistrer</Button>
                                                  </div>
                                                </Dropdown.Item>                                                                                                
                                              </>)
              }
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
}

ShapeBox.propTypes = {
  handleSaveDimension: PropTypes.func.isRequired,
  edit: PropTypes.bool,
};

ShapeBox.defaultProps = {
  handleSaveDimension: () => {},
  edit: false,
};

export default connect(null, {
  get_model: actions.template.get,
  update_project: actions.workspace.update,
})(onClickOutside(ShapeBox));

import 'react-dat-gui/build/react-dat-gui.css';
import React, { Component } from 'react';

import DatGui, {
  DatBoolean,
  DatColor,
  DatString,
  DatNumber,
  DatSelect,
  DatFolder
} from 'react-dat-gui';

export default class ControlGui extends Component {
  constructor(props) {
    super(props);
    const userctrl = Object.keys(this.props.config.public).map(function (key, index) {
      return ({
        name: key,
        ...this.props.config.public[key]
      });
    }, this);
    const presets = Object.keys(this.props.config.presets).map(function (key, index) {
      return ({
        name: key,
        ...this.props.config.presets[key]
      });
    }, this);

    console.log("presets", presets);
    console.log("control", this.props.cube);
    this.state = {
      userctrl,
      presets,
      data: {
        projectName: 'demo',
        isVisible: true,
        lineColor: '#2F00D6',
      }
    }
  }

  handleUpdate = data => {
    this.setState({ data })
    console.log("update", data);
  }


  renderPresets = () => {
    if (!this.state.presets.length) return null;
    var options = this.state.presets.map(i => i.label);
    return <DatSelect path='Rendu' options={options} />
  }
  renderFaceCtrl = () => {
    return this.state.userctrl.map((item , i)=> {
      return <DatNumber key={i} path={item.name} label={item.label} step={1} min={item.min} max={item.max}></DatNumber>
    });
  }

  render() {
    const { data } = this.state;

    return (
      <DatGui data={data} onUpdate={this.handleUpdate}>
        <DatString path='projectName' label='Nom du projet' />
        <DatBoolean path='isVisible' label='Lignes visible' />
        <DatColor path='lineColor' label='Couleur des lignes' />
        {this.renderPresets()}
        <DatFolder title='Rabats' closed={false}>{this.renderFaceCtrl()}</DatFolder>
        {/* <DatPresets></DatPresets> */}
      </DatGui>
    )
  }
}
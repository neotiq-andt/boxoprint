import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import IconMenu from './IconMenu'
import { Dropdown, Button} from "semantic-ui-react";

class ColorPicker extends React.Component {
  state = {
    isOpen: false,
    displayColorPicker: false,
    color: {
      hex: '#F17013',
      rgb: { r: '241',g: '112',b: '19', a: '1',}
    },
    colorDefault:{
      hex: '#CCCCCC',
      rgb: {r: '204',g: '204',b: '204', a: '1',},
      hsl: {a: 1, h: 25.135135135135133, l: 0.8, s: 0},
      hsv: {a: 1, h: 25.135135135135133, s: 0, v: 0.8},
      oldHue: 25.135135135135133,
    },
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = (e) => {
      e.stopPropagation();
      this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color });
  };

  handleChangeComplete = (color) => {
      this.setState({ color: color });
      if (this.props.onColorChanged) this.props.onColorChanged(color);
  };

  handleSelect = (e) => {
    e.stopPropagation();
    this.props.handleShowColor();
    this.setState({ displayColorPicker: true });
  }

  handleClick2 = (e) => {
      e.stopPropagation();
      if (this.state.displayColorPicker) return;
      if (this.props.onClick) this.props.onClick(e, this.state.color);
  }

  setIsOpen = ()=>{
    let {isOpen = false} = this.state;
    this.setState({isOpen: !isOpen});
  }

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '6px',
          borderRadius: '2px',
          background: `rgba(${ this.state.color.rgb.r }, ${ this.state.color.rgb.g }, ${ this.state.color.rgb.b }, ${ this.state.color.rgb.a })`,
        },
        swatch: {
          padding: '1px 0px',
          borderRadius: '1px',
          background: '#d2d2d2',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        space: {height: '6px'},
        image: {
            marginLeft: '3px',
            height: '16px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    const { isLoading = false, edition = false} = this.props;
    return (
            <>
              <Dropdown className={ !isLoading && edition === true ? "":"item-inactive" } item floating icon={<IconMenu src={this.props.src} onClick={(e)=>{this.setIsOpen();this.handleSelect(e)}} title={'fond'}/>}>
                <Dropdown.Menu className={'dropdown-menu'} style={{width:'0px'}}>
                  {this.state.displayColorPicker &&
                  <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                      <div className={"row"}>
                          <div style={ styles.popover }  className={'sketch-picker-custom-div'}>
                              <div style={ styles.cover } onClick={ this.handleClose }/>
                              <SketchPicker
                                  className='sketch-picker-custom item'
                                  disableAlpha={true}
                                  color={ this.state.color.rgb }
                                  onChangeComplete={ this.handleChangeComplete }
                                  onChange={ this.handleChange } />
                              <div className={'div-remove-color'}>
                                  <Button compact onClick={() => this.handleChangeComplete(this.state.colorDefault)} color="blue">Enlever</Button>
                              </div>
                          </div>
                      </div>
                  </Dropdown.Item>
                  }
                </Dropdown.Menu>
              </Dropdown>
            </>
    )
  }
}

export default ColorPicker
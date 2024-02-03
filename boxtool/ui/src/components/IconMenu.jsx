import React, { Component } from 'react'

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
            menu_active:''
        }
    }

    render() {
        const {src, onClick, title} = this.props
        return (
            <>
                <img src={src} onClick={onClick} alt={title}/>
                <span className={'icon-title'} onClick={onClick}>{title}</span>
            </>
        );
    };
};
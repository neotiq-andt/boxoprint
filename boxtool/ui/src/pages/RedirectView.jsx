import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import Locations from "./Locations"


class RedirectView extends Component {

    render() {
        const { user } = this.props.user;

        // if (!user.id)
        //     return <Redirect to={Locations.SignInView.toUrl()} />;
        // else
            return <Redirect to="/boxo-frontend/home" />;
    }
}


function mapStateToProps(state, ownProps) {
    return {
        user: state.session
    };
}

export default connect(mapStateToProps)(RedirectView);

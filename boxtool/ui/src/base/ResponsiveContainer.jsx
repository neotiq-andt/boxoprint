import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import {
    Button,
    Container,
    Header,
    Image,
    Icon,
    Menu,
    Sidebar,
    Segment,
} from 'semantic-ui-react';

import { change_password } from '../actions/session';
import { makeCancelable } from '../store/utils';

import ModalChangePassword from '../components/ModalChangePassword';

const HomepageHeading = ({ mobile }) => (
    <Container text>
        <Header
            as='h1'
            content='Imagine-a-Company'
            inverted
            style={{
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: mobile ? '1.5em' : '3em',
            }}
        />
        <Header
            as='h2'
            content='Do whatever you want when you want to.'
            inverted
            style={{
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginTop: mobile ? '0.5em' : '1.5em',
            }}
        />
        <Button primary size='huge'>
            Get Started
            <Icon name='right arrow' />
        </Button>
    </Container>
)

HomepageHeading.propTypes = {
    mobile: PropTypes.bool,
}



const fixedMenuStyle = {
    // backgroundColor: '#fff',
    // border: '1px solid #ddd',
    height:60,
    marginBottom: 0,
    borderRadius: 0,
    // boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
}

const headerMenuStyle= {
    padding: 10
}
class MobileContainer extends Component {
    constructor(props){
        super(props);
        this.state = { visible: true, modal: false }
    }

    componentWillUnmount() {
        if (this.change_password) this.change_password.cancel();
    };

    handleHideClick = () => {
        this.setState({ visible: false })
    }
    handleShowClick = (e) =>{
        e.stopPropagation();
        this.setState({ visible: true })
    }
    handleSidebarHide = (e) => {
        e.stopPropagation();
        this.setState({ visible: false })
    }

    handleChangePassword = (e) => {
        this.setState({modal : true});
    };

    handleChangedPassword = (password) => {
        if (password != null) {
            if (this.change_password) this.change_password.cancel();
            this.change_password = makeCancelable(this.props.change_password(password));
            this.change_password.promise.then(payload => {
                this.setState({modal:false});
            }).catch(error => {
                if (error.isCanceled) return;
                this.setState({modal:false});
            });
        } else
            this.setState({modal:false});
    };

    render() {
        const { children } = this.props
        return (
            <Fragment>
                {this.state.modal === true && <ModalChangePassword onResult={this.handleChangedPassword}/>}
                <Menu
                    borderless
                    color="blue"
                    style={ fixedMenuStyle}
                >
                    <Menu.Item style={headerMenuStyle}>
                        {<Image size="small" src='/boxo-frontend/logobox.png' />}
                    </Menu.Item>
                </Menu>
                <Sidebar.Pushable as={Segment} basic style={{ flex:1, overflow: "auto",  marginTop: 0, marginBottom: 0}}>
                    <Sidebar.Pusher style={{ overflow: 'auto', height: "100%"}}>
                        <Segment basic style={{ height: "100%"}}>
                            {children}
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Fragment>
        )
    }
}

MobileContainer.propTypes = {
    children: PropTypes.node,
}

const ResponsiveContainer = ({user, onLogout, children, meta }) => (
    <Fragment>
        <MobileContainer meta={meta} user={user} onLogout={onLogout}>{children}</MobileContainer>
    </Fragment>
)

ResponsiveContainer.propTypes = {
    children: PropTypes.node,
}


function mapStateToProps(state, ownProps) {
    return {
        meta: state.metadata
    };
}

export default connect(mapStateToProps, { change_password })(MobileContainer);

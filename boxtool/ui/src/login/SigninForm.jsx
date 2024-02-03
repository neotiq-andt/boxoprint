import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticate, me, change_password, riddle, reset_password } from '../actions/session'
import {makeCancelable} from '../store/utils'
import { Button, Form, Grid, Image, Segment, Divider, Container, Message, Header, Icon } from 'semantic-ui-react'

class SigninForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            confirm: '',
            reset: 0,
            loading: false,
            email: '',
            riddle: '...'
        }
    }

    componentWillUnmount() {
        if (this.riddle) this.riddle.cancel();
        if (this.reset_password) this.reset_password.cancel();
    };

    handleMail = (e) => {
        this.setState({ email: e.target.value})
    }

    handleConfirm = (e) => {
        this.setState({ confirm: e.target.value })
    }

    handleLogin = (e) => {
        this.setState({ login: e.target.value })
    }
    handlePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    handleSubmit = (e) => {
        if (this.props.user.loading) return;
        const { reset } = this.state;
        if (reset === 0) {
            const { user } = this.props.user;
            if (user.superToken)
                this.props.change_password(this.state.password, user.superToken);
            else
                this.props.authenticate(this.state.login, this.state.password);
            this.setState({ password: '', confirm: '' });
        }
        else if (reset === 1) {
            // riddle
            this.riddle = makeCancelable(this.props.riddle(this.state.login));
            this.riddle.promise.then(payload => {
                this.setState({ loading: false, riddle: "Saisissez l'email associé à ce compte (" + payload.email + ")" });
            }).catch(error => {
                if (error.isCanceled) return;
                this.setState({ reset: 0 });
            });
            this.setState({ reset: 2, loading: true });
        }
        else if (reset === 2) {
            // reset
            this.reset_password = makeCancelable(this.props.reset_password(this.state.login, this.state.email));
            this.reset_password.promise.then(payload => {
                this.setState({ reset: 0, loading: false, email: '', riddle: '' });
            }).catch(error => {
                if (error.isCanceled) return;
                this.setState({ reset: 0, loading: false, email: '', riddle: '' });
            });
        }
    }

    handleCancelForgot = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ reset: 0, loading: false, email: '', riddle: '' });
    }
    handleForgot = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({reset: 1, loading: false});
    }

  render() {
        const { login, password, confirm, reset, email, riddle } = this.state;
        const { error, user, loading } = this.props.user;

        if (user.id && !user.superToken)
            return <Redirect push to="/" />;

    return (
        <div className='login-form'>
            <Grid textAlign='center' style={{ height: '80%', margin: '0' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: '600px' }}>
                    <Segment stacked>
                        <Grid.Row verticalAlign='middle'>
                            <Image src='/boxo-frontend/banniere1.png' />
                                <Divider hidden></Divider>
                                <Form size='large' onSubmit={this.handleSubmit}>
                                    {/* <Image src='/larrelogo.png' /> */}
                                    <Divider hidden></Divider>
                            {user.superToken && <Header as='h3'>Changement de mot de passe</Header>}
                            <Container textAlign="left">
                                <Message icon negative hidden={!error}>
                                    <Icon size="tiny" name='warning' />
                                    <Message.Content>
                                        <Message.Header>{error ? error.header : ''}</Message.Header>
                                        <p>{error && error.message}</p>
                                    </Message.Content>
                                </Message>
                            </Container>
                            <Divider hidden={!error}/>

                                    {reset > 0 ?
                                        <Fragment>
                                            <Form.Input autoFocus disabled={reset > 1} onChange={this.handleLogin} value={login} fluid icon='user' iconPosition='left' placeholder='Login' />
                                            {reset > 1 && <Form.Input autoFocus onChange={this.handleMail} value={email} fluid icon='at' iconPosition='left' placeholder={riddle} />}
                                            <Divider />
                                            <Button.Group fluid>
                                                <Button loading={this.state.loading} color="blue" disabled={!((reset === 1 && login.length) || (reset === 2 && email.length))} type='submit' >Suivant</Button>
                                            </Button.Group>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            {!user.superToken && <Form.Input autoFocus onChange={this.handleLogin} value={login} fluid icon='user' iconPosition='left' placeholder='Login' />}
                                            <Form.Input onChange={this.handlePassword} value={password} fluid icon='lock' iconPosition='left' placeholder={user.superToken ? 'Mot de passe (min 8 caractères)' : 'Mot de passe'} type='password' />
                                            {user.superToken && <Form.Input onChange={this.handleConfirm} value={confirm} fluid icon='lock' iconPosition='left' placeholder='Confirmation' type='password' />}
                                            <Divider />
                                            <Button.Group fluid>
                                                <Button loading={loading} color="blue" disabled={user.superToken ? !(confirm === password && password.length > 7) : !(!!login.length && !!password.length)} type='submit' >Suivant</Button>
                                            </Button.Group>
                                        </Fragment>
                                    }
                                    {!user.superToken && reset < 1 && <a href="/" onClick={this.handleForgot} className="btn btn-error">Mot de passe oublié ?</a>}
                                    {reset > 0 && <a href="/" onClick={this.handleCancelForgot} className="btn btn-error">Annuler</a>}
                                </Form>
                        </Grid.Row>
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    )
  }
}





function mapStateToProps(state, ownProps) {
    return {
        user: state.session
    };
}

export default connect(mapStateToProps, { authenticate, me, change_password, riddle, reset_password })(SigninForm);

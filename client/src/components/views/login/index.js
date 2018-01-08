// PACKAGES //
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

// COMPONENTS //
import Loader from '../../layout/partials/loader'

// ACTIONS //
import { userLogin } from '../../../actions/user'

class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            emailError: null,
            passwordError: null,
            serverError: null,
            emailValue: '',
            passwordValue: '',
            authenticated: false,
            loading: false,
            uid: null
        }

        this.handleChangeEmail = this.handleChangeEmail.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChangeEmail(e) {
        let emailValue = e.target.value
        this.setState({emailValue, emailError: ''})
    }

    handleChangePassword(e) {
        let passwordValue = e.target.value
        this.setState({passwordValue, passwordError: ''})
    }

    handleSubmit(e) {
        e.preventDefault()
        if(!this.state.emailValue || !this.state.passwordValue) {
            if(!this.state.emailValue) {
                this.setState({
                    emailError: 'Please enter a valid email'
                })
            }
            if(!this.state.passwordValue) {
                this.setState({
                    passwordError: 'Please enter your password'
                })
            }
            return
        }
        this.setState({
            emailError: null,
            passwordError: null,
            loading: true
        })
        const formData = {
            email: this.state.emailValue,
            password: this.state.passwordValue
        }
        return this.props.dispatch(userLogin(formData))
    }

    componentWillReceiveProps(props) {
        console.log(props)
        this.setState({loading:false})
        let error = props.user.error
        if(error) {
            let type = error.type
            switch(type) {
                case 'email':
                    return this.setState({
                        emailError: error.message
                    })
                case 'password':
                    return this.setState({
                        passwordError: error.message
                    })
                default:
                    return this.setState({
                        serverError: error.message
                    })
            }
        } else {
            this.setState({
                authenticated: true,
                uid: props.user.uid
            })
            return
        }
    }

    render() {
        const id = this.state.uid
        const redirect = this.state.authenticated ? <Redirect to={`/profile/${id}`} /> : null
        const spinner = Loader(this.state.loading)

        return (
            <div id='login'>
                {redirect}
                {spinner}
                <div className='image-container'>
                    <img className='bubbles' src="/images/tribeyo_mark_chat_bubbles.png" />
                </div>
                <h3>LOGIN WITH YOUR EMAIL</h3>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type='email'
                        name='email'
                        placeholder='email'
                        className={this.state.emailError ? 'error-border' : null }
                        value={this.state.emailValue}
                        onChange={this.handleChangeEmail} />
                    <label htmlFor='email' id='email-error-login'>{this.state.emailError}</label>
                    <input
                        type='password'
                        name='password'
                        placeholder='password'
                        className={this.state.passwordError ? 'error-border' : null }
                        value={this.state.passwordValue}
                        onChange={this.handleChangePassword} />
                    <label htmlFor='password' id='password-error-login'>{this.state.passwordError}</label>
                    <label id='server-error-login'>{this.state.serverError}</label>
                    <button type="submit">LOGIN</button>
                </form>
                <div className='below-button'>New user? <Link to='/signup'>Create an account here.</Link></div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Login)

import React, { Component } from 'react';
import './Login.css';
import logo from './../assets/logo2.svg'

class Login extends Component {
    render() {
        return (
            <div className='Login'>
                <img src={logo} alt=''/>
                <a href={process.env.REACT_APP_LOGIN}><button>LOG IN</button></a>
            </div>
        )
    }
}

export default Login;

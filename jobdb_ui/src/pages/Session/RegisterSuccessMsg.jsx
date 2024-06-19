import React from 'react'
import { Link } from 'react-router-dom'

const RegisterSuccessMsg = () => {
    return (

        <div className="sucess-msg-container" style={{ textAlign: 'center' }}>
            <h2>Registration Successful</h2>
            <p>please check Your Mail id</p>
            <p>You can login after approved</p>
            console.log("Register")
            <Link to='/signup/hrSignup/registration-success-msg/user-signin'>click here to Login</Link>
        </div>
    )
}

export default RegisterSuccessMsg

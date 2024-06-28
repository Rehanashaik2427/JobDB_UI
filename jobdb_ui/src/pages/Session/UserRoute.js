import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CandiRegister from './CandiRegister.jsx';
import CandidateRegisterSucessMsg from './CandidateRegisterSucessMsg.jsx';
import HrRegistrationForm from './HrRegistrationForm.jsx';
import RegisterSuccessMsg from './RegisterSuccessMsg.jsx';
import Signup from './Signup.jsx';
import UserSignin from './UserSignin.jsx';

export default function UserRoute() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/candiSignup" element={<CandiRegister />} />
                <Route path="/hrSignup" element={<HrRegistrationForm />} />
                <Route path="/candiSignup/registration-success-msg" element={<CandidateRegisterSucessMsg />} />
                <Route path='/hrSignup/registration-success-msg' element={<RegisterSuccessMsg />} />
                <Route path='/hrSignup/registration-success-msg/user-signin' element={<UserSignin />} />
                <Route path="/candiSignup/registration-success-msg/user-signin" element={<UserSignin />} />

 
            </Routes>
        </div>
    );
}

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CandiRegister from './CandiRegister.jsx';
import HrRegistrationForm from './HrRegistrationForm.jsx';
import Signup from './Signup.jsx';

export default function UserRoute() {

    return (
        <div>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/candiSignup" element={<CandiRegister />} />
                <Route path="/hrSignup" element={<HrRegistrationForm />} />
            </Routes>

        </div>
    );

}

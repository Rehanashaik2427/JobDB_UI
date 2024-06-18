import { faAddressCard, faBriefcase, faHouse, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function HrLeftSide({ user }) {
    const BASE_API_URL = "http://localhost:8082/api/jobbox";
    const location = useLocation();
    const [userData, setUserData] = useState();
    const [userName, setUserName] = useState();
    const history = useHistory();
    const userEmail = user.userEmail;

    console.log(user);
    useEffect(() => {
        if (location.state && location.state.userName) {
            setUserName(location.state.userName);
        } else {
            fetchUserData(userEmail);
        }
    }, [location.state, userEmail]);

    const fetchUserData = async (userEmail) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getHRName`, {
                params: { userEmail: userEmail }
            });
            setUserName(response.data.userName);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserName('');
        }
    };

    return (
        <div className='hr-leftside'>
            <nav id='logo'>
                <img src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png" alt="jobboxlogo" />
            </nav>
            <nav>
                <h2>Welcome {userName}</h2>
            </nav>
            <section id="hr-dashboard">
                <FontAwesomeIcon icon={faHouse} /> <Link to={{ pathname: '/hr-dashboard', state: { userName: userName, userEmail: userEmail } }}>Dashboard</Link>
            </section>
            <section>
                <FontAwesomeIcon icon={faBriefcase} /> <Link to={{ pathname: '/post-jobs', state: { userName: userName, userEmail: userEmail } }}>My Jobs</Link>
            </section>
            <section>
                <FontAwesomeIcon icon={faAddressCard} /> <Link to={{ pathname: '/hr-applications', state: { userName: userName, userEmail: userEmail } }}>Applicants</Link>
            </section>
            <section>
                <FontAwesomeIcon icon={faBriefcase} /> <Link to={{ pathname: '/posted-jobs', state: { userName: userName, userEmail: userEmail } }}>All Jobs</Link>
            </section>
            <section>
                <FontAwesomeIcon icon={faUsers} /> <Link to={{ pathname: '/people', state: { userName: userName, userEmail: userEmail } }}>People</Link>
            </section>
            <section>
                <FontAwesomeIcon icon={faUser} /> <Link to={{ pathname: '/hr-profile', state: { userName: userName, userEmail: userEmail } }}>Profile</Link>
            </section>
           

            <h3>Help</h3>
            <h3><Link to="/contact">Contact us</Link></h3>
        </div>
    );
};

export default HrLeftSide;

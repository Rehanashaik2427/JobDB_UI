import { faCreditCard, faGlobe, faPaperclip, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const Payment = () => {

  const navigate = useNavigate();

  const toggleSettings = () => {
    navigate('/');
  };

  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const user = {
    userName: userName,

    userId: userId,
  };

  return (
    <div className='candidate-dashboard-container'>
      <div className='left-side'>
        <CandidateLeftSide user={user} />
      </div>

      <div className='rightside'>
        <div className="d-flex justify-content-end align-items-center mb-3 mt-12">

          <Dropdown className="ml-2">
            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
              <FontAwesomeIcon icon={faUser} id="user" className="icon" style={{ color: 'black' }} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-3">
              <Dropdown.Item as={Link} to="/">
                <i className="i-Data-Settings me-1" /> Account settings
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/" onClick={toggleSettings}>
                <i className="i-Lock-2 me-1" /> Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="payment-container">
          <div>
            <h2>Payment Via</h2>
            <section className="payment-options">
              <h2 className='payment-option'><FontAwesomeIcon icon={faCreditCard} /> Credit/Debit card</h2>
              <h2 className='payment-option'><FontAwesomeIcon icon={faPaperclip} /> UPI payments</h2>
              <h2 className='payment-option'><FontAwesomeIcon icon={faGlobe} /> Net Banking</h2>
            </section>
          </div>

          <div>
            <h2>Payment History</h2>
            <p style={{ textAlign: 'center' }}>Payments Details</p>
            {/* Add payment history details here */}
          </div>
        </div>
      </div>
    </div>

  );
}

export default Payment;

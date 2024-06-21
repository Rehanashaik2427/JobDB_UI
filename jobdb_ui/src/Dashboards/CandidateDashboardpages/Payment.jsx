import { faCreditCard, faGlobe, faPaperclip, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom'; // Import Link from react-router-dom
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const Payment = () => {

  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };


  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const user = {
    userName: userName,

    userId: userId,
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={3} className="leftside">
          <CandidateLeftSide user={{ userName, userId }} />
        </Col>

        <Col md={18} className="rightside">
          <div className='payment-div' >
            <div className="candidate-search">
              {/* <input type='text' placeholder='serach'></input>
                                    <button>
                                      <FontAwesomeIcon icon={faSearch} className='button' style={{color:'skyblue'}}/>
                                    </button> */}
              <div><FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} onClick={toggleSettings} /></div>

            </div>


          </div>
          {showSettings && (
            <div id="modal-container">
              <div id="settings-modal">
                {/* Your settings options here */}
                <ul>
                  <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/"> Sing out</Link></li>
                  <li>Setting </li>
                  {/* Add more settings as needed */}
                </ul>
                <button onClick={toggleSettings}>Close</button>
              </div>
            </div>
          )}




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

        </Col>
      </Row>
    </Container>

  );
}

export default Payment;

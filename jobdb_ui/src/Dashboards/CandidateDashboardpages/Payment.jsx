import { faCreditCard, faGlobe, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
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
  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return ''; // Handle case where name is undefined
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  const initials = getInitials(userName);
  return (
    <Container fluid className='dashboard-container'>
      <Row>
        <Col md={2} className="left-side">
          <CandidateLeftSide user={user} />
        </Col>

        <Col md={18} className="rightside" style={{
          overflow: 'hidden'
        }}>
          <div className="d-flex justify-content-end align-items-center mb-3 mt-12">

            <Dropdown className="ml-2">
              <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                <div
                  className="initials-placeholder"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'grey',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {initials}
                </div>
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
        </Col>
      </Row>
    </Container>

  );
}

export default Payment;

import React from 'react'
import { Card, Container, Nav, Navbar, Row } from 'react-bootstrap'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const About = () => {

  return (
    <div className="about-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar expand="lg" className="bg-body-tertiary" style={{ width: '100%', position: 'fixed', top: '0', zIndex: '1000' }}>
        <Container fluid>
          <Navbar.Brand>
            <img
              src="/jb_logo.png"
              alt="JobBox Logo"
              className="logo"
              style={{
                backgroundColor: 'transparent'
              }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" style={{ marginRight: '100px', marginLeft: '200px' }}>Home</Nav.Link>
              <Nav.Link as={Link} to='/about-jobbox' style={{ marginRight: '100px' }}>About Jobbox</Nav.Link>
              <Nav.Link as={Link} to="/aboutus" style={{ marginRight: '100px' }}>About Us</Nav.Link>
              <Nav.Link as={Link} to="/jobdbcompanies" style={{ marginRight: '100px' }}>Companies</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main content */}
      <div style={{ flex: '1' }}>
        {/* Your main content goes here */}
      </div>

      {/* Footer section */}
      <footer>
     
          <Row style={{ backgroundColor: 'black',  width: '100vw',marginLeft:'0px' }}>
            <Card.Footer className="d-flex flex-column justify-content-center align-items-center text-center">
              <div>
                <div>
                  <h2 style={{ color: 'white' }}>
                    Powered by <strong style={{ color: 'purple' }}>JOB</strong><strong style={{ color: 'gainsboro' }}>BOX</strong> © 2024 Paaratech Inc. All rights reserved.
                  </h2>
                </div>
                <div className="mt-2">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                    <FaInstagram size={30} style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#C13584', margin: '5px' }} />
                  </a>
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                    <FaFacebook size={30} style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#4267B2', margin: '5px' }} />
                  </a>
                  <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                    <FaTwitter size={30} style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#1DA1F2', margin: '5px' }} />
                  </a>
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                    <FaLinkedin size={30} style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#0077B5', margin: '5px' }} />
                  </a>
                </div>

                <div className='rules' >
                  <Link to="/terms-and-conditions" style={{ color: 'white' }}>Terms and Conditions</Link>
                  <Link to="/privacy-and-policy" style={{ color: 'white' }}>Privacy Policy</Link>
                  <Link to="/contact" style={{ color: 'white' }}>Contact</Link>
                </div>

              </div>
            </Card.Footer>
          </Row>
  
      </footer>
    </div>

  )
}

export default About

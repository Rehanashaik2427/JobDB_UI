import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import HrLeftSide from './HrLeftSide'

const CompanyShowCase = () => {
  const [showLeftSide, setShowLeftSide] = useState(false);
  const location = useLocation();
  const userName = location.state?.userName || '';
  const userEmail = location.state?.userEmail || '';
  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };
  return (
    <Container fluid className="dashboard-container">
        <Row>
        <Col md={2} className={`left-side ${showLeftSide ? 'show' : ''}`}>
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>
        <div className="hamburger-icon" onClick={toggleLeftSide}>
          <FaBars />
        </div>
        <Col md={10} className="rightside">
        </Col>
        </Row>
      </Container>
  )
}

export default CompanyShowCase

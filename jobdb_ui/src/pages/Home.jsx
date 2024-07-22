
import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEnvelope, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Nav, Navbar, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import './PagesStyle/Pages.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
const BASE_API_URL = "http://localhost:8082/api/jobbox";
const Home = () => {
 
  return (
    <div>
      

    </div>
  )
}

export default Home;

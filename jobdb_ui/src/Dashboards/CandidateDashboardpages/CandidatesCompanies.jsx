import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const CandidatesCompanies = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_API_URL}/displayCompanies`, { params: { page, size: pageSize } });
    setCompanies(response.data.content);
    setTotalPages(response.data.totalPages);
  };

  const fetchCompanyBySearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchCompany`, { params: { search, page, size: pageSize } });
      setCompanies(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("No data found: " + error);
    }
  };

  useEffect(() => {
    if (search) {
      fetchCompanyBySearch();
    } else {
      fetchCompany();
    }
  }, [search, page, pageSize]);

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchCompanyBySearch();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleClick = (companyId) => {
    navigate("/candidate-dashboard/companyPage", { state: { companyId: companyId,userName: userName, userId: userId } })
    alert('Button clicked!');
  };

  return (
    <Container fluid className="dashboard-container">
    <Row>
      <Col md={3} className="leftside">
        <CandidateLeftSide user={{ userName, userId }} />
      </Col>

      <Col md={18} className="rightside">
        <div className="top-right-content">
          <div className="candidate-search">
            <form className="candidate-search1" onSubmit={handleSubmit}>
              <input
                type='text'
                name='search'
                placeholder='Search'
                value={search}
                onChange={handleSearchChange}
              />
             <Button variant="light" onClick={() => alert('Search clicked')}>
              <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
            </Button>
            </form>
            <div><FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} onClick={toggleSettings} /></div>
          </div>
          <div className="companyJob">
            <h1>Companies that we have</h1>
            <div className="cards d-flex flex-wrap justify-content-around" style={{ minHeight: 'fit-content', minWidth: '800px' }}>
          {companies.length > 0 ? (
            companies.map((company) => (
              <Card className="company-card-job" key={company.companyId} style={{ minWidth: '300px', maxWidth: '400px', flex: '1 0 300px', margin: '10px' }}>
                <Card.Body>
                  <Card.Title>Company Name: <b>{company.companyName}</b></Card.Title>
                  <Card.Text>Industry: <b>{company.industry}</b></Card.Text>
        
                  <Button onClick={() => handleClick(company.companyId)}>
                    View
                  </Button>
                </Card.Body>
              </Card>


            ))
          ) : (
            <p>Company not found. Please <Link to='/companies'>fill company details</Link>.</p>
          )}
        </div>

            <nav>
              <ul className='pagination'>
                <li>
                  <button className='page-button' onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
                </li>
                {[...Array(totalPages).keys()].map((pageNumber) => (
                  <li key={pageNumber} className={pageNumber === page ? 'active' : ''}>
                    <button className='page-link' onClick={() => handlePageChange(pageNumber)}>{pageNumber + 1}</button>
                  </li>
                ))}
                <li>
                  <button className='page-button' onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
                </li>
              </ul>
            </nav>
          </div>

          {showSettings && (
            <div id="modal-container">
              <div id="settings-modal">
                <ul>
                  <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/">Sign out</Link></li>
                  <li>Setting</li>
                </ul>
                <button onClick={toggleSettings}>Close</button>
              </div>
            </div>
          )}
        </div>
        </Col>
      </Row>
    </Container>

  );
};

export default CandidatesCompanies;

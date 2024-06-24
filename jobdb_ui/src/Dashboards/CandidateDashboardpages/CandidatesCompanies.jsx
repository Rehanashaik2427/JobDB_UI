import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Dropdown, Pagination } from 'react-bootstrap';
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
  const [pageSize, setPageSize] = useState(6);
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
    navigate('/');
  };

  const handleClick = (companyId) => {
    navigate("/candidate-dashboard/companyPage", { state: { companyId: companyId, userName: userName, userId: userId } })
    alert('Button clicked!');
  };

  const user = {
    userName,
    userId,
  };

  return (
    <div className='candidate-dashboard-container'>
      <div className='left-side'>
        <CandidateLeftSide user={user} />
      </div>
      <div className='rightside'>
        <div className="top-right-content"></div>
        <div className='rightside'>
          <div className="d-flex justify-content-end">
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
              <div className="user col px-3 header-part-right">
                <Dropdown>
                  <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                    <FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} />
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
            </div>
          </div>
          <div className="companyJob">
            {/* <h1>Companies that we have</h1> */}
            <div className="cards">
              {companies.length > 0 ? (
                <>
                  <div className="row">
                    {companies.slice(0, 3).map((company) => (
                      <Card className="company-card-job" key={company.companyId} style={{ minWidth: '300px', maxWidth: '300px' }}>
                        <Card.Body>
                          <Card.Title>Company Name: <b>{company.companyName}</b></Card.Title>
                          <Card.Text>Industry: <b>{company.industry}</b></Card.Text>
                          <Button onClick={() => handleClick(company.companyId)}>
                            View
                          </Button>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                  <div className="row d-flex flex-wrap">
                    {companies.slice(3, 6).map((company) => (
                      <Card className="company-card-job" key={company.companyId} style={{ minWidth: '300px', maxWidth: '300px', flex: '1 0 300px', margin: '10px' }}>
                        <Card.Body>
                          <Card.Title>Company Name: <b>{company.companyName}</b></Card.Title>
                          <Card.Text>Industry: <b>{company.industry}</b></Card.Text>
                          <Button onClick={() => handleClick(company.companyId)}>
                            View
                          </Button>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <p>Company not found. Please <Link to='/companies'>fill company details</Link>.</p>
              )}
            </div>
            </div>
            <nav>
              <Pagination>
                <Pagination.Prev onClick={handlePreviousPage} disabled={page === 0} />
                {[...Array(totalPages).keys()].map((pageNumber) => (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === page}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={handleNextPage} disabled={page === totalPages - 1} />
              </Pagination>
            </nav>
          
        </div>
      </div>
    </div>
  );
};

export default CandidatesCompanies;

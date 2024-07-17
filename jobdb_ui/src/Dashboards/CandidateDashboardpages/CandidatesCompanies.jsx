import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button, Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };


  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_API_URL}/comapniesList?page=${page}&size=${pageSize}`);
    setCompanies(response.data.content);
    setTotalPages(response.data.totalPages);
  };

  const fetchCompanyBySearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchCompany`, { params: { search: search, page: page, size: pageSize } });
      if (response.data.content.length === 0) {
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Company not found!"
        });
      }
      setCompanies(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("Error searching companies:", error);
    }
  };

  useEffect(() => {
    if (search) {
      fetchCompanyBySearch();
    } else {
      fetchCompany();
    }
  }, [search, page, pageSize]);

  const toggleSettings = () => {
    navigate('/');
  };

  const handleClick = (companyId) => {
    navigate("/candidate-dashboard/companyPage", { state: { companyId: companyId, userName: userName, userId: userId } });
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
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
  const [showLeftSide, setShowLeftSide] = useState(false);

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size changes
  };
  return (
    <Container fluid className='dashboard-container'>
      <Row>
      <Col md={2} className={`left-side ${showLeftSide ? 'show' : ''}`}>
          <CandidateLeftSide user={{ userName, userId }} />
        </Col>
        <div className="hamburger-icon" onClick={toggleLeftSide}>
          <FaBars />
        </div>

        <Col md={10} className="rightside" style={{
          overflowY: 'scroll'
        }}>
          <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
            <div className="search-bar">
              <input
                style={{ borderRadius: '6px', height: '35px' }}

                type="text"
                name="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
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

          <div className="companyJob">

            {companies.length > 0 ? (
              <div className="row">
                <div className="cards d-flex flex-wrap justify-content-around" >

                  {companies.map((company) => (
                    <Card
                      className="company-card-job"
                      key={company.companyId}
                      style={{ minWidth: '300px', maxWidth: '400px', flex: '1 0 300px', margin: '10px' }}
                    >
                      <Card.Body>
                        <Card.Title>Company Name: <b>{company.companyName}</b></Card.Title>
                        <Card.Text>Industry: <b>{company.industry}</b></Card.Text>
                        <Button onClick={() => handleClick(company.companyId)}>View</Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
                 {/* Pagination */}
              <div className="pagination-container d-flex justify-content-end align-items-center">
                  <div className="page-size-select me-3">
                    <label htmlFor="pageSize">Page Size:</label>
                    <select id="pageSize" onChange={handlePageSizeChange} value={pageSize}>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                  <ReactPaginate
                    previousLabel={<i className="i-Previous" />}
                    nextLabel={<i className="i-Next1" />}
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={totalPages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    activeClassName="active"
                    containerClassName="pagination"
                    subContainerClassName="pages pagination"
                  />
                </div>

              </div>
            ) : (
              <>
                <div className="d-flex justify-content-center flex-direction-row">
                  <div className="spinner-bubble spinner-bubble-primary m-5" />
                  <span >Loading...</span>

                </div>
              </>
            )}

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CandidatesCompanies;

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button, Card, Dropdown } from 'react-bootstrap';
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
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handlePageClick = (data) => {
    const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1)); // Ensure selectedPage is within range
    setPage(selectedPage);
    localStorage.setItem('currentCandidateCompanyPage', selectedPage); // Store the page number in localStorage
  };

  useEffect(() => {
    if (search) {
      fetchCompanyBySearch();
    } else {
      fetchCompany();
    }
   
  }, [search, page, pageSize]);


  useEffect(() => {
    const storedPage = localStorage.getItem('currentCandidateCompanyPage');
    if (storedPage !== null) {
      const parsedPage = Number(storedPage);
      if (parsedPage < totalPages) {
        setPage(parsedPage);
        console.log(page);
      }
    }
  }, [totalPages]); // Make sure to include totalPages dependency to sync the state

  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_API_URL}/companiesList?page=${page}&size=${pageSize}`);
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

 
  const toggleSettings = () => {
    navigate('/');
  };

  const handleClick = (companyId) => {
    navigate("/candidate-dashboard/companyPage", { state: { companyId: companyId, userName: userName, userId: userId } });
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
    <div className='dashboard-container'>

      <div className={`left-side ${showLeftSide ? 'show' : ''}`}>
        <CandidateLeftSide user={{ userName, userId }} />
      </div>

      <div className="right-side">
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
              <div className="initials-placeholder"
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

        <div className="cards d-flex flex-wrap justify-content-start" style={{ minHeight: 'fit-content', minWidth: '800px' }}>
          {companies.length > 0 ? (
            companies.map((company) => (
              <Card className="company-card-job" key={company.companyId} style={{ minWidth: '300px', maxWidth: '400px', flex: '1 0 300px', margin: '12px' }}>
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
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination-container d-flex justify-content-end align-items-center mt-4">
          <div className="page-size-select me-3">
            <label htmlFor="pageSize">Page Size:</label>
            <select id="pageSize" onChange={handlePageSizeChange} value={pageSize}>
              <option value="6">6</option>
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
            forcePage={page < totalPages ? page : totalPages - 1} // Adjust forcePage to valid range
          />
        </div>
      </div>
    </div>
  );
};


export default CandidatesCompanies;

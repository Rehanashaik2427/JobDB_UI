import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button, Card, Dropdown } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import swal from 'sweetalert2'; // Import SweetAlert2
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

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchCompanyBySearch();
  };
  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_API_URL}/comapniesList`, { params: { page: page, size: pageSize } });
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





  const toggleSettings = () => {
    navigate('/');
  };

  const handleClick = (companyId) => {
    navigate("/candidate-dashboard/companyPage", { state: { companyId: companyId, userName: userName, userId: userId } })
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };




  return (
    <div className='dashboard-container'>
      <div className='left-side'>
        <CandidateLeftSide user={{ userName, userId }} />
      </div>
      <div className='rightside'>

        <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
          <div className="search-bar" >
            <input style={{ borderRadius: '6px', height: '35px' }}
              type="text"
              name="search"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
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
        <div className="companyJob">
          {/* <h1>Companies that we have</h1> */}
          <div className="cards d-flex flex-wrap justify-content-around" style={{ minHeight: 'fit-content', minWidth: '1000px',marginLeft:'2px' }}>
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



              <p>Company not found. Please <Link to='/findCompany/company-form'>fill company details</Link>.</p>
            )}
          </div>
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
  );
};

export default CandidatesCompanies;

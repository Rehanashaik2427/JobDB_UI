import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormControl, Pagination, Row } from 'react-bootstrap';

import { Link, useNavigate } from 'react-router-dom';


const JobboxCompanyPage = () => {

  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
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
    fetchCompanyBySearch();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchCompanyBySearch();
  };


  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_API_URL}/displayCompanies`, { params: { page: page, size: pageSize } });
    setCompanies(response.data.content);
    setTotalPages(response.data.totalPages);
  };

  const fetchCompanyBySearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchCompany`, { params: { search: search, page: page, size: pageSize } });
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




  const handleClick = (companyId) => {
    navigate("/jobboxCompanyPage/eachCompanyPage", { state: { companyId: companyId } })
    // alert('Button clicked!');
  };
  const handleBack = () => {
    navigate("/"); // Navigate back to previous page
  };



  return (
    <div className="top-right-content">
       <Col xs={6}>
       <Button onClick={handleBack} variant="secondary">
            <FontAwesomeIcon icon={faArrowLeft} /> 
          </Button>

        </Col>
      <div className="candidate-search ">
        <Form onSubmit={handleSubmit} className="searchCompany w-45">
          <Row className=" d-flex  justify-content-space-around">

            <Col xs={4}>
              <FormControl
                type='text'
                name='search'

                placeholder='Search Company'

                value={search}
                onChange={handleSearchChange}
              />
            </Col>
            {/* <Col xs={1}>

              <Button type="submit" className="search-button w-100">
                <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'white' }} />

              </Button>
            </Col> */}
          </Row>
        </Form>
      </div>


      <div className="companyJob mt-4">
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
            
            <div>
              <p>Company not found. Please <Link to='/companies'>fill company details</Link>.</p>
            <div className="p-3">
            <div className="spinner-bubble spinner-bubble-primary m-5" />
            </div>
          </div>
          )}
        </div>

        <nav className="d-flex justify-content-center">
          <Pagination style={{ color: "purple" }}>
            <Pagination.Prev onClick={handlePreviousPage} disabled={page === 0} />
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <Pagination.Item key={pageNumber} active={pageNumber === page} onClick={() => handlePageChange(pageNumber)}>
                {pageNumber + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={handleNextPage} disabled={page === totalPages - 1} />
          </Pagination>
        </nav>



      </div>
    </div>
  );
};

export default JobboxCompanyPage;

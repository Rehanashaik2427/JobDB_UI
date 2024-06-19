import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormControl, Pagination, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const JobboxCompanyPage = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchCompanyBySearch();
  };

  useEffect(() => {
    if (search) {
      fetchCompanyBySearch();
    } else {
      fetchCompany();
    }
  }, [search, page, pageSize]);

  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_API_URL}/displayCompanies?page=${page}&size=${pageSize}`);
    setCompanies(response.data.content);
    setTotalPages(response.data.totalPages);
  };

  const fetchCompanyBySearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchCompany?search=${search}&page=${page}&size=${pageSize}`);
      setCompanies(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("No data Found" + error);
    }
    console.log("Search submitted:", search);
  };

  return (
    <div className="top-right-content">
      <div className="candidate-search text-center">
        <Form inline onSubmit={handleSubmit} className='searchCompany w-45 '>
          <Row className='align-items-center justify-content-center'>
            <Col xs={4}>
              <FormControl
                type='text'
                name='search'
                placeholder='Search Company'
                value={search}
                onChange={handleSearchChange}
              />
            </Col>
            <Col xs={1}>
              <Button type="submit" variant="primary" className='search-button w-100'>
                <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
              </Button>
            </Col>
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
                  <Link
                    to={{
                      pathname: `/jobboxCompanyPage/eachCompanyPage/${company.companyId}`, // Adjusted pathname to include companyId as URL parameter
                      state: { companyId: company.companyId }
                    }}
                    className='btn btn-primary'
                  >
                    View
                  </Link>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>Company not found. Please <Link to='/companies'>fill company details</Link>.</p>
          )}
        </div>
        <nav className="d-flex justify-content-center">
          <Pagination>
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

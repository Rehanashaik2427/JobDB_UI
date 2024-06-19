import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormControl, Row } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';


const JobboxCompanyPage = () => {

  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);


  const handlePageClick = (data) => {
    setPage(data.selected);
  };




  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_API_URL}/displayCompanies?page=${page}&size=${pageSize}`);


    setCompanies(response.data.content);
    setTotalPages(response.data.totalPages);
  };

  // useEffect hook to fetch jobs when the component mounts
  useEffect(() => {
    if (search) {
      fetchCompanyBySearch();
    }
    fetchCompany();
  }, [search, page, pageSize]);


  const fetchCompanyBySearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchCompany?search=${search}?page=${page}&size=${pageSize}`);
      setCompanies(response.data.content);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.log("No data Found" + error);
    }
    console.log("Search submitted:", search);

  };


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchCompanyBySearch();
  };




  return (
    <div className="top-right-content">
      <div className="candidate-search">
        <Form onSubmit={handleSubmit} className="searchCompany w-45">
          <Form.Label><h1>Companies that we have</h1></Form.Label>
          <Row className="align-items-center justify-content-center">
            <Col xs={4}>
              <FormControl
                type='text'
                name='search'
                placeholder='Search'
                value={search}
                onChange={handleSearchChange}
              />
            </Col>
            <Col xs={1}>
              <Button type="submit" className="search-button w-100">
                <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'white' }} />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="companyJob">
        
        <div className="cards">
          {companies.length > 0 ? (
            companies.map((company) => (
              <div className="company-card-job" key={company.companyId}>
                <p className="company-name">Company Name: <b>{company.companyName}</b></p>
                <p>Industry: <b>{company.industry}</b></p>
                <Link to={{
                  pathname: '/eachCompanyPage',
                  state: { companyId: company.companyId }
                }}>
                  <Button variant='primary' className='com'><h3>View</h3></Button>
                </Link>
              </div>
            ))
          ) : (
            <p>Company not found. Please <Link to='/companies'>fill company details</Link>.</p>
          )}
        </div>
        <Col md={4} className="mb-4">
          <Card body>


            <div className="d-flex justify-content-center">
            <ReactPaginate
              previousLabel={<i className="i-Previous" />}
              nextLabel={<i className="i-Next1" />}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={totalPages}
              marginPagesDisplayed={7}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              activeClassName="active"
              containerClassName="pagination"
              subContainerClassName="pages pagination"
            />
            </div>
          </Card>
        </Col>

      </div>
    </div>
  );
};

export default JobboxCompanyPage;
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card } from 'react-bootstrap';

import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';

const JobboxCompanyPage = () => {

  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setPage(selectedPage);
    localStorage.setItem('currentPage', selectedPage); // Store the page number in localStorage
  };
  


  const fetchCompany = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/companiesList?page=${page}&size=${pageSize}`);
      setCompanies(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("No data found: " + error);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    fetchCompanyBySearch();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchCompanyBySearch();
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
    const storedPage = localStorage.getItem('currentPage');
    if (storedPage !== null) {
      setPage(Number(storedPage));
    }
  }, [search, page, pageSize]);

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };


  const handleClick = (companyId) => {
    navigate("/jobboxCompanyPage/eachCompanyPage", { state: { companyId: companyId } })
    // alert('Button clicked!');
  };

  return (
    <div className="top-right-content">
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
      </div>

      <div className="companyJob mt-4" >
        <h1>Companies that we have</h1>
        <div className="cards d-flex flex-wrap justify-content-start" style={{ minHeight: 'fit-content', minWidth: '800px', marginLeft: '45px' }}>
          {companies.length > 0 ? (
            companies.map((company) => (
              <Card className="company-card-job" key={company.companyId} style={{ minWidth: '350px', maxWidth: '400px', flex: '1 0 300px', margin: '12px' }}>                  <Card.Body>
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
            forcePage={page}
          />
        </div>

      </div>
    </div>
  );
};

export default JobboxCompanyPage;

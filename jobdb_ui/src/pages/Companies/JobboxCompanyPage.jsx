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
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  


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

  const handleClick = (companyId) => {
    navigate("/jobboxCompanyPage/eachCompanyPage", { state: { companyId: companyId } })
    alert('Button clicked!');
  };




  return (
    <div>
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
            <p>Company not found. Please <Link to='/companies'>fill company details</Link>.</p>
          )}
        </div>
        <div className="pagination-container">
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
      

</div>
      </div>
  );
};

export default JobboxCompanyPage;

import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const JobboxCompanyPage = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
 const [pageSize, setPageSize] = useState(6); 
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  console.log(pageSize); 
  const handlePageClick = (data) => {
    const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1));
    setPage(selectedPage);
    localStorage.setItem('currentCompanyPage', selectedPage);
    console.log(page);
    console.log(selectedPage);
  };

  console.log(page);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = search
          ? `${BASE_API_URL}/searchCompany`
          : `${BASE_API_URL}/companiesList`;

          const params = {
            search,
            page,
            size: pageSize
          };
          console.log("Fetching data with params:", params); //
        const storedPage = localStorage.getItem('currentCompanyPage');
        const storedPageSize = localStorage.getItem('currentCompanyPageSize');
        if (storedPage !== null) {
          params.page = Number(storedPage);
          setPage(Number(storedPage));

        }
        else {
          params.page = page;

        }

        if (storedPageSize !== null) {
          params.size = Number(storedPageSize);
          setPageSize(Number(storedPageSize));
        }
        else {
          params.size = pageSize;
        }
        const response = await axios.get(url, { params });
        setCompanies(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log("Error fetching data: " + error);
      }
    };
    fetchData();
  }, [search, page, pageSize]);



  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); // Reset to page 0 on search
  };


  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    console.log("Selected Page Size:", size); // Log selected page size
  
    localStorage.setItem('currentCompanyPageSize', size);
    setPageSize(size);
    setPage(0); // Reset to page 0 on page size change
  };
  

  const handleClick = (companyId) => {
    navigate("/jobboxCompanyPage/eachCompanyPage", { state: { companyId } });
  };
  // Determine if the page size selector should be disabled
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  return (
    <div className="top-right-content">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-12">
        <img
          src="/jb_logo.png"
          alt="JobBox Logo"
          className="logo"
          style={{ backgroundColor: 'transparent', marginLeft: '12px' }}
        />
        <div className="search-bar">
          <input
            style={{ borderRadius: '6px', height: '35px' }}
            type="text"
            name="search"
            placeholder="Search Company"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>


      <div className="companyJob mt-4">
        <h1>Companies that we have</h1>
        <div className="cards d-flex flex-wrap justify-content-start" style={{ minHeight: 'fit-content', minWidth: '800px', marginLeft: '45px' }}>
          {companies.length > 0 ? (
            companies.map((company) => (
              <Card className="company-card-job" key={company.companyId} style={{ minWidth: '350px', maxWidth: '400px', flex: '1 0 300px', margin: '12px' }}>
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
            // <p>Company not found. Please <Link to='/findCompany/company-form'>fill company details</Link>.</p>
            <h2 className="text-center">Company Not found!!</h2>
          )}
        </div>
        {/* Pagination */}
        <div className="pagination-container d-flex justify-content-end align-items-center">
          <div className="page-size-select me-3">
            <label htmlFor="pageSize">Page Size:</label>
            <select id="pageSize" onChange={handlePageSizeChange} value={pageSize} disabled={isPageSizeDisabled}>
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
            forcePage={page} // Ensure the correct page is highlighted
          />
        </div>
      </div>
    </div>
  );
};

export default JobboxCompanyPage;

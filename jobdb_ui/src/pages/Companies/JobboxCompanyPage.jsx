import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const JobboxCompanyPage=()=>{

    const BASE_API_URL="http://localhost:8082/api/jobbox";
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
  
    
  
  
    const fetchCompany = async () => {
      const response = await axios.get(`${BASE_API_URL}/displayCompanies?page=${page}&size=${pageSize}`);
      
     
      setCompanies(response.data.content);
      setTotalPages(response.data.totalPages);
    };
  
    // useEffect hook to fetch jobs when the component mounts
    useEffect(() => {
      if(search)
        {
          fetchCompanyBySearch();
        }
      fetchCompany();
    }, [search,page, pageSize]);
  
  
  const fetchCompanyBySearch=async()=>{
    try{
      const response = await axios.get(`${BASE_API_URL}/searchCompany?search=${search}?page=${page}&size=${pageSize}`);
      setCompanies(response.data.content);
    setTotalPages(response.data.totalPages);

    }catch(error){
console.log("No data Found"+error);
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
              <form className="candidate-search" onSubmit={handleSubmit}>
                  <input
                      type='text'
                      name='search'
                      placeholder='Search'
                      value={search}
                      onChange={handleSearchChange}
                  />
                  <button type="submit">
                      <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
                  </button>
              </form>
          </div>

          <div className="companyJob">
              <h1> Companies that we have</h1>
              <div className="cards">
                  {companies.length > 0 ? (
                      companies.map((company) => (
                          <div className="company-card-job" key={company.companyId}>
                              <p className="company-name">Company Name: <b>{company.companyName}</b></p>
                              <p>Industry : <b>{company.industry}</b></p>
                              <Link to={{
                                  pathname: '/eachCompanyPage',
                                  state: { companyId: company.companyId }
                              }} ><button className='com'><h3>View</h3></button></Link>
                          </div>
                      ))
                  ) : (
                      <p>Company not found. Please <Link to='/companies'>fill company details</Link>.</p>
                  )}
              </div>
              <nav>
                  <ul className='pagination'>
                      <li>
                          <button className='page-button' onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
                      </li>
                      {[...Array(totalPages).keys()].map((pageNumber) => (
                          <li key={pageNumber} className={pageNumber === page ? 'active' : ''}>
                              <button className='page-link' onClick={() => handlePageChange(pageNumber)}>{pageNumber + 1}</button>
                          </li>
                      ))}
                      <li>
                          <button className='page-button' onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
                      </li>
                  </ul>
              </nav>
          </div>
      </div>
  );
};

export default JobboxCompanyPage;
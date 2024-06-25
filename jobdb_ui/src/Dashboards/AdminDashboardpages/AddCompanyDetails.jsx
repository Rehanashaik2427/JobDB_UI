import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';
import ReactPaginate from 'react-paginate';

const AddCompanyDetails = () => {


  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const navigate = useNavigate();




  const [companyData, setCompanyData] = useState([]);

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


  useEffect(() => {
    fetchCompanyData();
  }, [page, pageSize]);


  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/displayCompanies?page=${page}&size=${pageSize}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch company data');
      // }


      setCompanyData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };


  return (
    <div className='dashboard-container'>
      <div className='leftside'>
        <AdminleftSide />
      </div>

      <div className="rightSide">
        <h2>Add Company Details</h2>
        <Table hover className='text-center' style={{ marginLeft: '12px' }}>
          <thead className="table-light">
            <tr>
              <th>Company Name</th>
              <th>Add Detail</th>
            </tr>
          </thead>
          <tbody>
            {companyData.map((company) => (
              <tr key={company.companyId}>
                <td>{company.companyName}</td>
                <td><Link to={{
                  pathname: '/admin-dashboard/companyDetailsByAdmin',
                  state: { companyName: company.companyName }
                }} onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin-dashboard/companyDetailsByAdmin', { state: { companyName: company.companyName } });
                }}>ADD</Link></td>
              </tr>

            ))}
          </tbody>
        </Table>


        <div className="pagination-container">
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
    </div>
  )
}

export default AddCompanyDetails

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const AddCompanyDetails = () => {


  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const navigate = useNavigate();
  const location = useLocation();
  const [companyData, setCompanyData] = useState([]);
  const currentCompanyPage = location.state?.currentCompanyPage || 0;
  const [page, setPage] = useState(currentCompanyPage);
  const currentCompanyPageSize = location.state?.currentCompanyPageSize || 5;
  const [pageSize, setPageSize] = useState(currentCompanyPageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const state1 = location.state || {};
  console.log(state1)
  console.log("current page from company details by admin", currentCompanyPage)

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  useEffect(() => {
    if (location.state?.currentCompanyPage === undefined && location.state?.currentCompanyPageSize) {
      setPage(0);
    }
  }, [location.state?.currentCompanyPage, location.state?.currentCompanyPageSize]);
  useEffect(() => {
    fetchCompanyData();
  }, [page, pageSize]);


  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/companiesList?page=${page}&size=${pageSize}`);
      setCompanyData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size changes
  };

  return (
    <div className='dashboard-container'>
      <div className='left-side'>
        <AdminleftSide />
      </div>

      <div className="right-side">
        {companyData.length > 0 ? (
          <>
            <h2>Add Company Details</h2>
            <div className='table-details-list'>
              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr>
                    <th>Company Name</th>
                    <th>Contact Number</th>
                    <th>Company Email</th>
                    <th>Industry</th>
                    <th onClick={() => handleSort('location')}>
                      Location {sortedColumn === 'location' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>Description</th>
                    <th onClick={() => handleSort('date')}>
                      Submit Date {sortedColumn === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>Status</th>
                    <th onClick={() => handleSort('actionDate')}>
                      Action Date {sortedColumn === 'actionDate' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>Add Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.map((company) => (
                    <tr key={company.companyId}>
                      <td>{company.companyName}</td>
                      <td>{company.contactNumber}</td>
                      <td>{company.jobboxEmail}</td>
                      <td>{company.industry}</td>
                      <td>{company.location}</td>
                      <td>{company.discription}</td>
                      <td>{company.date}</td>
                      <td>{company.companyStatus}</td>
                      <td>{company.actionDate}</td>
                      <td><Link to={{
                        pathname: '/admin-dashboard/companyDetailsByAdmin',
                        state: { companyName: company.companyName, currentCompanyPage: page ,currentCompanyPageSize:pageSize}
                      }} onClick={(e) => {
                        e.preventDefault();
                        navigate('/admin-dashboard/companyDetailsByAdmin', { state: { companyName: company.companyName, currentCompanyPage: page ,currentCompanyPageSize:pageSize} });
                      }}>ADD</Link></td>
                    </tr>

                  ))}
                </tbody>
              </Table>
            </div>
          </>
        ) : (
          <h4 className='text-center'>Loading.. .!!</h4>
        )}
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
  )
}

export default AddCompanyDetails

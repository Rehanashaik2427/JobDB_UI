import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const AddCompanyDetails = () => {


  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const navigate = useNavigate();




  const [companyData, setCompanyData] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };


  useEffect(() => {
    fetchCompanyData();
  }, [page, pageSize]);


  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/comapniesList?page=${page}&size=${pageSize}`);
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
      {companyData.length > 0 ? (
        <>
        <h2>Add Company Details</h2>
        <Table hover className='text-center' style={{ marginLeft: '12px' }}>
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
                <td>{company.description}</td>               
                <td>{company.date}</td>
                <td>{company.companyStatus}</td>
                <td>{company.actionDate}</td>
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
        </>
      ): (
          <h4 className='text-center'>Loading.. .!!</h4>
        )}
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

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
// import './AdminDashboard.css';
import { BsXCircle } from 'react-icons/bs';

import AdminleftSide from './AdminleftSide';
const BASE_API_URL = "http://localhost:8082/api/jobbox";

const CompanyValidation = () => {

  const [companyData, setCompanyData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [approvalMessages, setApprovalMessages] = useState({});
  const [rejectMessages, setRejectMessages] = useState({});

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
  }, [page, pageSize, sortedColumn, sortOrder]);

  const fetchCompanyData = async () => {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/displayCompanies`, { params });
      setCompanyData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const approveCompany = async (companyId, companyName) => {
    console.log('Request Approved');
    try {
      const approved = "Approved";
      const res = await axios.put(`${BASE_API_URL}/updateApproveCompany`, null, {
        params: {
          companyName,
          actionDate: new Date().toLocaleDateString(),
          companyStatus: approved,
        },
      });
      console.log(res.data);
      setApprovalMessages((prev) => ({ ...prev, [companyId]: 'Approval successful' }));
      fetchCompanyData();
    } catch (error) {
      console.log('Error approving request:', error);
    }
  };

  const rejectCompany = async (companyId, companyName) => {
    console.log('Request Rejected');
    try {
      const reject = "Rejected";
      const res = await axios.put(`${BASE_API_URL}/updateApproveCompany`, null, {
        params: {
          companyName,
          actionDate: new Date().toLocaleDateString(),
          companyStatus: reject,
        },
      });
      console.log(res.data);
      setRejectMessages((prev) => ({ ...prev, [companyId]: 'Rejected Company' }));
      fetchCompanyData();
    } catch (error) {
      console.log('Error rejecting request:', error);
    }
  };

  return (
    <div className='dashboard-container'>
      <div className='leftside'>
        <AdminleftSide />
      </div>

      <div className="rightSide">
        <h2 style={{ textAlign: 'center' }}>Details of Company Validation</h2>

        <Table hover className='text-center' style={{ marginLeft: '8px' }}>
          <thead className="table-light">
            <tr>
              <th onClick={() => handleSort('companyName')}>
                Company Name {sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companyData.map((company) => (
              <tr key={company.companyId}>
                <td>{company.companyName}</td>
                <td>{company.contactNumber}</td>
                <td>{company.companyEmail}</td>
                <td>{company.industry}</td>
                <td>{company.location}</td>
                <td>{company.description}</td>
                <td>{company.date}</td>
                <td>{company.companyStatus}</td>
                <td>{company.actionDate}</td>
                <td>
                  <FaCheckCircle className='approved' style={{ color: 'green', cursor: 'pointer' }} onClick={() => approveCompany(company.companyId, company.companyName)} />
                  <BsXCircle className='icon-button reject' style={{ color: 'blue' }} onClick={() => rejectCompany(company.companyId, company.companyName)} />

                </td>
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
  );
}

export default CompanyValidation;

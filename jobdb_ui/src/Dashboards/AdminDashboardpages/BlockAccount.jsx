import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { BsCheckCircle } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert2';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const BlockAccount = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";

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
  }, [page, pageSize, sortedColumn, sortOrder]);

  const fetchCompanyData = async () => {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/rejectedCompaniesList`, { params });
      setCompanyData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const appliedOn = new Date(); // Get current date and time
  const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
  const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
  const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
  
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate); // Output: 2024-07-09 (example for today's date)
  const approveCompany = async (companyId, companyName) => {
    console.log('Request Approved');
    try {
      const approved = "Approved";
      const res = await axios.put(`${BASE_API_URL}/updateApproveCompany`, null, {
        params: {
          companyName,
          actionDate:formattedDate,
          companyStatus: approved,
        },
      });
      if (res.data) {
        await swal.fire({
          icon: "success",
          title: "Approval Successful!",
          text: "The request has been approved."
        });
        fetchCompanyData();
        console.log(res.data);

      } else {
        throw new Error('Approval failed');
      }
    } catch (error) {
      console.log('Error approving request:', error);
      await swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: "Failed to approve the request. Please try again later."
      });
    }
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

      <div className="rightside">
        <h2>Blocked Accounts</h2>

        <div className="blockedAccount">
          <div>
          <h2>List of Rejected Companies</h2>
          {companyData.length > 0 ? (
            <>
              <Table hover className='text-center' style={{ marginLeft: '8px' }}>
                <thead className="table-light">
                  <tr>
                    <th onClick={() => handleSort('companyName')}>
                      Company Name {sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.map((company) => (
                    <tr key={company.companyId}>
                      <td>{company.companyName}</td>
                      <td>Rejected</td>
                      <td>

                        <span className="icon-button select" onClick={() => approveCompany(company.companyId, company.companyName)}>
                          <BsCheckCircle />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
            />
          </div>
          </div>
        </div>

        <div className="blockedAccount">
          <h2>List of Rejected Hr's</h2>

        </div>
      </div>
    </div>
  )
}

export default BlockAccount

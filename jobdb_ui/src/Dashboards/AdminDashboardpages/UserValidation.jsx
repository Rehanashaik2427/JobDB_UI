import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const BASE_API_URL = "http://localhost:8082/api/jobbox";

const UserValidation = () => {
  const [userData, setUserData] = useState([]);
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
    fetchUserData();
  }, [page, pageSize, sortedColumn, sortOrder]);

  const fetchUserData = async () => {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/displayUsers`, { params });
      setUserData(response.data.content);
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
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  return (
    <div className='dashboard-container'>
      <div className='left-side'>
        <AdminleftSide />
      </div>

      <div className="right-side">
      {userData.length > 0 ? (
      <>
          <h2>Users List</h2>
          <div className='table-details-list'>
          <Table hover className='text-center' >
            <thead className="table-light">
              <tr>
                <th onClick={() => handleSort('userName')}>
                  User Name {sortedColumn === 'userName' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('userRole')}>
                  User Role {sortedColumn === 'userRole' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('userEmail')}>
                  User Email {sortedColumn === 'userEmail' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('approvedOn')}>
                  Action Date {sortedColumn === 'approvedOn' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('userStatus')}>
                  Status & Actions {sortedColumn === 'userStatus' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.map(user => (
                <tr key={user.userId}>
                  <td>{user.userName}</td>
                  <td>{user.userRole}</td>
                  <td>{user.userEmail}</td>
                  <td>{user.approvedOn}</td>
                  <td>{user.userStatus}</td>
                </tr>
              ))}
            </tbody>
          </Table>
           
        </div></>
         ): (
          <h4 className='text-center'>Loading.. .!!</h4>
        )}
        {/* Pagination */}
        <div className="pagination-container d-flex justify-content-end align-items-center">
                  <div className="page-size-select me-3">
                    <label htmlFor="pageSize">Page Size:</label>
                    <select id="pageSize" onChange={handlePageSizeChange} value={pageSize} disabled={isPageSizeDisabled}>
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
  );
};

export default UserValidation;

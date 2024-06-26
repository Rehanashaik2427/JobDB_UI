import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import AdminleftSide from './AdminleftSide';
import './AdminDashboard.css';
import ReactPaginate from 'react-paginate';
import { Breadcrumb, Button, Table } from 'react-bootstrap';
const BASE_API_URL = "http://localhost:8082/api/jobbox";

const AdminAction = () => {
  const [hrDetails, setHRDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalMessages, setApprovalMessages] = useState({});
  const [rejectMessages, setRejectMessages] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHRDetails = async () => {
    try {

      const params = {
        page: page,
        size: pageSize,
      };
      const response = await axios.get(`${BASE_API_URL}/getHr`, { params })
      setTotalPages(response.data.totalPages);
      setHRDetails(response.data.content);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRDetails();
  }, [page, pageSize]);

  const currentTime = new Date().toLocaleDateString();

  const approveRequest = async (userEmail, userId) => {
    console.log('Request Approved');
    const approved = "Approved";

    try {
      const res = await axios.put(`${BASE_API_URL}/updateApprove?userEmail=${userEmail}&approvedOn=${currentTime}&userStatus=${approved}`);
      console.log(res.data);
      console.log(res.data);
      if (res.data) {
        await swal.fire({
          icon: "success",
          title: "Approval Successful!",
          text: "The request has been approved."
        });
        fetchHRDetails(); // Reload HR details after approval
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

  const rejectRequest = async (userEmail, userId) => {
    console.log('Request Rejected');
    const rejected = "Rejected";
    // Handle reject request logic here   
    try {
      const res = await axios.put(`${BASE_API_URL}/updateApprove?userEmail=${userEmail}&approvedOn=${currentTime}&userStatus=${rejected}`);
      console.log(res.data);

      if (res.data) {
        await swal.fire({
          icon: "success",
          title: "Rejection Successful!",
          text: "The request has been rejected."
        });
        fetchHRDetails(); // Reload HR details after rejection
      } else {
        throw new Error('Rejection failed');
      }
    } catch (error) {
      console.log('Error rejecting request:', error);
      await swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: "Failed to reject the request. Please try again later."
      });
    }
  };


  const handlePageClick = (data) => {
    setPage(data.selected);
  };


  return (
    <div className="dashboard-container">
      <div className='leftside'>
        <AdminleftSide />
      </div>

      <div className="rightSide">
        <header className="admin-header">
          <h2 style={{ color: 'wheat' }}>Admin Dashboard</h2>
        </header>
        <Table hover className='text-center' style={{ marginLeft: '12px' }}>
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hrDetails.map(hr => (
              <tr key={hr.userId}>
                <td>{hr.userName} ({hr.companyName} HR)</td>
                <td>{hr.userEmail}</td>
                <td>{hr.userStatus}</td>
                <td>
                  <Button key='success' variant='success' className="m-1 text-capitalize" onClick={() => approveRequest(hr.userEmail, hr.userId)}>
                    Approve
                  </Button>

                  <Button key='danger' variant='danger' className="m-1 text-capitalize" onClick={() => rejectRequest(hr.userEmail, hr.userId)}>
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="pagination-container">
          <Breadcrumb routeSegments={[{ name: 'UI Kits', path: '/uikits' }, { name: 'Table' }]} />

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

export default AdminAction;

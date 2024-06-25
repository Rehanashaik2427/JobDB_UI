import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AdminleftSide from './AdminleftSide';
import './AdminDashboard.css';
const BASE_API_URL = "http://localhost:8082/api/jobbox";

const AdminAction = () => {
  const [hrDetails, setHRDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalMessages, setApprovalMessages] = useState({});
  const [rejectMessages, setRejectMessages] = useState({});

  const fetchHRDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHr`);
      setHRDetails(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRDetails();
  }, []);

  const currentTime = new Date().toLocaleDateString();
  
  const approveRequest = async (userEmail,userId) => {
    console.log('Request Approved');
    const approved="Approved";
    try {
      const res = await axios.put(`${BASE_API_URL}/updateApprove?userEmail=${userEmail}&approvedOn=${currentTime}&userStatus=${approved}`);
      console.log(res.data);
      const updatedMessages = { ...approvalMessages, [userId]: 'Approval successful' };
      setApprovalMessages(updatedMessages);
      fetchHRDetails();
     
      // If needed, update the state or perform additional actions after successful approval
    } catch (error) {
      console.log('Error approving request:', error);
      // Handle error here, e.g., show a notification to the user
    }
  };

  const rejectRequest = async(userEmail,userId) => {
    console.log('Request Rejected');
    const rejected="Rejected";
    // Handle reject request logic here   
    try {
      const res = await axios.put(`${BASE_API_URL}/updateApprove?userEmail=${userEmail}&approvedOn=${currentTime}&userStatus=${rejected}`);
      console.log(res.data);

      const updatedMessages = { ...rejectMessages, [userId]: 'Rejected' };
      setRejectMessages(updatedMessages);
      fetchHRDetails();

     
      // If needed, update the state or perform additional actions after successful approval
    } catch (error) {
      console.log('Error approving request:', error);
      // Handle error here, e.g., show a notification to the user
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div className="body">
       <div className='leftside'>
          <AdminleftSide />
        </div>
        
        <div className="rightSide">
      <header className="admin-header">
        <h2 style={{color:'wheat'}}>Admin Dashboard</h2>
      </header>
      <main>
        {hrDetails.map(hr => (
          <div className="request-container" key={hr.userId}>
            <div className="hr-details">
              <p>Name: {hr.userName} come to join as {hr.companyName} HR</p>
              <p>Email: {hr.userEmail}</p>  
              <h1>{hr.userStatus}</h1>
            </div>
            <div className="button-container">
              <button className="approve-btn-adminAction" onClick={() => approveRequest(hr.userEmail,hr.userId)}>
                Approve
              </button>
              <button className="reject-btn-adminAction" onClick={() => rejectRequest(hr.userEmail)}>
                Reject
              </button>
            </div>
            {approvalMessages[hr.userId] && <p className="approval-message">{approvalMessages[hr.userId]}</p>}
            {rejectMessages[hr.userId] && <p className="reject-message">{rejectMessages[hr.userId]}</p>}
          </div>
        ))}
      </main>
    </div>
    </div>
  
  );
  
};

export default AdminAction;

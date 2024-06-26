import React from 'react';
import { Table } from 'react-bootstrap';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const Myprofile = ({ userType }) => {
  return (
    <div className='dashboard-container'>
      <div className='leftside'>
        <AdminleftSide />
      </div>

      <div className='rightside'>
        <div className='admin-profile'>
          <Table hover className='text-center'style={{ marginLeft: '8px' }}>
            <thead className="table-light" >
              <tr>
                <th>Company Name</th>
                <th>Company Type</th>
                <th>Validated Company</th>
                <th>UserName</th>
                <th>UserType</th>
                <th>User Validation</th>
                <th>User Status</th>
                <th>Job Role</th>
                <th>Job Status</th>
                <th>Last Login Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Company Name</td>
                <td>Company Type</td>
                <td><p>if user type candidate No need Company name</p></td>
                <td>UserName</td>
                <td>UserType</td>
                <td>User Validation</td>
                <td><p>Approve/Reject</p></td>
                <td>Job Role</td>
                <td><p>Active/InActive</p></td>
                <td><p>Date time</p></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

    </div>


  )
}

export default Myprofile

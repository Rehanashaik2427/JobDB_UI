import React from 'react';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const Myprofile = ({ userType }) =>  {
  return (
    <div className='body'>
        <div className='leftside'>
          <AdminleftSide />
        </div>

    <div className='rightside'>
      <div className='admin-profile'>
         <table id="user-table" className="user-table" >
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

         </table>
      </div>
    </div>

</div>
  )
}

export default Myprofile

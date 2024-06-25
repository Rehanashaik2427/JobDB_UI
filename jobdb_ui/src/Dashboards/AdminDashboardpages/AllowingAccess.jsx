import React, { useState } from 'react';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const AllowingAccess = () => {
  const [accessData] = useState([
    { user: 'HR', accessTo: 'Posting Jobs', accessStatus: 'Allow' },
    { user: 'Candidate', accessTo: 'Applying Jobs', accessStatus: 'Allow' },
    { user: 'HR', accessTo: 'Posting Jobs', accessStatus: 'Allow' },
  ]);
  return (
    <div className='dashboard-container'>
          <div className='leftside'>
          <AdminleftSide />
        </div>

    <div className="rightSide">
      <div>
        <h2 style={{textAlign:'center'}}>Access Dashboard</h2>
        <div className="access-table">
        <table id="user-table" className="user-table">
    
    <tr >
      <th >User</th>
      <th >Access To</th>
      <th >Access Status</th>
    </tr>


    {accessData.map((data, index) => (
      <tr key={index} >
        <td >{data.user}</td>
        <td >{data.accessTo}</td>
        <td >{data.accessStatus}</td>
      </tr>
    ))}

</table>
        </div>
      </div>
    </div>
</div>
  )
}

export default AllowingAccess

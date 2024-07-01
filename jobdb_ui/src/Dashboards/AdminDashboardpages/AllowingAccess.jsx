import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
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
      <div className='left-side'>
        <AdminleftSide />
      </div>

      <div className="rightside">
        <div>
          <h2 style={{ textAlign: 'center' }}>Access Dashboard</h2>

            <Table hover className='text-center'style={{ marginLeft: '12px' }}>
              <thead className="table-light">
                <tr >
                  <th >User</th>
                  <th >Access To</th>
                  <th >Access Status</th>
                </tr>
              </thead>
              <tbody>
                {accessData.map((data, index) => (
                  <tr key={index} >
                    <td >{data.user}</td>
                    <td >{data.accessTo}</td>
                    <td >{data.accessStatus}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
  )
}

export default AllowingAccess

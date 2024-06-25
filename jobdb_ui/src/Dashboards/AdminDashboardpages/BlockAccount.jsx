import React from 'react';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';
const BlockAccount = () => {
  return (
    <div className='body'>
          <div className='leftside'>
          <AdminleftSide />
        </div>

    <div className="rightSide">
      <h2>Blocked Accounts</h2>

      <div className="blockedAccount">
        <h2>Blocked Company's details</h2>
        <div>
      
          <h3>Company 1</h3>
          <h3>Company 2</h3>
          <h3>Company 3</h3>
        </div>
        <div>
          
          <h3>Blocked</h3>
          <h3>Blocked</h3>
          <h3>Blocked</h3>
        </div>
      </div>
      <div className="blockedAccount">
        <h2>Blocked User's details</h2>
        <div>
          
          <h3>User1 (hr)</h3>
          <h3>User2 (candidate)</h3>
          <h3>User3 (hr)</h3>
        </div>
        <div>
          
          <h3>Blocked</h3>
          <h3>Blocked</h3>
          <h3>Blocked</h3>
        </div>
      </div>
    </div>
</div>
  )
}

export default BlockAccount


import React, { useEffect, useState } from 'react';

import axios from 'axios';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';
import { Table } from 'react-bootstrap';
const Contacts = () => {

  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactId, setContactId] = useState();
  useEffect(() => {
    fetchContacts();
  }, [page, pageSize]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getContactMessages?page=${page}&size=${pageSize}`);
      setContacts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSendMessage = async (message) => {
    console.log('Sending message to:', selectedEmail);
    console.log('Message:', message);
    try {
      // Send message using API
      // Use selectedEmail and message state variables
      const response = await axios.put(`${BASE_API_URL}/sendReplyMessages?message=${message}&replyTo=${selectedEmail}&contactId=${contactId}`);
  
      // After sending the message, you can close the modal
      setShowModal(false);
      if (response)
        alert("Reply send successfully");
      // Optionally, you can update the UI to indicate that the message has been sent

      fetchContacts();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const openModal = (email, contactID) => {
    setSelectedEmail(email);
    setContactId(contactID);
    console.log("mm",contactID);
    setShowModal(true);

  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmail('');
    setMessage('');
  };


  return (
    <div className='body'>
      <div className='leftside'>
        <AdminleftSide />
      </div>

      <div className="rightSide">
        <h2 style={{ textAlign: 'center' }}>Request from the Users</h2>
        <div className="help">
          <div className='contacts-table'>
          <Table hover className='text-center'>
          <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Replying To Users</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td>{contact.message}</td>
                    <td>
                      {contact.replyMsg === null ? (
                        <button onClick={() => openModal(contact.email, contact.contactID)}>Reply</button>
                      ) : (
                        <h3>Replied</h3>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Compose Message</h2>
                <p>To: {selectedEmail}</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                ></textarea>
                <button onClick={() => handleSendMessage(message)}>Send</button>
              </div>
            </div>
          )}
        </div>
        <nav>
          <ul className='pagination'>
            <li>
              <button className='page-button' onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
            </li>
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <li key={pageNumber} className={pageNumber === page ? 'active' : ''}>
                <button className='page-link' onClick={() => handlePageChange(pageNumber)}>{pageNumber + 1}</button>
              </li>
            ))}
            <li>
              <button className='page-button' onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Contacts

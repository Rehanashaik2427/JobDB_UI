import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Form, Modal, Table } from 'react-bootstrap';
import { SiImessage } from 'react-icons/si';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import Swal from 'sweetalert2';
import { MdDelete } from 'react-icons/md';

const MyApplication = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const applicationStatus = location.state?.applicationStatus;
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [resumeNames, setResumeNames] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumeNames();
  }, [applications]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
  };

  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)

  useEffect(() => {
    if (search) {
      fetchApplicationBySearch(search);
    } else if (applicationStatus) {
      fetchApplicationsByStatus(applicationStatus);
    } else {
      fetchApplications();
    }
  }, [applicationStatus, page, pageSize, search, sortOrder, sortedColumn, userId]);

  const fetchApplications = async () => {
    try {
      const params = {
        userId: userId,
        page: page,
        pageSize: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };

      const response = await axios.get(`${BASE_API_URL}/applicationsPagination`, { params });

      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }

      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchApplicationsByStatus = async (applicationStatus) => {
    try {
      const params = {
        searchStatus: applicationStatus,
        userId: userId,
        page: page,
        pageSize: pageSize,
      };

      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }

      const response = await axios.get(`${BASE_API_URL}/applicationsBySearch`, { params });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications by status:', error);
    }
  };

  const fetchApplicationBySearch = async (search) => {
    try {
      const params = {
        searchStatus: search,
        userId: userId,
        page: page,
        pageSize: pageSize,
      };

      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }

      const response = await axios.get(`${BASE_API_URL}/applicationsBySearch`, { params });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications by search:', error);
    }
  };

  const fetchResumeNames = async () => {
    const names = {};
    try {
      for (const application of applications) {
        const name = await getResumeName(application.resumeId);
        names[application.resumeId] = name;
      }
      setResumeNames(names);
    } catch (error) {
      console.error('Error fetching resume names:', error);
    }
  };

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const toggleSettings = () => {
    navigate('/');
  };

  const getResumeName = async (resumeId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getResumeMessageById?resumeId=${resumeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resume name:', error);
      return 'Unknown';
    }
  };



  const [chats, setChats] = useState([]); // Initialize chats as an empty array
  const [jobStatuses, setJobStatuses] = useState({});
  const [unreadMessages, setUnreadMessages] = useState([]); // State to track unread messages

  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = {};
      const chats = []; // Initialize chats as an array
      const unread = {}; // Initialize unread messages state

      for (const application of applications) {
        try {
          const status = await getJobStatus(application.jobId);
          const chat = await fetchChat(application.applicationId);
          const countUnread = await fetchCountUnreadMessage(application.applicationId);
          statuses[application.applicationId] = status;
          chats.push(chat); // Push chat into the array
          unread[application.applicationId] = countUnread;

        } catch (error) {
          console.error('Error fetching job status:', error);
          statuses[application.id] = 'Unknown';
        }
      }
      setJobStatuses(statuses);
      setChats(chats); // Set chats as the array of fetched chats
      setUnreadMessages(unread); // Set unread messages state
    };
    fetchStatuses();
  }, [applications]);

  const getJobStatus = async (jobId) => {
    if (jobId === 0) {
      return 'Job not available';
    } else {
      try {
        const response = await axios.get(`${BASE_API_URL}/getJob?jobId=${jobId}`);
        return response.data.jobStatus ? 'Active' : 'Not Active';
      } catch (error) {
        console.error("Error fetching job status:", error);
        throw error;
      }
    }
  };

  const renderJobStatus = (applicationId) => {
    return jobStatuses[applicationId] || 'Loading...';
  };
  const renderUnreadMessage = (applicationId) => {
    const unreadCount = unreadMessages[applicationId];
    if (unreadCount > 0) {
      return (
        <span
          style={{

            top: '0',
            marginTop: '10px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            // width: '0px',
            // height: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {unreadCount}
        </span>
      );
    } else {
      return null; // Return null if there are no unread messages
    }
  };

  const fetchCountUnreadMessage = async (applicationId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/fetchCountUnreadMessageForCandidateByApplicationId?applicationId=${applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }
  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return ''; // Handle case where name is undefined
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  const initials = getInitials(userName);
  const [showLeftSide, setShowLeftSide] = useState(false);

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [inputValue, setInputValue] = useState('');


  const fetchChat = async (applicationId) => {

    try {
      const response = await axios.get(`${BASE_API_URL}/fetchChatByApplicationId?applicationId=${applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const [applicationId, setApplicationId] = useState(0);
  const [chatsByApplication, setChatsByApplication] = useState([]);
  const fetchChatByApplication = async (applicationId) => {
    setApplicationId(applicationId);
    setUnreadMessages(0);
    try {
      await axios.put(`${BASE_API_URL}/markHRMessagesAsRead?applicationId=${applicationId}`);
      const response = await axios.get(`${BASE_API_URL}/fetchChatByApplicationId?applicationId=${applicationId}`);
      setChatsByApplication(response.data);
      // Mark messages as read when opening chat modal

      setShowModal(true);

      // Clear unread message indicator
      // setUnreadMessages({ ...unreadMessages, [applicationId]: false });
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  const handleDelete = async(applicationId) => {
   
   try{
    const confirmDelete =  await axios.delete(`${BASE_API_URL}/deleteApplicationByApplicationId?applicationId=${applicationId}`);
if(confirmDelete.data)
{
  fetchApplications();
}
   }catch{
    console.log("Unable to delete appliction")
   } // Show a confirmation dialog before deletion
   
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowChat(false); // Optionally reset showChat state
    setInputValue(''); // Reset input value when closing modal
  };

  const handleSend = async () => {
    try {
      await axios.put(`${BASE_API_URL}/markHRMessagesAsRead?applicationId=${applicationId}`);
      const responce = await axios.put(`${BASE_API_URL}/saveCandidateChatByApplicationId?applicationId=${applicationId}&candidatechat=${inputValue}`);
      console.log('Sending message:', inputValue);

      // console.log('Messages marked as read for applicationId:', applicationId);

      // // Clear unread message indicator
      // setUnreadMessages({ ...unreadMessages, [applicationId]: false });

      // Fetch updated chat messages or update state as needed
      fetchChatByApplication(applicationId);
      setInputValue('');

    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };


  // Function to format time with AM/PM
  function formatMessageDateTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  function isDifferentDay(date1, date2) {
    const day1 = new Date(date1).getDate();
    const day2 = new Date(date2).getDate();
    return day1 !== day2;
  }

  // Function to format date with only day
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { weekday: 'long' }; // Show only the full day name
    return date.toLocaleDateString('en-US', options);
  }

  const modalBodyRef = useRef(null);
  useEffect(() => {
    // Scroll to bottom of modal body when chats change (new message added)
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight;
    }
  }, [chatsByApplication]);

  return (
    <div className='dashboard-container'>
      <div className={`left-side ${showLeftSide ? 'show' : ''}`}>
        <CandidateLeftSide user={{ userName, userId }} />
      </div>
      <div className="right-side" style={{ overflowY: 'scroll' }}>
        <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
          <div className="search-bar">
            <input
              style={{ borderRadius: '6px', height: '35px' }}
              type="text"
              name="search"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <Dropdown className="ml-2">
            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
              <div
                className="initials-placeholder"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'grey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {initials}
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-3">
              <Dropdown.Item as={Link} to="/">
                <i className="i-Data-Settings me-1" /> Account settings
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/" onClick={toggleSettings}>
                <i className="i-Lock-2 me-1" /> Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Chat</Modal.Title>
          </Modal.Header>

          <Modal.Body ref={modalBodyRef}>
            <div className="chat-messages">
              {chatsByApplication.length > 0 ? (
                chatsByApplication.map((chat, index) => (
                  <div key={chat.id} className="chat-message">
                    {/* Render date if it's the first message or a new day */}
                    {index === 0 || isDifferentDay(chatsByApplication[index - 1].createdAt, chat.createdAt) && (
                      <div className="d-flex justify-content-center align-items-center text-center font-weight-bold my-3">
                        {formatDate(chat.createdAt)}
                      </div>
                    )}
                    {/* Render HR message if present */}
                    {chat.hrMessage && (
                      <div className="message-right">
                        {chat.hrMessage}
                        <div className="message-time">
                          {formatMessageDateTime(chat.createdAt)}
                        </div>
                      </div>
                    )}

                    {/* Render candidate message if present */}
                    {chat.candidateMessage && (
                      <div className="message-left">
                        {chat.candidateMessage}
                        <div className="message-time">
                          {formatMessageDateTime(chat.createdAt)}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </Modal.Body>



          <Modal.Footer>
            <Form.Group controlId="messageInput" className="mb-2">
              <Form.Control
                type="text"
                as='textarea'
                placeholder="Enter your message"
                value={inputValue}
                onChange={handleInputChange}
                style={{ width: '350px' }}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleSend}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </Modal.Footer>
        </Modal>

        <div style={{ marginLeft: '5px', marginRight: '50px' }}>
          {applications.length > 0 ? (
            <>
              <Table hover className='text-center' style={{ marginLeft: '5px', marginRight: '12px' }}>
                <thead className="table-light">
                  <tr>
                    <th scope="col" onClick={() => handleSort('companyName')}>
                      Company Name{sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope="col" onClick={() => handleSort('jobRole')}>
                      Job Title{sortedColumn === 'jobRole' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope="col" onClick={() => handleSort('appliedOn')}>
                      Applied On{sortedColumn === 'appliedOn' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope="col">Resume Profile</th>
                    <th scope="col">Job Status</th>
                    <th scope="col" onClick={() => handleSort('applicationStatus')}>
                      Action {sortedColumn === 'applicationStatus' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope="col">Chat</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application, index) => (
                    <tr key={index}>
                      <td>{application.companyName}</td>
                      <td>{application.jobRole}</td>
                      <td>{application.appliedOn}</td>
                      <td>{resumeNames[application.resumeId]}</td>
                      <td>{renderJobStatus(application.applicationId)}</td>
                      <td>{application.applicationStatus}</td>

                      <td>
                        {chats[index] && chats[index].length > 0 ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            {unreadMessages[application.applicationId] > 0 && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '-5px',
                                  right: '-15px',
                                  backgroundColor: 'red',
                                  color: 'white',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  zIndex: 1, // Ensure notification badge is above SiImessage icon
                                }}
                              >
                                {unreadMessages[application.applicationId]}
                              </span>
                            )}
                            <SiImessage
                              size={25}
                              onClick={() => {
                                fetchChatByApplication(application.applicationId);

                              }}
                              style={{ color: 'green', cursor: 'pointer' }}
                            />
                          </div>

                        ) : (
                          <SiImessage
                            size={25}
                            style={{ color: 'grey', cursor: 'not-allowed' }}
                          />
                        )}
                      </td>
                      <td>
                      <span className='delete cursor-pointer text-danger me-2' onClick={() => {
                              Swal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!"
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleDelete(application.applicationId);
                                }
                              });
                            }}>
                              <MdDelete className="text-danger" size={18} />
                            </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

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
            </>
          ) : (
            <h4 className='text-center'>No Applications Found..!!</h4>
          )}
        </div>
      </div>
    </div >
  );
};

export default MyApplication;

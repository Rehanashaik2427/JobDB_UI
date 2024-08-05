import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { SiImessage } from "react-icons/si";
import ReactPaginate from 'react-paginate';
import { useLocation } from "react-router-dom";
import HrLeftSide from "./HrLeftSide";
import Slider from "./Slider";

const DreamApplication = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [resumeTypes, setResumeTypes] = useState({});
  const [fileNames, setfileNames] = useState({});

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);



  const fetchResumeTypes = async (applications) => {
    const types = {};
    const fileNames = {};
    for (const application of applications) {
      try {
        const response = await axios.get(`${BASE_API_URL}/getResumeByApplicationId?resumeId=${application.resumeId}`);
        types[application.resumeId] = response.data.fileType;
        fileNames[application.resumeId] = response.data.fileName;
      } catch (error) {
        console.error('Error fetching resume type:', error);
      }
    }
    setResumeTypes(types);
    setfileNames(fileNames);
  };

  const renderResumeComponent = (resumeId) => {
    const fileType = resumeTypes[resumeId];
    const fileName = fileNames[resumeId];
    if (fileType === 'file') {
      return (
        <Button onClick={() => handleDownload(resumeId, fileName)}>Download</Button>

      );
    } else if (fileType === 'link') {
      return (
        <a href={fileName} target="_blank" rel="noopener noreferrer">Click here</a>
      );
    } else if (fileType === 'brief') {
      return (
        <Button onClick={() => openPopup(fileName)}>Open Brief</Button>
      );
    } else {
      return null; // Handle other file types as needed
    }
  };

  const [showMessage, setShowMessage] = useState(false);
  const [showBriefSettings, setShowBriefSettings] = useState(false);
  const openPopup = (fileName) => {
    setShowMessage(fileName);
    setShowBriefSettings(!showBriefSettings);
  };

  const handleFilterChange = async (e) => {
    setFilterStatus(e.target.value);
    handleSelect(e.target.value);

  };

  const handleSelect = async (filterStatus, fromDate, toDate) => {
    try {
      const jobId = 0;
      const params = {
        jobId: jobId,
        filterStatus: filterStatus,
        userEmail: userEmail,
        page: page,
        size: pageSize
      };
      console.log(filterStatus)
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }

      const endpoint = fromDate && toDate
        ? `${BASE_API_URL}/getFilterDreamApplicationsWithDateByCompany`
        : `${BASE_API_URL}/getFilterDreamApplicationsByCompany`;

      const response = await axios.get(endpoint, { params });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchApplications = async () => {
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,

      };

      const response = await axios.get(`${BASE_API_URL}/getDreamApplicationsByCompany`, { params }); console.log(response.data);
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [userEmail, page, pageSize]);

  const updateStatus = async (applicationId, newStatus) => {
    console.log(applicationId);
    console.log(newStatus);
    try {
      const response = await axios.put(`${BASE_API_URL}/updateApplicationStatus?applicationId=${applicationId}&newStatus=${newStatus}`);
      console.log(response.data);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFromDateChange = (date) => {
    setFromDate(date);
    handleSelect(filterStatus, date, toDate);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    handleSelect(filterStatus, fromDate, date);
  };

  const [candidateName, setCandidateName] = useState();
  const [candidateEmail, setCandidateEmail] = useState();

  const fetchCandidateDetails = async () => {
    const candidateNames = {};
    const candidateEmails = {};
    for (const application of applications) {
      const res = await axios.get(`${BASE_API_URL}/getUserName`, {
        params: {
          userId: application.candidateId
        }

      });
      candidateNames[application.candidateId] = res.data.userName;
      candidateEmails[application.candidateId] = res.data.userEmail;

    }
    setCandidateName(candidateNames);
    setCandidateEmail(candidateEmails);
  }
  useEffect(() => {
    fetchCandidateDetails();
    fetchResumeTypes(applications);
  }, [applications]);
  const [unreadMessages, setUnreadMessages] = useState([]); // State to track unread messages

  useEffect(() => {
    const fetchStatuses = async () => {
     
      const unread = {}; // Initialize unread messages state

      for (const application of applications) {
        try {
         
          const countUnread = await fetchCountUnreadMessage(application.applicationId);
        
          unread[application.applicationId] = countUnread;

        } catch (error) {
          console.error('Error fetching job status:', error);
        
        }
      }
      setUnreadMessages(unread); // Set unread messages state
    };
    fetchStatuses();
  }, [applications]);

  const fetchCountUnreadMessage = async (applicationId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/fetchCountUnreadMessageForHRByApplicationId?applicationId=${applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }


  const handleDownload = async (resumeId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/jobbox/downloadResume?resumeId=${resumeId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const user = {
    userName: userName,
    userEmail: userEmail,
  };
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };
  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [applicationId, setApplicationId] = useState(0);
  const [chats, setChats] = useState([]);

  const handleChatClick = async (applicationId) => {
   setApplicationId(applicationId);
    setUnreadMessages(0);
    // const responce= await axios.get(`${BASE_API_URL}/fetchChatByApplicationId?applicationId=${applicationId}`);
    // setChats(responce.data);
    console.log('Chat icon clicked for:');
    // Show the modal
    setShowModal(true);
    setShowChat(true);
    try {
      await axios.put(`${BASE_API_URL}/markCandidateMessagesAsRead?applicationId=${applicationId}`);
      const response = await axios.get(`${BASE_API_URL}/fetchChatByApplicationId?applicationId=${applicationId}`);
      setChats(response.data);
      console.log("Chats === > " + chats)
      console.log("Chats === > " + response.data)
      setShowModal(true); // Show the modal once chats are fetched
      setShowChat(true); // Optionally manage showChat state separately
     
    


    } catch (error) {
      console.error("Error fetching chats:", error);
    }
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
    // Handle send logic here
    try{
      await axios.put(`${BASE_API_URL}/markCandidateMessagesAsRead?applicationId=${applicationId}`);
      const response = await axios.put(`${BASE_API_URL}/saveHRChatByApplicationId?applicationId=${applicationId}&hrchat=${inputValue}`);
      console.log('Sending message:', inputValue);
      // Close the modal or perform any other actions
     
      setShowModal(true);
      setInputValue('');
      handleChatClick(applicationId)
     // Reset input value after sending
    }catch{
      console.log('error')
    }
   
  };
  // Function to format date with only day
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { weekday: 'long' }; // Show only the full day name
    return date.toLocaleDateString('en-US', options);
  }

  // Function to format time with AM/PM
  function formatMessageDateTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  // Function to check if two dates are different days
  function isDifferentDay(date1, date2) {
    const day1 = new Date(date1).getDate();
    const day2 = new Date(date2).getDate();
    return day1 !== day2;
  }

  const modalBodyRef = useRef(null);
  useEffect(() => {
    // Scroll to bottom of modal body when chats change (new message added)
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight;
    }
  }, [chats]);


  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  return (
    <div className='dashboard-container'>
    <div className='left-side'>
        <HrLeftSide user={{ userName, userEmail }} />
      </div>

      <div className="right-side" >
          <div className="application-div">
            <Row className="filter">
              <Col className="filter" style={{ maxWidth: '40%' }}>
                <label htmlFor="status">Filter by Status:</label>
                <select id="status" onChange={handleFilterChange} value={filterStatus}>
                  <option value="all">All</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Not Seen">Not Seen</option>
                  <option value="Not Shortlisted">Not Shortlisted</option>
                </select>
              </Col>
              <Col className="filter">
                <label htmlFor="date" className="mr-2">Filter by Date:</label>
                From:<input type="date" id="fromDate" value={fromDate} onChange={(e) => handleFromDateChange(e.target.value)} className="mr-2" />
                To:<input type="date" id="toDate" value={toDate} onChange={(e) => handleToDateChange(e.target.value)} />
              </Col>
            </Row>
            {showBriefSettings && (
              <Modal show={showBriefSettings} onHide={() => setShowBriefSettings(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Brief Resume</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ overflowY: 'auto' }}>{showMessage}</Modal.Body>
            </Modal>
            )}

<Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body ref={modalBodyRef}>
              <div className="chat-messages">
                {chats ? (
                  chats.map((chat, index) => (
                    <div key={chat.id} className="chat-message">
                      {index === 0 || isDifferentDay(chats[index - 1].createdAt, chat.createdAt) && (
                        <div className="d-flex justify-content-center align-items-center text-center font-weight-bold my-3">
                          {formatDate(chat.createdAt)}
                        </div>

                      )}
                      {chat.candidateMessage && (
                        <div className="message-right">
                          {chat.candidateMessage}
                          <div className="message-time">
                            {formatMessageDateTime(chat.createdAt)}
                          </div>
                        </div>
                      )}

                      {/* Render HR message if present */}
                      {chat.hrMessage && (
                        <div className="message-left">
                          {chat.hrMessage}
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
              {/* Message input section */}

            </Modal.Body>
            <Modal.Footer>
              <Form.Group controlId="messageInput" className="mb-3">
                {/* <Form.Label>Message:</Form.Label> */}
                <Form.Control
                  as='textarea'
                  type="text"
                  placeholder="Enter your message"
                  value={inputValue}
                  onChange={handleInputChange}
                  style={{ width: '350px' }} // Custom styles to increase size
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSend}>
                <FontAwesomeIcon icon={faPaperPlane} /> {/* Send icon from Font Awesome */}
              </Button>
            </Modal.Footer>
          </Modal>
            {applications.length > 0 && (
              <div>
                <div>
                  <Table hover className='text-center'>
                    <thead className="table-light">
                      <tr style={{ textAlign: 'center' }}>
                        <th>Candidate Name</th>
                        <th>Candidate Email</th>
                        <th>Resume ID</th>
                        <th scope="col" onClick={() => handleSort('appliedOn')}> Date {sortedColumn === 'appliedOn' && sortOrder === 'asc' && '▲'}
                          {sortedColumn === 'appliedOn' && sortOrder === 'desc' && '▼'}</th>
                        <th>Action</th>
                        <th scope="col">Chat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(application => (
                        <tr key={application.id}>
                          <td>{candidateName[application.candidateId]}</td>
                          <td>{candidateEmail[application.candidateId]}</td>
                          <td>{renderResumeComponent(application.resumeId)}</td>
                          <td>{application.appliedOn}</td>
                          <td>
                            <Slider
                              initialStatus={application.applicationStatus}
                              onChangeStatus={(newStatus) => updateStatus(application.applicationId, newStatus)}
                            />
                          </td>
                          <td >
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
                              handleChatClick(application.applicationId);
                              setShowModal(true);
                            }}
                            style={{ color: 'green', cursor: 'pointer' }}
                          />
                        </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

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
            )}
            {applications.length === 0 && (
              <section class=''>
                <h2>Sorry, you haven't received any applications yet.</h2>
              </section>
            )}
          </div>
</div></div>
  );
};
export default DreamApplication;
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { SiImessage } from "react-icons/si";
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from "react-router-dom";
import HrLeftSide from "./HrLeftSide";
import Slider from "./Slider";



const ViewApplications = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const userName = location.state?.userName;
  const jobId = location.state?.jobId;
  // console.log(jobId);
  const [applications, setApplications] = useState([]);
  const [resumeTypes, setResumeTypes] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [fileNames, setfileNames] = useState({});

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const [loading, setLoading] = useState(true);


  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };



  const handleFilterChange = async (e) => {
    setFilterStatus(e.target.value);
    handleSelect(e.target.value);
  };

  const handleSelect = async (filterStatus, fromDate, toDate) => {
    setLoading(true);
    try {
      const params = {
        jobId: jobId,
        filterStatus: filterStatus,
        page: page,
        size: pageSize
      }
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }
      const endpoint = fromDate && toDate
        ? `${BASE_API_URL}/getFilterApplicationsWithDateByJobIdWithpagination`
        : `${BASE_API_URL}/getFilterApplicationsByJobIdWithpagination`;

      const response = await axios.get(endpoint, { params });
      console.log(response.data);


      setApplications(response.data.content || []);
      fetchResumeTypes(response.data.content || []);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        jobId: jobId,

        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder
      };



      const response = await axios.get(`${BASE_API_URL}/getApplicationsByJobIdWithPagination`, { params });
      setApplications(response.data.content || []);
      fetchResumeTypes(response.data.content || []);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
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

  useEffect(() => {
    fetchApplications();
  }, [jobId, page, pageSize, sortedColumn, sortOrder]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);

  };


  const updateStatus = async (applicationId, newStatus) => {
    console.log(applicationId);
    console.log(newStatus);
    try {
      await axios.put(`${BASE_API_URL}/updateApplicationStatus?applicationId=${applicationId}&newStatus=${newStatus}`);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };


  const fetchResumeTypes = async (applications) => {
    const types = {};
    const fileNames = {};
    for (const application of applications) {
      try {
        const response = await axios.get(`${BASE_API_URL}/getResumeByApplicationId?resumeId=${application.resumeId}`);
        types[application.resumeId] = response.data.fileType;
        fileNames[application.resumeId] = response.data.fileName;
        ///console.log(`Resume ID: ${application.resumeId}, File Type: ${response.data.fileType}, File Name: ${response.data.fileName}`);
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
        <Button className="btn-sm" variant="primary" onClick={() => handleDownload(resumeId, fileName)}>Download</Button>
      );
    } else if (fileType === 'link') {
      return (
        <a href={fileName} target="_blank" rel="noopener noreferrer">Click here</a>
      );
    } else if (fileType === 'brief') {
      return (
        <Button className="btn-sm" variant="primary" onClick={() => openPopup(fileName)}>Open Brief</Button>
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

  const [candidateName, setCandidateName] = useState({});
  const [candidateEmail, setCandidateEmail] = useState({});

  const fetchCandidateDetails = async () => {
    const candidateNames = {};
    const candidateEmails = {};
    for (const application of applications) {
      try {
        const res = await axios.get(`${BASE_API_URL}/getUserName`, {
          params: { userId: application.candidateId }
        });
        candidateNames[application.candidateId] = res.data.userName;
        candidateEmails[application.candidateId] = res.data.userEmail;
      } catch (error) {
        console.error('Error fetching candidate details:', error);
      }
    }
    setCandidateName(candidateNames);
    setCandidateEmail(candidateEmails);
  }




  useEffect(() => {
    fetchCandidateDetails();
  }, [applications]);



  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const navigate = useNavigate();

 const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [applicationId, setApplicationId] = useState(0);
  const[chats,setChats]=useState([]);
  const[showChat,setShowChat]=useState(false);
  const handleChatClick =async (applicationId) => {
    // Handle click logic here
    setApplicationId(applicationId);
    const responce= await axios.get(`${BASE_API_URL}/fetchChatByApplicationId?applicationId=${applicationId}`);
    setChats(responce.data);
    console.log('Chat icon clicked for:');
    // Show the modal
    setShowModal(true);
    setShowChat(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInputValue(''); // Reset input value when closing modal
  };

  const handleSend = async() => {
    // Handle send logic here
    const responce= await axios.put(`${BASE_API_URL}/saveChatByApplicationId?applicationId=${applicationId}&hrchat=${inputValue}`);
    console.log('Sending message:', inputValue);
    // Close the modal or perform any other actions
    setShowModal(true);
    setInputValue('');
    handleChatClick(applicationId) // Reset input value after sending
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={2} className="left-side">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>

        <Col md={10} className="rightside">

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
                <Modal.Body>{showMessage}</Modal.Body>
              </Modal>
            )}

             <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chat Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {showChat && (
      chats.map((chat) => (
        <div key={chat.id}> {/* Assuming each chat has a unique id */}
          {chat.hrMessage}
        </div>
      ))
    )}
          <Form.Group controlId="messageInput">
            <Form.Label>Message:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your message"
              value={inputValue}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSend}>
            Send
          </Button>
        </Modal.Body>
      </Modal>
            <div>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner-bubble spinner-bubble-primary m-5" />
                  <span>Loading...</span>
                </div>
              ) : applications.length === 0 ? (
                <section>
                  <h2>Sorry, you haven't received any applications yet.</h2>
                </section>
              ) : (
                <div>
                  <Table hover className='text-center'>
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Job Title</th>
                        <th scope="col">Candidate Name</th>
                        <th scope="col">Candidate Email</th>
                        <th scope="col">Resume ID</th>
                        <th scope="col" onClick={() => handleSort('appliedOn')}>
                          Date {sortedColumn === 'appliedOn' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('applicationStatus')}>
                          Application Status {sortedColumn === 'applicationStatus' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col">View Details</th>
                        <th scope="col">Action</th>
                        <th scope="col">Chat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application) => (
                        <tr key={application.applicationId}>
                          <td>{application.jobRole}</td>
                          <td>{candidateName[application.candidateId]}</td>
                          <td>{candidateEmail[application.candidateId]}</td>
                          <td>{renderResumeComponent(application.resumeId)}</td>
                          <td>{application.appliedOn}</td>
                          <td>{application.applicationStatus}</td>
                          <td>
                            <Link
                              to={{
                                pathname: '/hr-dashboard/hr-applications/view-applications/applicationDetails',
                                state: { userEmail, applicationId: application.applicationId, userName },
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate('/hr-dashboard/hr-applications/view-applications/applicationDetails', {
                                  state: { userEmail, applicationId: application.applicationId, userName },
                                });
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                style={{ cursor: 'pointer', fontSize: '20px', color: 'black' }}
                              />
                            </Link>
                          </td>
                          <td style={{ alignItems: 'center' }}>
                            <Slider
                              initialStatus={application.applicationStatus}
                              onChangeStatus={(newStatus) => updateStatus(application.applicationId, newStatus)}
                            />
                          </td>
                          <td onClick={() => handleChatClick(application.applicationId, application.jobId,application.candidateId)}>
                            <SiImessage size={25} />
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </Table>


                </div>
              )}
              {/* Pagination */}
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
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );


  
};

export default ViewApplications;

import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import ReactPaginate from 'react-paginate';
import { useLocation } from "react-router-dom";
import HrLeftSide from "./HrLeftSide";

const DreamApplication = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [resumeTypes, setResumeTypes] = useState({});
  const [fileNames, setfileNames] = useState({});



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

  const handleSelect = async (filterStatus) => {
    try {
      const jobId = 0;
      const response = await axios.get(`${BASE_API_URL}/getFilterDreamApplicationsByCompany?jobId=${jobId}&filterStatus=${filterStatus}&userEmail=${userEmail}`);
      console.log(response.data);
      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getDreamApplicationsByCompany?userEmail=${userEmail}&page=${page}&size=${pageSize}`);
      console.log(response.data);
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

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

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={2} className="left-side">
          <HrLeftSide user={user} />
        </Col>
        <Col md={20} className="rightside">
          <div className="application-div">
            <div className="filter">
              <label htmlFor="status">Filter by Status:</label>
              <select id="status" onChange={handleFilterChange} value={filterStatus}>
                <option value="all">All</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Under Preview">Under Preview</option>
                <option value="Not Shortlisted">Rejected</option>
              </select>
            </div>
            {showBriefSettings && (
              <div className="modal-summary">
                <div className="modal-content-summary">
                  <span className="close" onClick={() => setShowBriefSettings(false)}>&times;</span>
                  {showMessage}
                </div>
              </div>
            )}
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
                        <th>Application Status</th>
                        <th>Application Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(application => (
                        <tr key={application.id}>
                          <td>{candidateName[application.candidateId]}</td>
                          <td>{candidateEmail[application.candidateId]}</td>
                          <td>{renderResumeComponent(application.resumeId)}</td>
                          <td>{application.appliedOn}</td>
                          <td>{application.applicationStatus}</td>

                          <td>
                            <span className="icon-button select" onClick={() => updateStatus(application.applicationId, 'Shortlisted')}>
                              <BsCheckCircle />

                            </span>
                            <span className="icon-button reject" onClick={() => updateStatus(application.applicationId, 'Not Shortlisted')}>
                              <BsXCircle />
                            </span>                          
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="pagination-container">
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
              <section class='not-yet'>
                <h2>Sorry, you haven't received any applications yet.</h2>
              </section>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default DreamApplication;
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from "react-router-dom";
import HrLeftSide from "./HrLeftSide";

const ViewApplications = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const userName = location.state?.userName;
  const jobId = location.state?.jobId;
  console.log(jobId);
  const [applications, setApplications] = useState([]);
  const [resumeTypes, setResumeTypes] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [fileNames, setfileNames] = useState({});



  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const [loading, setLoading] = useState(true); 

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




  const handleFilterChange = async (e) => {
    setFilterStatus(e.target.value);
    handleSelect(e.target.value);
  };

  const handleSelect = async (filterStatus) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/getFilterApplicationsByJobIdWithpagination?jobId=${jobId}&filterStatus=${filterStatus}&page=${page}&size=${pageSize}`);
      console.log(response.data);
      setApplications(response.data.content);

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
        sortBy: sortedColumn, // Include sortedColumn and sortOrder in params
        sortOrder: sortOrder,
      };

      const response = await axios.get(`${BASE_API_URL}/getApplicationsByJobIdWithPagination`, { params });
      setApplications(response.data.content || []);
      fetchResumeTypes(response.data.content || []);
      setTotalPages(response.data.totalPages);
        setLoading(false);
    } catch (error) {
      console.log('Error fetching applications:', error);
    }
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

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={2} className="left-side">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>

        <Col md={18} className="rightside">

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
                <th scope="col">Application Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.applicationId}>
                  <td>{application.jobRole}</td>
                  <td>{application.candidateName}</td>
                  <td>{application.candidateEmail}</td>
                  <td>{application.resumeId}</td>
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
                        style={{ cursor: 'pointer', fontSize: '24px', color: 'black' }}
                      />
                    </Link>
                  </td>
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
    </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewApplications;

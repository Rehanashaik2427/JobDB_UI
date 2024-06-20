import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './HrDashboard.css';
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
    try {
      const response = await axios.get(`${BASE_API_URL}/getFilterApplicationsByJobIdWithpagination?jobId=${jobId}&filterStatus=${filterStatus}&page=${page}&size=${pageSize}`);
      console.log(response.data);
      setApplications(response.data.content);

      console.log(response.data);
      setApplications(response.data.content || []);
      fetchResumeTypes(response.data.content || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplications = async () => {
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
        <button onClick={() => handleDownload(resumeId, fileName)}>Download</button>
      );
    } else if (fileType === 'link') {
      return (
        <a href={fileName} target="_blank" rel="noopener noreferrer">Click here</a>
      );
    } else if (fileType === 'brief') {
      return (
        <button onClick={() => openPopup(fileName)}>Open Brief</button>
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



  
  const user = {
    userName: userName,
    userEmail: userEmail,
  };


  return (
    <div className='hr-dashboard-container'>
      <div className='hr-leftside'>
        <HrLeftSide user={user} />
      </div>
      <div className='hr-rightside'>
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
          {applications.length === 0 ? (
            <section class='not-yet'>
              <h2>Sorry, you haven't received any applications yet.</h2>
            </section>
          ) : (
            <div>
              <div>
                <table id='jobTable1' style={{ marginTop: '12px' }}>
                  <thead>
                    <tr>
                      <th >Job Title</th>
                      <th >Candidate Name</th>
                      <th >Candidate Email</th>                      <th>Resume ID</th>
                      <th onClick={() => handleSort('appliedOn')}>Date{sortedColumn === 'appliedOn' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th onClick={() => handleSort('applicationStatus')}>Application Status{sortedColumn === 'applicationStatus' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th>View Details</th>
                      <th>Application Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(application => (
                      <tr key={application.id}>
                        <td>{application.jobRole}</td>
                        <td>{candidateName[application.candidateId]}</td>
                        <td>{candidateEmail[application.candidateId]}</td>
                        <td>{renderResumeComponent(application.resumeId)}</td>
                        <td>{application.appliedOn}</td>
                        <td>{application.applicationStatus}</td>
                        <td>
                          <Link
                            to={{
                              pathname: '/applicationDetails',
                              state: { userEmail: userEmail, applicationId: application.applicationId }
                            }}
                          >
                            <button>View</button>
                          </Link>
                        </td>
                        <td>
                          <button onClick={() => updateStatus(application.applicationId, 'Shortlisted')} className="select">Select</button>
                          <button onClick={() => updateStatus(application.applicationId, 'Not Shortlisted')} className="reject">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          )}

        </div>
      </div>
    </div>
  );
};

export default ViewApplications;

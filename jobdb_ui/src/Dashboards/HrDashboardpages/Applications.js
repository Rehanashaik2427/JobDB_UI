import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import './HrDashboard.css';
import HrLeftSide from './HrLeftSide';

const Applications = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";

  const history = useHistory();

  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;

  const [showSettings, setShowSettings] = useState(false);

  const [jobs, setJobs] = useState('')
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)

  const toggleSettings = () => {
    setShowSettings(!showSettings);
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

  useEffect(() => {
    if (search) {
      fetchJobBysearch();
    }
    else
      fetchJobs()
  }, [userEmail, userEmail, page, pageSize, sortOrder, sortedColumn]);



  const fetchJobs = async () => {
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
        sortBy: sortedColumn, // Include sortedColumn and sortOrder in params
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/jobsPostedByHrEmail`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching HR data:', error);
    }
  }






  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }
  const fetchJobBysearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchJobsByHR`, {
        params: { search, userEmail, page, pageSize }
      });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      console.log(response.data);
    } catch (error) {
      console.log("Error searching:", error);
      alert("Error searching for jobs. Please try again later.");
    }

  }
  useEffect(() => {
    if (search) {
      fetchJobBysearch();
    }
    else
      fetchJobs()
  }, [userEmail, userEmail, page, pageSize]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    fetchJobBysearch();
  };

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

  return (
    <div className='hr-dashboard-container'>
      <div className='hr-leftside'>
        <HrLeftSide user={user} />
      </div>
      <div className='hr-rightside'>
        <div className="applications">
          <div className="candidate-search">
            <form className="candidate-search1" onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='Search by job title'
                value={search}
                onChange={handleSearchChange}
              />
              <button>
                <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
              </button>
            </form>
            <div>
              <FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} onClick={toggleSettings} />
            </div>
          </div>

          {showSettings && (
            <div id="modal-container">
              <div id="settings-modal">
                <ul>
                  <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/"> Sign out</Link></li>
                  <li>Settings</li>
                </ul>
                <button onClick={toggleSettings}>Close</button>
              </div>
            </div>
          )}

          <div className='job-list'>
            {jobs.length > 0 && (
              <table id='jobTable1'>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('jobTitle')}>
                      Job Title {sortedColumn === 'jobTitle' && sortOrder === 'asc' && '▲'}
                      {sortedColumn === 'jobTitle' && sortOrder === 'desc' && '▼'}
                    </th>
                    <th onClick={() => handleSort('applicationDeadline')}>Application DeadLine{sortedColumn === 'applicationDeadline' && (sortOrder === ' ' ? '▲' : '▼')}</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    (
                      <tr key={job.jobId}>
                        <td>{job.jobTitle}</td>
                        <td>{job.applicationDeadline}</td>
                        <td>
                          <Link
                            to={{
                              pathname: '/viewApplications',
                              state: { userName: userName, userEmail: userEmail, jobId: job.jobId }
                            }}
                          >
                            <button>View Application</button>
                          </Link>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>



            )}


          </div>

          {jobs.length === 0 && (
            <section className='not-yet'>
              <h2>You have not posted any jobs yet. Post Now</h2>
            </section>
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

  );
}

export default Applications;

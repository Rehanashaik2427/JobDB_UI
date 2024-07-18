import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, OverlayTrigger, Popover, Table } from 'react-bootstrap'
import ReactPaginate from 'react-paginate';
import { useLocation } from 'react-router-dom';


const CompanyJobs = ({ companyId }) => {
    const BASE_API_URL = "http://localhost:8082/api/jobbox";

const [jobs, setJobs] = useState([]);
const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(5);
const [totalPages, setTotalPages] = useState(0);
const location = useLocation();
const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };
  const fetchJobs = async () => {
    try {
      const params = {
      companyId:companyId,
        page: page,
        size: pageSize,
        sortBy: sortedColumn, // Include sortedColumn and sortOrder in params
        sortOrder: sortOrder,
      };

      const response = await axios.get(`${BASE_API_URL}/jobsPostedCompany`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching jobs data:', error);
    }
  };
  useEffect(() => {
      fetchJobs();
    
  }, [ page, pageSize, sortedColumn, sortOrder]);

  const [showJobDescription, setShowJobDescription] = useState(false);
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };
  const closeJobDescription = () => {
    setShowJobDescription(false);
    setSelectedJobSummary('');
  };
const popover = (summary) => (
    <Popover id="popover-basic" style={{ left: '50%', transform: 'translateX(-50%)' }}>
      <Popover.Body>
        {summary}
        <span className="float-end" onClick={closeJobDescription} style={{ cursor: 'pointer' }}>

        </span>
      </Popover.Body>
    </Popover>
  );
  return (
    <div  className="company-job"style={{ maxHeight: '400px', overflowY: 'scroll' }}>
            <div className="jobs_list">
                {jobs.length > 0 && (
                    <div>
                        <div>
                            <Table hover className='text-center'>
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" onClick={() => handleSort('jobTitle')}>Job Title{sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('jobType')}>Job Type{sortedColumn === 'jobType' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('skills')}>Skills{sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('numberOfPosition')}>Vacancy{sortedColumn === 'numberOfPosition' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col">Job Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map(job => (
                                        <tr key={job.id}>

                                            <td><a onClick={() => handleViewSummary(job.jobsummary)}>{job.jobTitle}</a></td>
                                            <td>{job.jobType}</td>
                                            <td>{job.skills}</td>
                                            <td>{job.numberOfPosition}</td>
                                            <td>
                                                <OverlayTrigger trigger="click" placement="left" overlay={popover(job.jobsummary)} style={{ fontSize: '20px' }}>
                                                    <Button variant="secondary" className='description btn-rounded' >Description</Button>
                                                </OverlayTrigger>
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
                )}
            </div>
        </div>
  )
}

export default CompanyJobs

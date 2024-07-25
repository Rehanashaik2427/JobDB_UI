

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Carousel, Container, Nav, Navbar, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import HomeFooter from './HomeFooter';
import './PagesStyle/Pages.css';


const Home = () => {



  const BASE_API_URL = "http://localhost:8082/api/jobbox";

  const carouselImageList = [
    "/jb_logo.png",
    "/jb_logo.png",
    "/jb_logo.png",
    "/jb_logo.png"
  ];
  const [carouselImages, setCarouselImages] = useState([]);
  const [groupedImages, setGroupedImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/companylogos`);
        const images = response.data.map(imageData => `data:image/jpeg;base64,${imageData}`);
        setCarouselImages(images);
        setGroupedImages(groupeImages(images, 4)); // Grouping images into chunks of 4
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const groupeImages = (images, groupSize) => {
    const result = [];
    for (let i = 0; i < images.length; i += groupSize) {
      result.push(images.slice(i, i + groupSize));
    }
    return result;
  };

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const [showModalSummary, setShowModalSummary] = useState(false);

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
  };
  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchJobBySearch();
    }
  };
  useEffect(() => {
    fetchData();

  }, [page, pageSize, search, sortedColumn, sortOrder]);
  async function fetchData() {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      let response;
      if (search) {
        response = await axios.get(`${BASE_API_URL}/searchJobs`, { params: { ...params, search } });
      } else {
        response = await axios.get(`${BASE_API_URL}/latestJobs`, { params });
      } setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchJobBySearch = async () => {
    try {
      const params = {
        search: search,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/searchJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.log("No data Found" + error);
    }
    console.log("Search submitted:", search);
  };

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };
  const popover = (summary) => (
    <Popover id="popover-basic" style={{ left: '50%', transform: 'translateX(-50%)' }}>
      <Popover.Body>
        {summary}
        <span className="float-end" onClick={handleCloseModalSummary} style={{ cursor: 'pointer' }}>
          <i className="fas fa-times"></i> {/* Close icon */}
        </span>
      </Popover.Body>
    </Popover>
  );
  const handleCloseModalSummary = () => {
    setSelectedJobSummary(null);
    setShowModalSummary(false);
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };


  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary" style={{ width: '100%' }}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/jb_logo.png"
              alt="JobBox Logo"
              className="logo"
              style={{
                backgroundColor: 'transparent'
              }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" >
              <Nav.Link as={Link} to="/" style={{ marginRight: '40px', marginLeft: '150px' }}>Home</Nav.Link>
              <Nav.Link as={Link} to='/about-jobbox' style={{ marginRight: '40px' }}>About Jobbox</Nav.Link>
              <Nav.Link as={Link} to="/aboutus" style={{ marginRight: '40px' }}>About Us</Nav.Link>
              <Nav.Link as={Link} to="/admin-register" style={{ marginRight: '40px' }}>Admin</Nav.Link>
              <Nav.Link as={Link} to="/jobdbcompanies" style={{ marginRight: '40px' }}>Companies</Nav.Link>
              {/* <Nav.Link as={Link} to="/candidates">Candidates</Nav.Link> */}
              {/* <Nav.Link as={Link} to="/contact">Contact</Nav.Link> */}
              <Nav.Link as={Link} to="/signup/userSignup" className="nav-link-custom"><Button>Register</Button></Nav.Link>
              <Nav.Link as={Link} to="/signin" className="nav-link-custom"><Button variant="success">Login</Button></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="carousel-container ">
        <Card body className="text-center" style={{ width: '100%' }}>
          <Carousel >
            {carouselImageList.map((img, ind) => (
              <Carousel.Item key={ind} >

                <img
                  className="d-block w-25 carousel-image"
                  src={img}
                  alt={`Slide ${ind}`}

                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Card>
      </div>

      <div className='jobs'>
        <div className='search'>
          <div className='search-bar'>
            <input
              type="text"
              placeholder="Company, JobRole, Location etc...."
              value={search}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={fetchJobBySearch}>Search</Button>
          </div>
          <div className="text-center">
            <p><b>Popular Searches:</b> Designer, Web Developer, IOS, Developer, PHP, Senior Developer, Engineer</p>
          </div>
        </div>
        {jobs.length > 0 && (
          <div>

            <div className='text-center'>
              <h2>Latest Jobs & Companies</h2>
            </div>
            <Table hover className='text-center' >
              <thead className="table-light">
                <tr>
                  <th scope='col' onClick={() => handleSort('jobTitle')}>
                    Job Profile {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th scope='col' onClick={() => handleSort('companyName')}>
                    Company Name{sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th scope='col' onClick={() => handleSort('applicationDeadline')}>
                    Application Deadline {sortedColumn === 'applicationDeadline' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th scope='col' onClick={() => handleSort('skills')}>
                    Skills {sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th scope='col'>Job Summary</th>

                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} id='job-table-list'>
                    <td>{job.jobTitle}</td>
                    <td>{job.companyName}</td>
                    <td>{job.applicationDeadline}</td>
                    <td>{job.skills}</td>
                    <td>
                      <OverlayTrigger trigger="click" placement="left" overlay={popover(job.jobsummary)} style={{ fontSize: '20px' }}>
                        <Button variant="secondary" className='description btn-rounded' >View Summary</Button>
                      </OverlayTrigger>
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
          </div>
        )}

        {jobs.length === 0 && <h1>No jobs found.</h1>}
      </div>

      <Card body className="text-center" style={{ width: '100%' }}>
        <Carousel indicators={false}>
          {groupedImages.map((group, index) => (
            <Carousel.Item key={index}>
              <div className="d-flex justify-content-center" style={{ backgroundColor: "gainsboro", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                {group.map((img, imgIndex) => (
                  <div className="p-2" key={imgIndex} >
                    <img
                      className="d-block carousel-image"
                      src={img}
                      alt={`Slide ${index}-${imgIndex}`}
                      style={{ width: '200px', height: '150px', objectFit: 'cover', margin: '20px' }} // Set fixed width, height and object-fit
                    />
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Card>



      <div>
        <HomeFooter />
      </div>

    </div >
  );
}

export default Home;

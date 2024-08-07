import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Carousel, Container, Nav, Navbar, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
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
  const [imageKeys, setImageKeys] = useState({}); // To store the mapping of image URLs to keys
  const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/companylogos`);

        // Process the Map into an array of objects with id and image
        const imagesMap = response.data;
        const imagesArray = Object.entries(imagesMap).map(([id, imageData]) => ({
          id: parseInt(id, 10),
          src: `data:image/jpeg;base64,${imageData}`
        }));

        const imageSrcKeys = imagesArray.reduce((acc, { id, src }) => {
          acc[src] = id;
          return acc;
        }, {});

        setImageKeys(imageSrcKeys);
        setGroupedImages(groupeImages(imagesArray, 4));
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

  const handleImageClick = (imageSrc) => {
    const key = imageKeys[imageSrc];
    if (key) {
      //navigate(`/some-page/${key}`);
      navigate(`/jobboxCompanyPage/eachCompanyPage`, { state: { companyId: key } });

    }
  };
  console.log(imageKeys)
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
    localStorage.setItem('currentCompanyPage', 0);
    localStorage.setItem('currentCompanyPageSize', 6);
    if (search) {
      fetchJobBySearch();
    } else {
      fetchData();
    }
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
        setJobs(response.data.content);
      } else {
        response = await axios.get(`${BASE_API_URL}/latestJobs`, { params });
      }
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

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

  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };


  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
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
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" style={{ marginRight: '40px', marginLeft: '150px' }}>Home</Nav.Link>
              <Nav.Link as={Link} to='/about-jobbox' style={{ marginRight: '40px' }}>About Jobbox</Nav.Link>
              <Nav.Link as={Link} to="/aboutus" style={{ marginRight: '40px' }}>About Us</Nav.Link>
              <Nav.Link as={Link} to="/admin-register" style={{ marginRight: '40px' }}>Admin</Nav.Link>
              <Nav.Link as={Link} to="/jobdbcompanies" style={{ marginRight: '40px' }}>Companies</Nav.Link>
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
          <div className='home-search-bar'>
            <input
              type="text"
              placeholder="Search by keywords jobrole,companyname,skills"
              value={search}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
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
            <Table hover className='text-center'>
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
                    <td><Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job.jobsummary)}>Summary</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {selectedJobSummary && (
              <div className="modal-summary">
                <div className="modal-content-summary">
                  <span className="close" onClick={handleCloseModal}>&times;</span>
                  <div className="job-summary">
                    <h3>Job Summary</h3>
                    <pre>{selectedJobSummary}</pre>
                  </div>
                </div>
              </div>
            )}

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
        {jobs.length === 0 && <h1>No jobs found.</h1>}
      </div>

      <Card body className="text-center" style={{ width: '100%' }}>
        <Carousel>
          {groupedImages.length > 0 ? (
            groupedImages.map((group, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-center" style={{ backgroundColor: "gainsboro", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                  {group.map((img, imgIndex) => (
                    <div className="p-2" key={imgIndex} onClick={() => handleImageClick(img.src)}>
                      <img
                        className="d-block carousel-image"
                        src={img.src}
                        alt={`Slide ${index}-${imgIndex}`}
                        style={{ width: '200px', height: '150px', objectFit: 'cover', margin: '20px' }}
                      />
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item>
              <div className="d-flex justify-content-center">
                <p>No images available</p>
              </div>
            </Carousel.Item>
          )}
        </Carousel>
      </Card>

      <div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default Home;

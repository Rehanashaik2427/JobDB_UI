import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import HrLeftSide from './HrLeftSide';
import { Button, Dropdown } from 'react-bootstrap';

const People = () => {
    const BASE_API_URL = "http://localhost:8082/api/jobbox";
    const location = useLocation();
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [people, setPeople] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const userName = location.state?.userName;
    const userEmail = location.state?.userEmail;

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState('');

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


    useEffect(() => {
        if(searchQuery){
            handleSearch();
        }
        else
        fetchHRData();
    }, [userEmail, page, pageSize, sortedColumn, sortOrder]); // Empty dependency array ensures the effect runs only once when the component mounts


    const fetchHRData = async () => {
        try {
            const params = {
                userEmail,
                page,
                size: pageSize,
                sortBy: sortedColumn,
                sortOrder,
                search
            };
            const response = await axios.get(`${BASE_API_URL}/getHrEachCompany`, { params });
            setPeople(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching HR data:', error);
        }
    };

    const fetchSearchResults = async () => {
        try {
            const params = {
                search,
                page,
                size: pageSize,
            };
            const response = await axios.get(`${BASE_API_URL}/searchHr`, { params });
            setPeople(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
   
    const handleSearch = () => {
        const filtered = people.filter(person =>
            person.userName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPeople(filtered);
    };
    const handleSort = (column) => {
        let order = 'asc';
        if (sortedColumn === column) {
            order = sortOrder === 'asc' ? 'desc' : 'asc';
        }
        setSortedColumn(column);
        setSortOrder(order);
    };
    const navigate = useNavigate();
    const toggleSettings = () => {
      navigate('/');
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
            <div className="top-right-content">
            <div className="d-flex justify-content-end">
         
            <div className="candidate-search">
              <form className="candidate-search1" >
                <input
                  type='text'
                  name='search'
                  placeholder='Search'
                  value={search}
                  onChange={handleSearchChange}
                />
                <Button variant="light" onClick={() => alert('Search clicked')}>
                  <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
                </Button>
              </form>
              <div className="user col px-3 header-part-right">
                <Dropdown>
                  <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                    <FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} />
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
            </div>
          </div>
                <div>
                    <table id='jobTable1'>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('userId')}>
                                    HR ID {sortedColumn === 'userId' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('userName')}>
                                    HR Name {sortedColumn === 'userName' && (
                                        sortOrder === 'asc' ? '▲' : '▼'
                                    )}
                                </th>
                                <th onClick={() => handleSort('userEmail')}>
                                    Email {sortedColumn === 'userEmail' && (
                                        sortOrder === 'asc' ? '▲' : '▼'
                                    )}
                                </th>
                                <th>Company Name </th>
                                <th>PhoneNumber</th>
                                {/* <th onClick={() => handleSort('phone')}>
                                    Phone Number {sortedColumn === 'phone' && (
                                        sortOrder === ' ' ? '▲' : '▼'
                                    )}
                                </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {people.map(person => (
                                <tr key={person.userId}>
                                    <td>{person.userId}</td>
                                    <td>{person.userName}</td>
                                    <td>{person.userEmail}</td>
                                    <td>{person.companyName}</td>
                                    <td>{person.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </div>
    );
}

export default People;

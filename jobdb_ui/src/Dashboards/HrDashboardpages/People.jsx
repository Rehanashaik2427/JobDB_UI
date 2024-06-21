import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Col, Container, Row, Table } from 'react-bootstrap';
import HrLeftSide from './HrLeftSide';

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
        if (searchQuery) {
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

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const user = {
        userName: userName,
        userEmail: userEmail,
    };

    return (
        <Container fluid className="dashboard-container">
            <Row>
                <Col md={3} className="leftside">
                    <HrLeftSide user={{ userName, userEmail }} />
                </Col>

                <Col md={18} className="rightside">


                    <div>
                        <div className="candidate-search">
                            <input
                                type='text'
                                placeholder='Enter Emp Name'
                                value={search}
                                onChange={handleSearchChange}
                            />
                            <button onClick={handleSearch}>
                                <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
                            </button>
                            <div><FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} onClick={toggleSettings} /></div>
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
                    </div>
                    <div>
                        <Table hover className='text-center'>
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" onClick={() => handleSort('userId')}>
                                        HR ID {sortedColumn === 'userId' && (sortOrder === 'asc' ? '▲' : '▼')}
                                    </th>
                                    <th scope="col" onClick={() => handleSort('userName')}>
                                        HR Name {sortedColumn === 'userName' && (
                                            sortOrder === 'asc' ? '▲' : '▼'
                                        )}
                                    </th>
                                    <th scope="col" onClick={() => handleSort('userEmail')}>
                                        Email {sortedColumn === 'userEmail' && (
                                            sortOrder === 'asc' ? '▲' : '▼'
                                        )}
                                    </th>
                                    <th scope="col">Company Name </th>
                                    <th scope="col">PhoneNumber</th>
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
                        </Table>                </div>
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
                </Col>
            </Row>
        </Container>
    );
}

export default People;

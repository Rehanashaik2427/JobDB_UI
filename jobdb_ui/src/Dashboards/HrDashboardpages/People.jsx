import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Dropdown, Row, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

const People = () => {
    const BASE_API_URL = "http://localhost:8082/api/jobbox";
    const location = useLocation();
    const [filteredPeople, setFilteredPeople] = useState([]);
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
    const navigate = useNavigate();
    const toggleSettings = () => {
        navigate('/');
    };

    const handlePageClick = (data) => {
        setPage(data.selected);
      };

    return (
        <Container fluid className="dashboard-container">
            <Row>
                <Col md={3} className="leftside">
                    <HrLeftSide user={{ userName, userEmail }} />
                </Col>

                <Col md={18} className="rightside">
                    <div className="d-flex justify-content-end align-items-center mb-3 mt-12">

                        <Dropdown className="ml-2">
                            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                                <FontAwesomeIcon icon={faUser} id="user" className="icon" style={{ color: 'black' }} />
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
                    </Table>
                    <div className="pagination-container">
                        <ReactPaginate
                            previousLabel={<i className="i-Previous" />}
                            nextLabel={<i className="i-Next1" />}
                            breakLabel="..."
                            breakClassName="break-me"
                            pageCount={totalPages}
                            marginPagesDisplayed={7}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            activeClassName="active"
                            containerClassName="pagination"
                            subContainerClassName="pages pagination"
                        />
                    </div>
                </Col>
            </Row>
        </Container>

    );
}

export default People;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
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
    const convertToUpperCase = (str) => {
        return String(str).toUpperCase();
    };
    const getInitials = (name) => {
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
        } else {
            return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
        }
    };

    const initials = getInitials(userName);
    const handlePageSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
        setPage(0); // Reset page when page size change
    };
    return (
        <div className="dashboard-container">
            <div className="left-side">
                <HrLeftSide user={{ userName, userEmail }} />
            </div>

            <div className="right-side">
                <div className="d-flex justify-content-end align-items-center mb-3 mt-12">

                    <Dropdown className="ml-2">
                        <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                            <div
                                className="initials-placeholder"
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: 'grey',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                            >
                                {initials}
                            </div>
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
                {people.length > 0 && (
                    <div>
                        <div className='table-details-list'>
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

    );
}

export default People;

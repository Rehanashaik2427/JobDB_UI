import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

const CompanyOverview = () => {
    const BASE_API_URL = "http://localhost:8082/api/jobbox";
    const [locations, setLocations] = useState([]);
    const [userData, setUserData] = useState({});
    const location = useLocation();
    const userName = location.state?.userName || '';
    const userEmail = location.state?.userEmail || '';
    useEffect(() => {
        if (userEmail) {
            getUser(userEmail);
        }
    }, [userEmail]);

    const getUser = async (userEmail) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
            setUserData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchCompanyLocations = async () => {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=YOUR_COMPANY_NAME&key=YOUR_API_KEY`
                );

                // Extract locations data from API response
                if (response.data.results) {
                    const fetchedLocations = response.data.results.map((result) => ({
                        id: result.place_id,
                        name: result.name,
                        lat: result.geometry.location.lat,
                        lng: result.geometry.location.lng,
                    }));
                    setLocations(fetchedLocations);
                }
            } catch (error) {
                console.error('Error fetching company locations:', error);
            }
        };

        fetchCompanyLocations();
    }, []);

    return (
        <div>
            <Card style={{ marginTop: '20px' }}>
                <Card.Body>
                    <h3>About the Company</h3>
                    <p>Description of the company goes here...</p>
                    <h4>Website</h4>
                    <p>
                        <a href="https://www.companywebsite.com" target="_blank" rel="noopener noreferrer">
                            www.companywebsite.com
                        </a>
                    </p>
                    <h4>Industry</h4>
                    <p>Industry details here...</p>
                    <h4>Company Size</h4>
                    <p>100-500 employees</p>
                </Card.Body>
            </Card>
            <Card style={{ marginTop: '20px' }}>
                <Card.Body>
                    <h4>Headquarters</h4>
                    <p>City, State, Country</p>
                    <h4>Founded</h4>
                    <p>Year</p>
                    <h4>Specialties</h4>
                    <p>Specialty 1, Specialty 2, Specialty 3...</p>
                </Card.Body>
            </Card>
            <Card style={{ marginTop: '20px' }}>
                <Card.Body>
                    <h4>All Locations</h4>
                    <div style={{ height: '300px' }}>
                        {/* MapContainer with TileLayer and Markers */}
                        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {/* Render markers for each location */}
                            {locations.map((location) => (
                                <Marker key={location.id} position={[location.lat, location.lng]}>
                                    <Popup>{location.name}</Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CompanyOverview;

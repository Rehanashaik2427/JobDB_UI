import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./ApplicationDetails.css";
import HrLeftSide from "./HrLeftSide";

const ApplicationDetails = () => {
    const BASE_API_URL = "http://localhost:8082/api/jobbox";
    const location = useLocation();
    const { userEmail, userName, applicationId, currentApplicationPage, jobId ,currentApplicationPageSize } = location.state || {};
    const [application, setApplication] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [job, setJob] = useState(null);
    const [navigateBack, setNavigateBack] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        console.log('Current Application Page:', currentApplicationPage, " and ", jobId);

        const fetchApplication = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/getApplication?applicationId=${applicationId}`);
                setApplication(response.data);
            } catch (error) {
                console.log(error);
                setNavigateBack(true);
            }
        };

        fetchApplication();
        
        // Cleanup function to reset state on unmount
        return () => {
            setApplication(null);
            setCandidate(null);
            setJob(null);
        };
    }, [applicationId, BASE_API_URL]);

    useEffect(() => {
        if (navigateBack) {
            navigate(-1);
        }
    }, [navigateBack, navigate]);

    useEffect(() => {
        if (application) {
            const fetchCandidate = async () => {
                try {
                    const response = await axios.get(`${BASE_API_URL}/getUser?userId=${application.candidateId}`);
                    setCandidate(response.data);
                } catch (error) {
                    console.log(error);
                }
            };

            const fetchJob = async () => {
                try {
                    const response = await axios.get(`${BASE_API_URL}/getJob?jobId=${application.jobId}`);
                    setJob(response.data);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchCandidate();
            fetchJob();
        }
    }, [application, BASE_API_URL]);

    const handleBack = () => {
        navigate('/hr-dashboard/hr-applications/view-applications', { state: { userEmail, applicationId, userName, currentApplicationPage, jobId, currentApplicationPageSize } });
    };

    return (
        <div className='dashboard-container'>
            <div className='left-side'>
                <HrLeftSide user={{ userName, userEmail }} />
            </div>
            <div className="right-side">
                <Button variant='primary' onClick={handleBack}>Back</Button>
                <div className="application-details-container">
                    {job && (
                        <div className="jobdetails">
                            <h2>Job Details</h2>
                            <p><b>Job Title:</b> {job.jobTitle}</p>
                            <p><b>Company Name:</b> {job.companyName}</p>
                            <p><b>Requirements:</b> {job.skills}</p>
                            <p><b>Position:</b> {job.numberOfPosition}</p>
                            <p><b>Job Type:</b> {job.jobType}</p>
                            <b>Job Description:</b><pre> {job.jobsummary}</pre>
                        </div>
                    )}
                    {candidate && (
                        <div className="candidatedetails">
                            <h2>Candidate Details</h2>
                            <p><b>Name:</b> {candidate.userName}</p>
                            <p><b>Email:</b> {candidate.userEmail}</p>
                            <p><b>Phone:</b> {candidate.phone}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;

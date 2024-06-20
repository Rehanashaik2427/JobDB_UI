import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import CandidateLeftSide from "./CandidateLeftSide";
import './CandidateDashboard.css';

const CompamyPage= ()=> {

  const BASE_API_URL="http://localhost:8082/api/jobbox";
    const location=useLocation();
    const companyId=location.state?.companyId;
    const userName=location.state?.userName;
    const userId=location.state?.userId;
    const [company,setCompany]=useState();

    const fetchCompany = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}/displayCompanyById?companyId=${companyId}`);
          setCompany(response.data); // Set the fetched jobs to state
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
      };
    
      // useEffect hook to fetch jobs when the component mounts
      useEffect(() => {
        fetchCompany();
      }, []);

      const user = {
        userName: userName,
        
        userId: userId,
       };
    
      return (
        
        <div className='candidate-dashboard-container'>
        <div className='left-side'>
       <CandidateLeftSide user={user} />
     </div>
    <div className="companyPage">
            {company ? (
                <div>
                    <h2>{company.companyName}</h2>
                    <p>{company.discription}</p>
                    <p>{company.jobboxEmail}</p>
                    
                </div>
            ) : (
                <p>Loading company details...</p>
            )}
        </div>
        </div>

    );

}

export default CompamyPage;

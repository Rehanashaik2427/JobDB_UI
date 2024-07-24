import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const CompanyOverView = ({ companyId }) => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    // Fetch data using companyId
    fetchCompanyOverview(companyId);
  }, [companyId]);

  const fetchCompanyOverview = async (companyId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/displayCompanyById?companyId=${companyId}`);
      setOverviewData(response.data);
    } catch (error) {
      console.error('Error fetching company overview:', error);
    }
  };

  if (!overviewData) {
    return <p>Loading company overview...</p>; // Handle loading state
  }

  return (
    <div className='company-overview'>
      <Card style={{ marginTop: '20px' }}>
        <Card.Body>
          <>
            <h3>About {overviewData.companyName} </h3>
            <p>{overviewData.overView}</p>
            <h4>Website</h4>
            <p>
              <a href={overviewData.websiteLink} target="_blank" rel="noopener noreferrer">
                {overviewData.websiteLink}
              </a>
            </p>
            <h4>Industry</h4>
            <p>{overviewData.industryService}</p>
            <h4>Company Size</h4>
            <p>{overviewData.companySize === 0 ? '' : overviewData.companySize}</p>          
          </>
        </Card.Body>
      </Card>
      <Card style={{ marginTop: '20px' }}>
        <Card.Body>
          <>
            <h4>Headquarters</h4>
            <p>{overviewData.headquaters}</p>
            <h4>Founded</h4>
            <p>{overviewData.year === 0 ? '' : overviewData.year}</p>   
            <h4>Specialties</h4>
            <p>{overviewData.specialties}</p>
          </>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CompanyOverView;

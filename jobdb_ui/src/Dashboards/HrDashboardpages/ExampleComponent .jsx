// ExampleComponent.js
import axios from 'axios';
import React, { useEffect } from 'react';

const ExampleComponent = () => {
    useEffect(() => {
        const fetchUserData = async (userEmail) => {
            try {
              const response = await axios.get(`${BASE_API_URL}/getHRName`, {
                params: { userEmail: userEmail }
              });
              setUserData(response.data);
              setUserName(response.data.userName);
            } catch (error) {
              console.error('Error fetching user data:', error);
              setUserData(null);
            }
          };

        fetchUserData();
    }, []);

    return (
        <div>
            {/* Here you can put other component content */}
        </div>
    );
};

export default ExampleComponent;

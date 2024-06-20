import axios from 'axios';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const ResumeAdd = () => {
    const BASE_API_URL = "http://localhost:8082/api/jobbox";

    const location = useLocation();
    const userName = location.state?.userName;
    const userId = location.state?.userId;
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [fileType, setFileType] = useState('file');
    const [link, setLink] = useState('');
    const [briefMessage, setBriefMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); 
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };
    const handleBriefMessageChange = (event) => {
        setBriefMessage(event.target.value);
    };

    const handleFileTypeChange = (event) => {
        setFileType(event.target.value);
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('fileType', fileType);
        formData.append('message', message);

        if (fileType === 'file') {
            formData.append('file', file);
        } else if (fileType === 'link') {
            formData.append('link', link);
        } else if (fileType === 'brief') {
            formData.append('briefMessage', briefMessage);
        }

        try {
            const response = await axios.post(BASE_API_URL + '/uploadResume', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
              console.log('File uploaded successfully:', response.data);
            if (response) {
              };
           
            console.log('File uploaded successfully:', response.data);
            if (response.status === 200) {
                setSuccessMessage('Resume uploaded successfully!');
                
            } else {

                console.error('Resume upload failed');

                setSuccessMessage('File upload failed');

            }
        } catch (error) {
            console.error('Error uploading Resume:', error);
        }
    };

    const user = {
        userName: userName,
        userId: userId,
    };
    
    return (
        <div className='candidate-dashboard-container'>
            <div className='left-side'>
                <CandidateLeftSide user={user} />
            </div>
            <div className='resume-page'>
                <h2>Add Resume</h2>
                <form onSubmit={handleSubmit} className='resume-Add'>
                    <div className='select-type'>
                        <label>Select Type:</label>
                        <select value={fileType} onChange={handleFileTypeChange}>
                            <option value="file">File</option>
                            <option value="link">Link</option>
                            <option value="brief">Brief</option>
                        </select>
                    </div>
                    {fileType === 'file' && (
                        <div className='select-file'>
                            <label>Select File:</label>
                            <input type='file' accept='.pdf, .doc, .docx' onChange={handleFileChange} />
                        </div>
                    )}
                    {fileType === 'link' && (
                        <div className='select-link'>
                            <label>Enter Link:</label>
                            <input type='text' value={link} onChange={handleLinkChange} />
                        </div>
                    )}
                    {fileType === 'brief' && (
                        <div className='message-type'>
                            <label>Brief Resume:</label>
                           <pre><textarea value={briefMessage} onChange={handleBriefMessageChange}></textarea></pre>
                        </div>
                    )}
                        <div className='message-type'>
                            <label>Resume Title:</label>
                            <textarea value={message} onChange={handleMessageChange}></textarea>
                        </div>
                    <div>

                        <button type="submit" className='uploadResume'>Upload Resume</button>
                    </div>
                </form>
                {successMessage && <p>{successMessage}</p>}
            </div>
        </div>
    );
};

export default ResumeAdd;
import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomeFooter = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <div>
            <footer className='footer'>
                
                <div className='contact'>
                    <div className='social-icons'>

                        <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer' className='icon'>
                            <FaFacebook />
                        </a>
                        <a href='https://www.twitter.com' target='_blank' rel='noopener noreferrer' className='icon'>
                            <FaTwitter />
                        </a>
                        <a href='https://www.instagram.com' target='_blank' rel='noopener noreferrer' className='icon'>
                            <FaInstagram />
                        </a>
                        <a href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer' className='icon'>
                            <FaLinkedin />
                        </a>
                    </div>
                    <div className='footer-info'>
                        <p>
                            Think of our job lists as personalized playlists tailored for your career aspirations.
                            Whether you’re seeking opportunities in tech, finance, marketing, engineering, IT, sales, or other fields,
                            we’ve got you covered! Our curated job lists include hand-picked roles for new college graduates,
                            experienced professionals, and current students seeking internships.
                            {isExpanded ? (
                                <>
                                    <p>Easily find roles aligned with your major and industry through our diverse job lists,
                                        and use our filters to pinpoint jobs by industry, location, or start date.</p>
                                    <p> Looking for opportunities at innovative startups or big tech giants? We offer top roles at
                                        YCombinator-backed startups, unicorn companies, and major tech firms.</p>
                                    <p>
                                        Our platform streamlines the job search process by highlighting required skills and experiences
                                        for each posting, helping you quickly identify roles that match your qualifications.
                                        Our job matching engine further enhances your search by delivering relevant opportunities
                                        directly to your inbox, eliminating the need for endless browsing.</p>
                                    <p>Enjoy access to exclusive job postings vetted by our team and updated daily with the latest opportunities
                                        from our partner companies. We simplify your job search, making it as effortless as finding your favorite
                                        song on a playlist.</p>
                                    <p>Discover your next position at leading startups, scale-ups, and tech giants with JobBox today!</p>
                                    <span className="read-more" onClick={handleToggle} style={{ color: 'purple' }}> Show Less ▲</span>
                                </>
                            ) : (
                                <>
                                    ......
                                    <span className="read-more" onClick={handleToggle} style={{ color: 'purple' }}> Read More ▼</span>
                                </>
                            )}
                        </p>
                    </div>

                    <div>
                        {/* <div><img src="/jb_logo.png" alt="jobbox_logo" className='footer_jb_logo'></img></div> */}
                        <div className='rules'>
                            <Link to="/terms-and-conditions">Terms and Conditions</Link>
                            <Link to="/privacy-and-policy">Privacy Policy</Link>
                            <Link to="/contact">Contact</Link>
                        </div>

                        <div className='copyright'>
                            © 2024 Paaratech Inc. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomeFooter

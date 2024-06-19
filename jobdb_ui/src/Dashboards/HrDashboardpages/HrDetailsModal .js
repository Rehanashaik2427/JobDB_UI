import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const HrDetailsModal = ({ show, handleClose, hrDetails }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Body className="d-flex">
                <div className="hr-leftside-modal"></div>
                <div className="hr-details-content" style={{ marginLeft: '20px', height: '70%' }}>
                    {hrDetails ? (
                        <div>
                            <p><strong>HR ID:</strong> {hrDetails.userId}</p>
                            <p><strong>Name:</strong> {hrDetails.userName}</p>
                            <p><strong>Email:</strong> {hrDetails.userEmail}</p>
                            <p><strong>Phone Number:</strong> {hrDetails.phone}</p>
                            <p><strong>Company:</strong> {hrDetails.companyName}</p>
                        </div>
                    ) : (
                        <p>No details available</p>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default HrDetailsModal;

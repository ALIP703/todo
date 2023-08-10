import React from 'react'
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
function ViewTaskModel(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    View A Task
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.data.heading}</h4>
                <p>
                    {props.data.description}
                </p>
                <p>Priority: {props.data.priority}</p>
                <p>DateTime: {props.data.dateTime}</p>
                <p>CreatedAt: {props.data.createdAt}</p>
                <Card style={{ width: '100%', height: '30rem', border: '0', marginTop: '1rem' }}>
                    <img src={props.data.image} alt="" style={{ width: '100%', height: '30rem' }} />
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewTaskModel
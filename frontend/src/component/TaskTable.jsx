import React from 'react'
import { Modal, Button, DropdownButton, Dropdown, Form, FloatingLabel, Card } from 'react-bootstrap'
import { ApiServices } from '../service/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faEye, faFilter, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskTable.css'
import { handelDeleteTask, handleFilterClick, handleImageChange, useDateSelected, useFile, useImagePreviewUrl, useModelHeading, useModelOpen, usePriorityData, useTableData, useUserDataOnDialog } from './TaskTableHelper';

function TaskTable() {
    const { setFile } = useFile()
    const { imagePreviewUrl, setImagePreviewUrl } = useImagePreviewUrl()
    const { userData, setUserData } = useUserDataOnDialog()
    const { priorities, setPriorities } = usePriorityData()
    const { tableData, setTableData } = useTableData()
    const { selectedDate, setSelectedDate } = useDateSelected()
    const { modelShow, setModelShow } = useModelOpen()
    const { modelHead, setModelHead } = useModelHeading()


    const handleClose = () => setModelShow(false);
    const handleShow = () => setModelShow(true);

    React.useEffect(() => {
        ApiServices.getAllTasks().then((res) => {
            setTableData(res.data.tasks)
            ApiServices.getAllPriority().then((res) => {
                setPriorities(res.data.priorities)
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setTableData]);

    return (
        <div className="card">
            <div className="card-body">
                <div className="row align-items-center mb-3">
                    <h2 className="col" >Task List</h2>

                    {/* dropdown */}
                    <div className="dropdown filter">
                        {/* dropdown menu Button */}
                        <DropdownButton
                            // as={ButtonGroup}
                            key={'start'}
                            id={`dropdown-button-drop-start`}
                            drop={'start'}
                            variant="secondary"
                            size='sm'
                            title={<FontAwesomeIcon icon={faFilter} size='' className="icon-hover" />}
                        >
                            {/* dropdown menu item */}
                            <Dropdown.Item eventKey="1" onClick={() => { handleFilterClick(null,setTableData) }}>All</Dropdown.Item>
                            {priorities.map((priority) => (
                                <Dropdown.Item eventKey={priority.is}
                                    onClick={() => { handleFilterClick(priority.id, setTableData) }}>{priority.name}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>

                    {/* model */}
                    <div className="model model-section">
                        <Button variant="primary" size='sm'
                            onClick={() => {
                                handleShow()
                                setModelHead('Add Task')
                            }}>
                            <span style={{ marginRight: '8px' }}>Add Task</span>
                            <FontAwesomeIcon icon={faPlusCircle} className="icon-hover" />
                        </Button>


                        <Modal show={modelShow} onHide={handleClose}>
                            <form onSubmit={(event) => {
                                console.log(modelHead);
                                if (modelHead === 'Add Task') {
                                    console.log(modelHead);
                                }
                            }}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{modelHead}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <FloatingLabel htmlFor="heading">Heading</FloatingLabel>
                                    <Form.Control
                                        type="text"
                                        id="heading"
                                    />
                                    <FloatingLabel htmlFor="description">Description</FloatingLabel>
                                    <Form.Control
                                        as="textarea"
                                        id='description'
                                        rows={3}
                                    />
                                    <Form.Select aria-label="Default select example" style={{ marginTop: '1rem' }}>
                                        <option>Priority</option>
                                        {priorities.map((priority) => (
                                            <option value={priority.id}>{priority.name}</option>
                                        ))}
                                    </Form.Select>
                                    <FloatingLabel htmlFor="dateTime">DateTime</FloatingLabel>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={date => setSelectedDate(date)}
                                        showTimeSelect
                                        // showTimeSelectOnly
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        minDate={new Date()}
                                        dateFormat="Pp"
                                        isClearable
                                    />
                                    <label for="image" class="custom-file-upload">
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/png, image/jpeg"
                                            onChange={(e) => { handleImageChange(e, setFile, setImagePreviewUrl) }}
                                            className="filetype"
                                        />
                                        Choose Image
                                    </label>
                                    {imagePreviewUrl && (
                                        <Card style={{ width: '10rem', height: '10rem', border: '0', marginTop: '1rem' }}>
                                            <img src={imagePreviewUrl} alt="" style={{ width: '10rem', height: '10rem' }} />
                                        </Card>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button type='submit'>Submit</Button>
                                </Modal.Footer>
                            </form>
                        </Modal>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle table-bordered">
                        <thead>
                            <tr>
                                <th className="d-none d-md-table-cell text-center">SiNo</th>
                                <th className='text-center'>Title</th>
                                <th className="d-none d-md-table-cell">Description</th>
                                <th className="d-none d-sm-table-cell text-center">Priority</th>
                                <th className="d-none d-md-table-cell text-center">DateTime</th>
                                <th className="d-none d-lg-table-cell text-center">Image</th>
                                <th className='th-action text-center'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((data, index) => (
                                <tr key={data.id}>
                                    <td className="d-none d-md-table-cell text-center">{index + 1}</td>
                                    <td className='text-center'>{data.heading}</td>
                                    <td className='description  text-truncate d-none d-md-table-cell'>{data.description}</td>
                                    <td className="d-none d-sm-table-cell text-center">{data.priority}</td>
                                    <td className="d-none d-md-table-cell text-center">{data.dateTime}</td>
                                    <td className='th-image d-none d-lg-table-cell text-center'>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <img crossOrigin="anonymous" src={data.image} alt='doctor' className='table-image' />
                                        </div>
                                    </td>
                                    <td className='th-action justify-content-end text-center'>
                                        <FontAwesomeIcon icon={faEye} className='icon-hover ml-2 me-2' />
                                        <FontAwesomeIcon icon={faPencilAlt} className='icon-hover me-2' />
                                        <FontAwesomeIcon icon={faTrash} className='icon-hover me-2' onClick={() => { handelDeleteTask(data.id, setTableData) }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TaskTable
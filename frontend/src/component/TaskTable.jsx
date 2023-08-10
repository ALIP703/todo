import React from 'react'
import { Modal, Button, DropdownButton, Dropdown, Form, FloatingLabel, Card } from 'react-bootstrap'
import { ApiServices } from '../service/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faEye, faFilter, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskTable.css'
import { handelDeleteTask, handleAddTasks, handleFilterClick, handleImageChange, handleRowEdit, handleUpdateTask, handleUserDataChange, handleUserDateChange, useFile, useImagePreviewUrl, useModelHeading, useModelOpen, useOldImagePreviewUrl, usePriorityData, useRowId, useTableData, useUserDataOnDialog } from './TaskTableHelper';

function TaskTable() {
    const { file, setFile } = useFile()
    const { imagePreviewUrl, setImagePreviewUrl } = useImagePreviewUrl()
    const { userData, setUserData } = useUserDataOnDialog()
    const { priorities, setPriorities } = usePriorityData()
    const { tableData, setTableData } = useTableData()
    const { modelShow, setModelShow } = useModelOpen()
    const { modelHead, setModelHead } = useModelHeading()
    const { setOldImagePreviewUrl } = useOldImagePreviewUrl()
    const { rowId, setRowId } = useRowId()

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
                            title={<FontAwesomeIcon icon={faFilter} className="icon-hover" />}
                        >
                            {/* dropdown menu item */}
                            <Dropdown.Item eventKey="1" onClick={() => { handleFilterClick(null, setTableData) }}>All</Dropdown.Item>
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
                                if (modelHead === 'Add Task') {
                                    handleAddTasks(event, file, userData, setModelShow, setTableData, setOldImagePreviewUrl, setImagePreviewUrl, setUserData)
                                } else if (modelHead === 'Update Task') {
                                    handleUpdateTask(event, file, rowId, userData, setModelShow, setTableData, setImagePreviewUrl, setUserData)
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
                                        name='heading'
                                        value={userData.heading}
                                        onChange={(event) => { handleUserDataChange(event, userData, setUserData) }}
                                    />
                                    <FloatingLabel htmlFor="description">Description</FloatingLabel>
                                    <Form.Control
                                        as="textarea"
                                        id='description'
                                        rows={3}
                                        name='description'
                                        value={userData.description}
                                        onChange={(event) => { handleUserDataChange(event, userData, setUserData) }}
                                    />
                                    <Form.Select aria-label="Default select example"
                                        style={{ marginTop: '1rem' }}
                                        name='priorityId'
                                        value={userData.priorityId}
                                        onChange={(event) => { handleUserDataChange(event, userData, setUserData) }}
                                    >
                                        <option value={0}>Priority</option>
                                        {priorities.map((priority) => (
                                            <option value={priority.id}>{priority.name}</option>
                                        ))}
                                    </Form.Select>
                                    <FloatingLabel htmlFor="dateTime">DateTime</FloatingLabel>
                                    <DatePicker
                                        selected={userData.dateTime}
                                        onChange={date => { handleUserDateChange(date, userData, setUserData) }}
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        minDate={new Date()}
                                        dateFormat="Pp"
                                        isClearable
                                    />
                                    <label for="image" className="custom-file-upload">
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/png, image/jpeg"
                                            onChange={(e) => { handleImageChange(e, setFile, setImagePreviewUrl) }}
                                            className="filetype"
                                        />
                                        Choose Image
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        {imagePreviewUrl && (
                                            <Card style={{ width: '10rem', height: '10rem', border: '0', marginTop: '1rem',marginRight:'3rem' }}>
                                                <p>Image</p>
                                                <img src={imagePreviewUrl} alt="" style={{ width: '10rem', height: '10rem' }} />
                                            </Card>
                                        )}
                                        {userData?.image && (
                                            <Card style={{ width: '10rem', height: '10rem', border: '0', marginTop: '1rem' }}>
                                                <p>Old Image</p>
                                                <img src={userData.image} alt="" style={{ width: '10rem', height: '10rem' }} />
                                            </Card>
                                        )}
                                    </div>
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
                                            <img crossOrigin="anonymous" src={data.image} alt='Task_image' className='table-image' />
                                        </div>
                                    </td>
                                    <td className='th-action justify-content-end text-center'>
                                        <FontAwesomeIcon icon={faEye} className='icon-hover ml-2 me-2' />
                                        <FontAwesomeIcon icon={faPencilAlt} className='icon-hover me-2' onClick={() => { handleRowEdit(data, setModelShow, setUserData, setOldImagePreviewUrl, setModelHead, setRowId) }} />
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
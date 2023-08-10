import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApiServices } from '../service/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faEye, faFilter, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './TaskTable.css'

function TaskTable() {
    const [tableData, setTableDate] = React.useState([{
        id: 0,
        heading: '',
        description: '',
        dateTime: '',
        image: '',
        priority: '',
        createdAt: '',
    }]);
    const [priorities, setPriorities] = React.useState([{
        id: 0,
        name: ''
    }]);

    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleFilterClick = (priorityId = null) => {
        console.log(priorityId);
        if (priorityId !== null) {
            ApiServices.getAllTasks().then((res) => {
                setTableDate(res.data.tasks)
            })
        } else {
            ApiServices.getAllTasks().then((res) => {
                setTableDate(res.data.tasks)
            })
        }
    }
    const handelDeleteTask = (id) => {
        ApiServices.deleteTask(id).then((res) => {
            console.log(res.data.data);
            if (res.data.data === true) {
                ApiServices.getAllTasks().then((res) => {
                    setTableDate(res.data.tasks)
                })
            }
        })
    }

    React.useEffect(() => {
        ApiServices.getAllTasks().then((res) => {
            setTableDate(res.data.tasks)
            console.log(tableData);
            ApiServices.getAllPriority().then((res) => {
                setPriorities(res.data.priorities)
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setTableDate]);

    return (
        <div className="card">
            <div className="card-body">
                <div className="row align-items-center mb-3">
                    <h2 className="col" >Task List</h2>
                    <div className="dropdown filter">
                        <button className="btn btn-secondary btn-sm col-auto margin-right-3"
                            onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faFilter} className="icon-hover" />
                        </button>
                        <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} >
                            <li><button className="dropdown-item" onClick={() => { handleFilterClick() }}>All</button></li>
                            {priorities.map((priority) => (
                                <li><button className="dropdown-item" onClick={() => { handleFilterClick(priority.id) }}>{priority.name}</button></li>
                            ))}
                        </ul>
                    </div>
                    <button className="btn btn-secondary btn-sm col-auto margin-right-2" >
                        <span style={{ marginRight: '8px' }}>Add Task</span>
                        <FontAwesomeIcon icon={faPlusCircle} className="icon-hover ml-2" />
                    </button>
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
                                        <FontAwesomeIcon icon={faTrash} className='icon-hover me-2' onClick={()=>{handelDeleteTask(data.id)}}/>
                                        {/* <button className="btn btn-primary btn-sm me-2 float-end">
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm me-2 float-end">
                                            Delete
                                        </button> */}
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
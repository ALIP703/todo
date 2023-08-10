import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApiServices } from '../service/api';
import './TaskTable.css'

function TaskTable() {
    const [tableData, setTableDate] = React.useState([{
        id:0,
        heading:'',
        description:'',
        dateTime:'',
        image:'',
        priority:'',
        createdAt:'',
    }]);
    React.useEffect(() => {
        ApiServices.getAllTasks().then((res) => {
            setTableDate(res.data.tasks)
            console.log(tableData);
        })
        console.log(tableData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setTableDate]);

    return (
        <div className="card">
            <div className="card-body">
                <h2>Task List</h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead>

                            <tr>
                                <th>SiNo</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Priority</th>
                                <th>DateTime</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((data,index) => (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{data.heading}</td>
                                    <td className='description'>{data.description}</td>
                                    <td>{data.priority}</td>
                                    <td>{data.dateTime}</td>
                                    <td>{data.image}</td>
                                    <td></td>
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
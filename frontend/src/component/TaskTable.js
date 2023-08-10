import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApiServices } from '../service/api';

function TaskTable() {
    const [tableData, setTableDate] = React.useState([]);
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
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>John Doe</td>
                                <td>john@example.com</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jane Smith</td>
                                <td>jane@example.com</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Michael Johnson</td>
                                <td>michael@example.com</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TaskTable
import React from 'react';
import { ApiServices } from '../service/api';

function TaskTablePage() {
  
  React.useEffect(() => {
    ApiServices.getAllTasks().then((res) => {
      console.log(res);
    })
  }, []);
  // console.log(data);
  return (
    <div>
      <table id="example" className="display" >
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Office</th>
            <th>Age</th>
            <th>Start date</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tiger Nixon</td>
            <td>System Architect</td>
            <td>Edinburgh</td>
            <td>61</td>
            <td>2011-04-25</td>
            <td>$320,800</td>
          </tr>
          <tr>
            <td>Garrett Winters</td>
            <td>Accountant</td>
            <td>Tokyo</td>
            <td>63</td>
            <td>2011-07-25</td>
            <td>$170,750</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TaskTablePage;

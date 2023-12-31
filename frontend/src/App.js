import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom'
import TaskTablePage from './pages/TaskTablePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='' element={<TaskTablePage />} />
      </Routes>
    </div>
  );
}

export default App;

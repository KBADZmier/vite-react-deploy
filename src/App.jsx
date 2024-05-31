import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CButton , CListGroup, CListGroupItem, CFormSelect } from '@coreui/react';
import { addTask, deleteTask } from '/actions';
import { useDispatch } from 'react-redux';
import TaskList from './TaskList';
import './App.css'
//obsluga wyswietlania wybranego projektu z lista zadan

function Project({ name, tasks, handleCheckboxChange, handleDeleteTaskFromI }) {
  return (
    <div className="project">
      <h2> Projekt: {name}</h2>
      <div>
        <h3>Zadania:</h3>
        <CListGroup>
          {tasks.map((task, index) => (
            <CListGroupItem key={index}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleCheckboxChange(index)}
              />
              {task.name}
           
              <button onClick={() => handleDeleteTaskFromI(index)}>Usuń</button>
            </CListGroupItem>
          ))}
        </CListGroup>



      </div>
    </div>
  );
}

function App() {
  //wykorzystanie hook
  const [projectName, setProjectName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
//ustawianie nazwy
  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };
//ustawianie nazwy
  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };
//dodanie proejktu
  const handleAddProject = () => {
    if (projectName.trim() !== '') {
      setProjects([...projects, { name: projectName, tasks: [] }]);
      setProjectName('');
    }
  };
//dodanie zadania
const dispatch = useDispatch();

const handleAddTask = () => {
  if (taskName.trim() !== '' && selectedProject !== null) {
    const updatedProjects = projects.map((project, index) => {
      if (index === parseInt(selectedProject)) {
        dispatch(addTask({ name: taskName, completed: false }));
        return { ...project, tasks: [...project.tasks, { name: taskName, completed: false }] };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    setTaskName('');

    if (taskName.trim() !== '') {
      fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: taskName }),
      })
        .then(response => response.json())
        .then(data => {
          setTaskName('');
        })
        .catch(error => console.error('Error adding task:', error));
    }
  }
};
//chechbox
  const handleCheckboxChange = (projectIndex, taskIndex) => {
    const updatedProjects = projects.map((project, index) => {
      if (index === parseInt(projectIndex)) {
        const updatedTasks = project.tasks.map((task, i) => {
          if (i === taskIndex) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        return { ...project, tasks: updatedTasks };
      }
      return project;
    });
    setProjects(updatedProjects);
  };
//usuwanie zadan
const handleDeleteTaskFromI = (projectIndex, taskIndex) => {
  if (projectIndex === null || projects.length === 0 || !projects[projectIndex]) {
    console.error('Invalid project index or projects array is empty');
    return;
  }

  const updatedProjects = projects.map((project, index) => {
    if (index === parseInt(projectIndex)) {
      const filteredTasks = project.tasks.filter((task, i) => i !== taskIndex);
      return { ...project, tasks: filteredTasks };
    }
    return project;
  });
  deleteTask(taskIndex);
  setProjects(updatedProjects);
 console.log(projectIndex, taskIndex);
};


const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost:3001/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    setTasks(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};







//pobranie danych do listy
  useEffect(() => {
   

    fetchTasks();
  }, []);



  return (
    <Router>
    <div className="container">
      <div className="projects">
        <h2>Projekty:</h2>

        <CFormSelect
  options={['Lista projektów', ...projects.map((project, index) => ({ label: project.name, value: index }))]}
  value={selectedProject}
  onChange={(event) => setSelectedProject(event.target.value)}
/>



      </div>

      <div className="content">
      {selectedProject !== null && (
  <div className="project-view">
    <Project
      name={projects[selectedProject]?.name}
      tasks={projects[selectedProject]?.tasks}
      handleCheckboxChange={(index) => handleCheckboxChange(selectedProject, index)}
      handleDeleteTaskFromI={(index) => handleDeleteTaskFromI(selectedProject, index)}
    />
    </div>
    )}


        <div className="input-section">
          <div className="input-project">
            <input
              className="tekstmiejsce"
              type="text"
              value={projectName}
              onChange={handleProjectNameChange}
              placeholder="Wprowadź nazwę nowego projektu"
            />
          </div>
          <ons-button onClick={handleAddProject}style={{ backgroundColor: 'aquamarine', color: 'black', borderRadius: '10px',border: '2px solid black' }} >Dodaj nowy projekt</ons-button>

          {selectedProject !== null && (
            <div className="input-task">
              <input
                className="tekstmiejsce"
                type="text"
                value={taskName}
                onChange={handleTaskNameChange}
                placeholder="Wprowadź zadanie"
              />
               <ons-button onClick={handleAddTask}style={{ backgroundColor: 'aquamarine', color: 'black', borderRadius: '10px',border: '2px solid black' }} >Dodaj zadanie</ons-button>
            </div>
          )}
        </div>
      </div>
    </div>
        <Routes>
        <Route path="/tasklist" element={<TaskList tasks={tasks} fetchTasks={fetchTasks} />} />
        </Routes>
        <nav>
          <ul>
           
            <li>
              <Link to="/TaskList">Lista zadań</Link>
         
            </li>
          </ul>
        </nav>
      
 </Router>

  );
}

export default App;
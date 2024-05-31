import React from 'react';
import { CListGroup, CListGroupItem, CButton } from '@coreui/react';
import { useDispatch } from 'react-redux';
import { deleteTask } from '/actions';

const TaskList = ({ tasks, fetchTasks }) => {
  const dispatch = useDispatch();

  const deleteFromDB = (taskId) => {
    dispatch(deleteTask(taskId));
    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        fetchTasks();
        console.log('Task deleted successfully');
      } else {
        console.error('Failed to delete task');
      }
    })
    .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div className="delete">
      <h2>Lista zadań</h2>
      <CListGroup>
        {tasks.map(task => (
          <CListGroupItem key={task._id}>
            {task.name}, {task._id}
            <CButton onClick={() => deleteFromDB(task._id)} color="danger">Usuń</CButton>
          </CListGroupItem>
        ))}
      </CListGroup>
    </div>
  );
};

export default TaskList;

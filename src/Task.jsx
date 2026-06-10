import React from 'react';

function Task({ task, onToggle, onRemove }) {
  return (
    <li className="task-item">
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className={task.completed ? 'completed' : ''}>{task.title}</span>
      </label>
      <button
        className="delete-button"
        type="button"
        onClick={() => onRemove(task.id)}
      >
        Удалить
      </button>
    </li>
  );
}

export default Task;

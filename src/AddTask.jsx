import React from 'react';

function AddTask({ value, onChange, onSubmit }) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="task-input">
        Новая задача
      </label>
      <input
        id="task-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Введите задачу"
      />
      <button type="submit">Добавить</button>
    </form>
  );
}

export default AddTask;

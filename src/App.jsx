import React, { useEffect, useMemo, useState } from 'react';
import { fetchCurrency, fetchWeather, getCurrentLocation } from './api';
import { addTask, removeTask, toggleTask } from './todos';
import AddTask from './AddTask';
import Task from './Task';
import './App.css';

const TASKS_STORAGE_KEY = 'lab-tasks';

function App() {
  const [currency, setCurrency] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState(() => readSavedTasks());
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
    async function loadWidgets() {
      try {
        const location = await getCurrentLocation();
        const [currencyData, weatherData] = await Promise.all([
          fetchCurrency(),
          fetchWeather(location)
        ]);

        setCurrency(currencyData);
        setWeather(weatherData);
      } catch (loadError) {
        console.error(loadError);
        setError('Не удалось загрузить данные виджетов.');
      } finally {
        setLoading(false);
      }
    }

    loadWidgets();
  }, []);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  function handleSubmit(event) {
    event.preventDefault();
    setTasks((currentTasks) => addTask(currentTasks, taskTitle));
    setTaskTitle('');
  }

  function handleToggle(id) {
    setTasks((currentTasks) => toggleTask(currentTasks, id));
  }

  function handleRemove(id) {
    setTasks((currentTasks) => removeTask(currentTasks, id));
  }

  return (
    <main className="page">
      <section className="app-shell" aria-labelledby="page-title">
        <header className="app-header">
          <div>
            <h1 id="page-title">Список задач и информеры</h1>
          </div>
        </header>

        <section className="widgets" aria-label="Информационные виджеты">
          <InfoBlock title="Курс валют" loading={loading} error={error}>
            {currency && (
              <dl className="rates-list">
                <div>
                  <dt>USD</dt>
                  <dd>{currency.usd} руб.</dd>
                </div>
                <div>
                  <dt>EUR</dt>
                  <dd>{currency.eur} руб.</dd>
                </div>
              </dl>
            )}
          </InfoBlock>

          <InfoBlock title="Погода" loading={loading} error={error}>
            {weather && (
              <dl className="weather-list">
                <div>
                  <dt>Место</dt>
                  <dd>{weather.location}</dd>
                </div>
                <div>
                  <dt>Температура</dt>
                  <dd>{weather.temperature}</dd>
                </div>
                <div>
                  <dt>Ветер</dt>
                  <dd>{weather.wind}</dd>
                </div>
              </dl>
            )}
          </InfoBlock>
        </section>

        <section className="tasks-section" aria-labelledby="tasks-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ToDo</p>
              <h2 id="tasks-title">Список задач</h2>
            </div>
            <p className="tasks-counter">
              Выполнено: {completedCount} из {tasks.length}
            </p>
          </div>

          <AddTask
            value={taskTitle}
            onChange={setTaskTitle}
            onSubmit={handleSubmit}
          />

          {tasks.length === 0 ? (
            <p className="empty-state">Пока задач нет. Добавьте первую задачу.</p>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

function InfoBlock({ title, loading, error, children }) {
  return (
    <article className="info-block">
      <h2>{title}</h2>
      {loading && <p className="muted">Загрузка...</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && children}
    </article>
  );
}

function readSavedTasks() {
  const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch {
    return [];
  }
}

export default App;

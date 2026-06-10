export function addTask(tasks, title, createId = defaultId) {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return tasks;
  }

  return [
    ...tasks,
    {
      id: createId(),
      title: trimmedTitle,
      completed: false
    }
  ];
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

function defaultId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
}

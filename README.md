# Лабораторная работа

курс валют, погода и список задач.

## Возможности

- получение курса USD и EUR через API ЦБ РФ;
- получение текущей погоды через Open-Meteo;
- добавление, выполнение и удаление задач;
- сохранение задач в `localStorage`;
- минималистичный светлый интерфейс.

## Запуск

```bash
npm install
npm run dev
```

 `http://localhost:5173`.

## Проверка кода

```bash
npm run lint
```

## Docker

```bash
docker build -t student-dashboard-lab .
docker run -p 8080:80 student-dashboard-lab
```

`http://localhost:8080`.

const CURRENCY_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_LOCATION = {
  latitude: 55.7558,
  longitude: 37.6173,
  label: 'Москва'
};

export function formatCurrency(value) {
  return Number(value).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatTemperature(value) {
  return `${Math.round(Number(value))}°C`;
}

export function getCurrencyViewModel(data) {
  if (!data?.Valute?.USD?.Value || !data?.Valute?.EUR?.Value) {
    throw new Error('Не удалось получить курс валют.');
  }

  return {
    usd: formatCurrency(data.Valute.USD.Value),
    eur: formatCurrency(data.Valute.EUR.Value)
  };
}

export function getWeatherViewModel(data) {
  if (!data?.current) {
    throw new Error('Не удалось получить погоду.');
  }

  return {
    temperature: formatTemperature(data.current.temperature_2m),
    wind: `${Number(data.current.wind_speed_10m).toFixed(1)} м/с`
  };
}

export async function fetchCurrency() {
  const response = await fetch(CURRENCY_URL);

  if (!response.ok) {
    throw new Error('Сервис валют временно недоступен.');
  }

  return getCurrencyViewModel(await response.json());
}

export async function fetchWeather(location = DEFAULT_LOCATION) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'temperature_2m,wind_speed_10m',
    wind_speed_unit: 'ms',
    timezone: 'auto'
  });

  const response = await fetch(`${WEATHER_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Сервис погоды временно недоступен.');
  }

  return {
    ...getWeatherViewModel(await response.json()),
    location: location.label
  };
}

export function getCurrentLocation() {
  if (!navigator.geolocation) {
    return Promise.resolve(DEFAULT_LOCATION);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: 'Ваш регион'
        });
      },
      () => resolve(DEFAULT_LOCATION),
      { timeout: 5000 }
    );
  });
}

import React, { useState } from 'react';
import { fetchWeather } from '../services/WeatherApi';
import '../styles/WeatherApp.css';

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    skytext: string;
  };
  forecast: {
    date: string;
    day: string;
    low: number;
    high: number;
    skytextday: string;
  }[];
}

const WeatherApp: React.FC = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  const handleFetchWeather = async () => {
    setError('');
    setWeatherData(null);

    try {
      const data = await fetchWeather({ location });
      setWeatherData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="weather-app">
      <h1 className="weather-title">Weather App</h1>
      <div className="weather-input-container">
        <input
          className="weather-input"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button className="weather-button" onClick={handleFetchWeather}>
          Get Weather
        </button>
      </div>

      {error && <p className="weather-error">{error}</p>}

      {weatherData && (
        <div className="weather-result">
          <h2 className="weather-location">{weatherData.location}</h2>
          <p className="weather-info">
            Temperature: <span>{weatherData.current.temperature}°C</span>
          </p>
          <p className="weather-info">
            Sky: <span>{weatherData.current.skytext}</span>
          </p>
          <h3 className="weather-forecast-title">Forecast:</h3>
          <ul className="weather-forecast-list">
            {weatherData.forecast.map((day) => (
              <li key={day.date} className="weather-forecast-item">
                {day.day}: {day.low}°C - {day.high}°C, {day.skytextday}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
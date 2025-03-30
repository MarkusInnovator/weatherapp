export interface WeatherRequest {
    location: string;
  }
  
  export const fetchWeather = async ({ location }: WeatherRequest) => {
    const response = await fetch('http://localhost:3000/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching weather data');
    }
  
    return response.json();
  };
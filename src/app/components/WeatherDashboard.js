"use client";

import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [localTime, setLocalTime] = useState({ time: "", date: "" });

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);

    if (lastCity) {
      fetchWeather(lastCity);
    } else {
      fetchCurrentLocationWeather();
    }
  }, []);

  useEffect(() => {
    if (weather) {
      const intervalId = setInterval(() => {
        const currentTime = new Date(Date.now() + weather.timezone * 1000);
        const timeString = currentTime.toTimeString().slice(0, 8);
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const dateString = currentTime.toLocaleDateString(undefined, options);
        setLocalTime({ time: timeString, date: dateString });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [weather]);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");
    try {
      const apiKey = "51947bb28f96b7caab93dfb0c756950c";
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const weatherData = await weatherResponse.json();

      if (weatherData.cod !== 200) {
        setError("City not found");
        setWeather(null);
        setForecast([]);
        setLoading(false);
        return;
      }

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      setForecast(forecastData.list.filter((item, index) => index % 8 === 0));
      setLocalTime(
        new Date(Date.now() + weatherData.timezone * 1000)
          .toUTCString()
          .slice(-12, -4)
      );
      setLoading(false);
      localStorage.setItem("lastCity", city);
    } catch (error) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true);
          setError("");

          try {
            const weatherResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );
            const weatherData = await weatherResponse.json();

            if (weatherData.cod !== 200) {
              setError("Location not found");
              setWeather(null);
              setForecast([]);
              setLoading(false);
              return;
            }

            const forecastResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );
            const forecastData = await forecastResponse.json();

            setWeather(weatherData);
            setForecast(
              forecastData.list.filter((item, index) => index % 8 === 0)
            );
            setLocalTime(
              new Date(Date.now() + weatherData.timezone * 1000)
                .toUTCString()
                .slice(-12, -4)
            );
            setLoading(false);
          } catch (error) {
            setError("Failed to fetch data");
            setLoading(false);
          }
        },
        () => {
          setError("Failed to get location");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const toggleFavorite = (city) => {
    const updatedFavorites = favorites.includes(city)
      ? favorites.filter((fav) => fav !== city)
      : [...favorites, city];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="mx-auto p-4 bg-white shadow-2xl rounded-xl">
      <form className="flex mb-4" onSubmit={handleSearch}>
        <h1 className="text-3xl font-bold p-2 mr-2 bg-gradient-to-r from-slate-500 to-zinc-500 text-white rounded-2xl shadow-xl ">
          Weather Dashboard
        </h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-md"
          placeholder="Enter city name"
        />
        <button
          type="submit"
          className="p-2 bg-gradient-to-r from-slate-500 to-zinc-500 text-white rounded-r-md hover:bg-blue-500"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-blue-500">Loading...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {weather && !loading && (
        <div className="mb-8 p-4 bg-gradient-to-r from-slate-500 to-zinc-500 rounded-lg transition transform ease-in-out duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-3xl font-bold mb-2">
              {weather.name}
            </h2>
            {/* <div className="text-white mt-5 text-5xl bg-gray-500 rounded-lg p-1 shadow-xl">
              <p>{localTime.time}</p>
            </div> */}
            <div className="text-white mt-1 md:mt-5 text-xl bg-gray-500 rounded-lg p-1 shadow-xl">
              <p>{localTime.date}</p>
            </div>

            <button onClick={() => toggleFavorite(weather.name)}>
              {favorites.includes(weather.name) ? (
                <FaStar className="text-white" />
              ) : (
                <FaRegStar className="text-gray-500" />
              )}
            </button>
          </div>
          <p className="text-white text-xl">
            Temperature: {weather.main.temp} °C
          </p>
          <p className="text-white text-xl">
            Humidity: {weather.main.humidity} %
          </p>
          <p className="text-white text-xl">
            Wind Speed: {weather.wind.speed} m/s
          </p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="w-24 h-24"
          />
        </div>
      )}

      {forecast.length > 0 && !loading && (
        <div>
          <h3 className="text-2xl font-bold mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {forecast.map((day) => (
              <div
                key={day.dt}
                className="p-4 bg-gradient-to-r from-stone-500 to-slate-500 border text-white border-gray-300 rounded-md text-center transition transform ease-in-out duration-300"
              >
                <p className="text-lg font-semibold">
                  {new Date(day.dt * 1000).toLocaleDateString()}
                </p>
                <p className="text-xl">Temp: {day.main.temp} °C</p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="w-16 h-16 mx-auto"
                />
                <p className="text-lg capitalize">
                  {day.weather[0].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 mt-8">Favorite Cities</h3>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {favorites.map((favorite) => (
              <button
                key={favorite}
                onClick={() => fetchWeather(favorite)}
                className="p-2 bg-gradient-to-r from-zinc-400 to-stone-600 text-white rounded-md text-xl transition transform ease-in-out duration-300"
              >
                {favorite}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;

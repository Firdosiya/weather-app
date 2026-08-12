import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const averageTemp =
  forecast.length > 0
    ? (
        forecast.reduce((sum, item) => sum + item.main.temp, 0) /
        forecast.length
      ).toFixed(1)
    : 0;

const highestTemp =
  forecast.length > 0
    ? Math.max(...forecast.map((item) => item.main.temp)).toFixed(1)
    : 0;

const lowestTemp =
  forecast.length > 0
    ? Math.min(...forecast.map((item) => item.main.temp)).toFixed(1)
    : 0;
    const getWeatherIcon = (condition) => {
  switch (condition) {
    case "Clear":
      return "☀️";
    case "Clouds":
      return "☁️";
    case "Rain":
      return "🌧️";
    case "Thunderstorm":
      return "⛈️";
    case "Snow":
      return "❄️";
    case "Mist":
    case "Fog":
    case "Haze":
      return "🌫️";
    default:
      return "🌤️";
  }
};
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "61804b15046bd399df011dab85393cc2";

  // 🌍 Search by city
  const getWeather = async () => {
    if (!city.trim()) {
      alert("Enter city name");
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await res.json();

      if (data.cod !== 200) {
        alert(data.message);
        return;
      }

      setWeather({
        city: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        condition: data.weather[0].main,
      });
    } catch (error) {
      alert("Error fetching weather");
    }
  };

const getForecast = async () => {
  if (!city.trim()) {
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    if (data.cod !== "200") {
      alert(data.message);
      return;
    }

    // Take one forecast for each day
    const dailyForecast = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    setForecast(dailyForecast.slice(0, 5));
  } catch (error) {
    alert("Error fetching forecast");
  }
};
 // 📍 Current location weather + Forecast
  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          // 1. Current Weather
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();

          if (data.cod !== 200) {
            alert(data.message);
            return;
          }

          setWeather({
            city: data.name,
            temp: data.main.temp,
            humidity: data.main.humidity,
            condition: data.weather[0].main,
          });

          // 2. 5-Day Forecast for Location
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const forecastData = await forecastRes.json();

          if (forecastData.cod === "200") {
            const dailyForecast = forecastData.list.filter((item) =>
              item.dt_txt.includes("12:00:00")
            );
            setForecast(dailyForecast.slice(0, 5));
          }
        } catch (error) {
          alert("Error fetching location weather");
        }
      },
      () => {
        alert("Location permission denied");
      }
    );
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "linear-gradient(135deg, #74ebeb, #10746f)",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#eef2f1",
          borderRadius: "20px",
          padding: "25px",
          paddingTop: "30px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1>🌤 Weather App</h1>

        {/* Input + Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getWeather();
            getForecast();
          }}
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: "#10746f",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Search
          </button>
        </form>

        {/* Location Button */}
        <button
          onClick={getLocationWeather}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#ddd",
            fontWeight: "500",
          }}
        >
          📍 Use Current Location
        </button>

        {/* Weather Card */}
        {weather && (
          <div
            style={{
              marginTop: "20px",
              background: "white",
              borderRadius: "15px",
              padding: "20px",
            }}
          >
            <h2>{weather.city}</h2>
            <h2>{weather.temp}°C</h2>
            <p
  style={{
    fontSize: "18px",
    fontWeight: "bold",
  }}
>
  {getWeatherIcon(weather.condition)} {weather.condition}
</p>
            <p>💧 Humidity: {weather.humidity}%</p>
          </div>
        )}
       {forecast.length > 0 && (
  <div
    style={{
      marginTop: "20px",
      background: "white",
      borderRadius: "15px",
      padding: "20px",
    }}
  >
    <h3>📅 5 Day Forecast</h3>

    {forecast.map((item, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          marginTop: "8px",
          background: "#eef2f1",
          borderRadius: "10px",
        }}
      >
        <strong>
          {new Date(item.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
          })}
        </strong>

        <span>
          🌡 {Math.round(item.main.temp)}°C
        </span>

        <span>
          ☁ {item.weather[0].main}
        </span>
      </div>
    ))}
  </div>
)}
{forecast.length > 0 && (
  <div
    style={{
      marginTop: "20px",
      background: "white",
      borderRadius: "15px",
      padding: "20px",
    }}
  >
    <h3>📊 Climate Analysis</h3>

    <p>
      🌡 Average Temperature: {averageTemp}°C
    </p>

    <p>
      🔥 Highest Temperature: {highestTemp}°C
    </p>

    <p>
      ❄ Lowest Temperature: {lowestTemp}°C
    </p>
  </div>
)}
      </div>
    </div>
  );
}

export default App;
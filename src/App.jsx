import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [predictedTemp, setPredictedTemp] = useState(null);

  // Stats Calculations (JavaScript Data Reduction)
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

  const averageHumidity =
    forecast.length > 0
      ? (
          forecast.reduce((sum, item) => sum + item.main.humidity, 0) /
          forecast.length
        ).toFixed(0)
      : 0;

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear": return "☀️";
      case "Clouds": return "☁️";
      case "Rain": return "🌧️";
      case "Thunderstorm": return "⛈️";
      case "Snow": return "❄️";
      default: return "🌤️";
    }
  };

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "61804b15046bd399df011dab85393cc2";

  // Helper function to process forecast and prediction data
  const processForecastData = (data) => {
    if (data.cod === "200") {
      const dailyForecast = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast.slice(0, 5));

      // Client-side Statistical Prediction Logic (PPT Compliant)
      const next24Hrs = data.list.slice(0, 8);
      const avgNextTemp =
        next24Hrs.reduce((sum, item) => sum + item.main.temp, 0) /
        next24Hrs.length;
      setPredictedTemp(avgNextTemp.toFixed(1));
    }
  };

  const getWeather = async () => {
    if (!city.trim()) return;
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
    if (!city.trim()) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      processForecastData(data);
    } catch (error) {
      alert("Error fetching forecast");
    }
  };

  // Fetch weather and forecast using current location GPS
  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Fetch Current Weather by Lat/Lon
            const weatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const weatherData = await weatherRes.json();
            if (weatherData.cod === 200) {
              setWeather({
                city: weatherData.name,
                temp: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                condition: weatherData.weather[0].main,
              });
              setCity(weatherData.name);
            }

            // Fetch Forecast by Lat/Lon
            const forecastRes = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const forecastData = await forecastRes.json();
            processForecastData(forecastData);
          } catch (error) {
            alert("Error fetching location weather data.");
          }
        },
        () => {
          alert("Unable to retrieve your location. Please check browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", overflow: "hidden", background: "#10746f" }}>
      <div style={{ width: "55%", padding: "20px", background: "#eef2f1", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "90%", maxWidth: "650px", textAlign: "center" }}>
          <h1 style={{ fontSize: "40px", margin: "0 0 20px 0" }}>🌤️ Weather & AI Predictor</h1>

          <form onSubmit={(e) => { e.preventDefault(); getWeather(); getForecast(); }} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            <button type="submit" style={{ padding: "12px 20px", borderRadius: "10px", border: "none", background: "#10746f", color: "white", fontWeight: "bold", cursor: "pointer" }}>
              Search
            </button>
          </form>

          {/* Use Current Location Button */}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={handleLocationSearch}
              type="button"
              style={{
                backgroundColor: "#d1e7dd",
                color: "#0f5132",
                border: "1px solid #badbcc",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              📍 Use Current Location
            </button>
          </div>

          {weather && (
            <div style={{ background: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <h2>{weather.city}</h2>
              <h3 style={{ fontSize: "32px", margin: "10px 0" }}>{weather.temp}°C</h3>
              <p>{getWeatherIcon(weather.condition)} {weather.condition} | 💧 {weather.humidity}%</p>
              
              {/* Statistical Prediction Result Box */}
              <div style={{ marginTop: "20px", padding: "15px", background: "#e6f4f1", borderRadius: "10px", border: "1px solid #10746f" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#10746f" }}>📊 Climate Prediction for Tomorrow</h4>
                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                  {predictedTemp ? `${predictedTemp}°C` : "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: "45%", padding: "20px", background: "#10746f", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", gap: "15px" }}>
        {forecast.length > 0 && (
          <div style={{ background: "white", color: "#333", borderRadius: "15px", padding: "15px" }}>
            <h3 style={{ textAlign: "center", margin: "0 0 10px 0" }}>📅 5 Day Forecast</h3>
            {forecast.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", padding: "5px", background: "#eef2f1", borderRadius: "6px" }}>
                <span>{new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}</span>
                <span>{getWeatherIcon(item.weather[0].main)}</span>
                <span><b>{Math.round(item.main.temp_max)}°</b> / {Math.round(item.main.temp_min)}°C</span>
              </div>
            ))}
          </div>
        )}

        {forecast.length > 0 && (
          <div style={{ background: "white", color: "#333", borderRadius: "15px", padding: "15px" }}>
            <h3 style={{ textAlign: "center", margin: "0 0 10px 0" }}>📊 Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", textAlign: "center" }}>
              <div><b>Avg Temp:</b> {averageTemp}°C</div>
              <div><b>Avg Humidity:</b> {averageHumidity}%</div>
              <div><b>Max Temp:</b> {highestTemp}°C</div>
              <div><b>Min Temp:</b> {lowestTemp}°C</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
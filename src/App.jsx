import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const API_KEY = "61804b15046bd399df011dab85393cc2";

  // 🌍 Search by city
  const getWeather = async () => {
    if (!city.trim()) return alert("Enter city name");

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

  // 📍 Current location weather
  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );

          const data = await res.json();

          setWeather({
            city: data.name,
            temp: data.main.temp,
            humidity: data.main.humidity,
            condition: data.weather[0].main,
          });
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
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #74ebeb, #10746f)",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#eef2f1",
          borderRadius: "20px",
          padding: "25px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1>🌤 Weather App</h1>

        {/* Input + Search */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
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
            onClick={getWeather}
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
        </div>

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
            <p>☁ {weather.condition}</p>
            <p>💧 Humidity: {weather.humidity}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
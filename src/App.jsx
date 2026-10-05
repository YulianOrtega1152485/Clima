import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { useFetch } from './hooks/useFetch'

function App() {
  const [text, setText] = useState("")
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${text}&count=5&language=es`
  const esMayor3 = text.length >= 3;;
  const busqueda = useFetch(esMayor3 ? url : null);
  const ciudades = busqueda.datos?.results ?? null;
  const [ubicacion, setUbicacion] = useState(null);

  function descripcion(code) {
    if (code === 0) return { texto: "Despejado", icono: "☀️" };
    if (code <= 2) return { texto: "Parcialmente nublado", icono: "⛅" };
    if (code === 3) return { texto: "Nublado", icono: "☁️" };
    if (code <= 48) return { texto: "Niebla", icono: "🌫️" };
    if (code <= 57) return { texto: "Llovizna", icono: "🌦️" };
    if (code <= 67) return { texto: "Lluvia", icono: "🌧️" };
    if (code <= 77) return { texto: "Nieve", icono: "❄️" };
    if (code <= 82) return { texto: "Chubascos", icono: "🌧️" };
    return { texto: "Tormenta", icono: "⛈️" };
  }

  function Clima() {
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${ubicacion.latitude}&longitude=${ubicacion.longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
    const clima = useFetch(urlClima);
    const desc = descripcion(clima.datos?.current?.weather_code);
    console.log("url:", urlClima, "| estado:", clima);
    return (
      <div>
        <h2>{ubicacion.name}, {ubicacion.country}</h2>
        <p>{clima.datos?.current?.temperature_2m}</p>
        <p>{desc.icono} {desc.texto}</p>
      </div>
    )
  }

  return (
    <>
      <h1>Clima
      </h1>
      <form>
        <input placeholder="Ingrese una ciudad" value={text} onChange={(e) => {
          setText(e.target.value)
          setUbicacion(null)
        }} />
      </form>
      {busqueda.cargando && esMayor3 && !busqueda.error && <p>Cargando...</p>}
      {busqueda.error && esMayor3 && <p>Error: {busqueda.error}</p>}
      {ciudades === null && esMayor3 && !busqueda.error && !busqueda.cargando && <p>No se encontraron resultados</p>}
      {ciudades && esMayor3 && !busqueda.error && !busqueda.cargando
        && (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {

              ciudades.map((item) => (
                <button key={item.id} onClick={() => {
                  setText(item.name)
                  setUbicacion(item)
                }}>
                  {item.name}, {item.country}
                </button>
              ))
            }
          </ul>
        )
      }
      {ubicacion
        !== null && <Clima />}
    </>
  )
}

export default App

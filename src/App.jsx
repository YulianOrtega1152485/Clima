import { useState,useMemo } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { useFetch } from './hooks/useFetch'


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

function diaSemana(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long' });
}

function ClimaDiario({ daily }) {
  console.log("daily:", daily)
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      {daily.time.map((fecha, index) => {
        return (
          <div key={fecha}>
            <p>{diaSemana(fecha)}</p>
            <p>{descripcion(daily.weather_code[index]).icono}</p>
            <p>{daily.temperature_2m_min[index]}-{daily.temperature_2m_max[index]}</p>
          </div>
        )
      })
      }
    </div>
  )
}

function Clima({ ubicacion }) {
  console.log("ubicacion:", ubicacion)
  const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${ubicacion?.latitude}&longitude=${ubicacion?.longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
  const clima = useFetch(urlClima);
  const desc = descripcion(clima.datos?.current?.weather_code);
  const resumen = useMemo(() => {
    if (!clima.datos) return null;
    const max = clima.datos.daily.temperature_2m_max;
    const min = clima.datos.daily.temperature_2m_min;
    return {
      maxima: Math.max(...max),
      minima: Math.min(...min),
      diaMax: clima.datos.daily.time[max.indexOf(Math.max(...max))],
    };
  }, [clima.datos]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <h2>{ubicacion.name}, {ubicacion.country}</h2>
      <p>{clima.datos?.current?.temperature_2m} °C</p>
      <p>{desc.icono} {desc.texto}</p>
      <p>{clima.datos?.current?.wind_speed_10m} m/s</p>
      <p> esta semana: maxima{resumen?.maxima}°C, minima {resumen?.minima}°C. El día más caluroso es el {resumen?.diaMax}</p>
      {clima.datos?.daily && <ClimaDiario daily={clima.datos.daily} />}
    </div>
  )
}


function App() {
  const [text, setText] = useState("")
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${text}&count=5&language=es`
  const esMayor3 = text.length >= 3;;
  const busqueda = useFetch(esMayor3 ? url : null);
  const ciudades = busqueda.datos?.results ?? null;
  const [ubicacion, setUbicacion] = useState(null);




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
      {ubicacion !== null && <Clima ubicacion={ubicacion} />}
    </>
  )
}

export default App

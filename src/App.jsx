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
  const clima = useFetch(esMayor3 ? url : null);

  return (
    <>
      <h1>Clima
      </h1>
      <form>
        <input placeholder="Ingrese una ciudad" value={text} onChange={(e) => {
          setText(e.target.value)
        }} />
      </form>
      {clima.cargando && esMayor3 && !clima.error && <p>Cargando...</p>}
      {clima.error && esMayor3 && <p>Error: {clima.error}</p>}
      {clima.datos === null && esMayor3 && !clima.error && !clima.cargando && <p>No se encontraron resultados</p>}
      {clima.datos && esMayor3 && !clima.error && !clima.cargando
        && (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {

              clima.datos.results.map((item) => (
                <button key={item.id} onClick={() => {
                  setText(item.name)
                }}>
                  {item.name}, {item.country}
                </button>
              ))
            }
          </ul>
        )
      }

    </>
  )
}

export default App

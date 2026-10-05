import { useState, useEffect } from 'react';

export function useFetch(url) {
    console.log(2)
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;
        const control = new AbortController();
        async function fetchData() {
            setCargando(true);
            setError(null);
            try {
                const respuesta = await fetch(url, { signal: control.signal });
                if (!respuesta.ok) {
                    throw new Error('Error en la solicitud');
                }
                console.log("respuesta"+respuesta.status)
                const dato = await respuesta.json();
                setDatos(dato.results?dato:null);
            } catch (e) {
                if (e.name === "AbortError") return; // cancelación, no es un error real
                setError(e.message);
            } finally {
                if (!control.signal.aborted) setCargando(false);
            }
        }
        fetchData();
        return () => control.abort();
    }, [url]);

    return { datos, cargando, error };
}
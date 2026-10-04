export function useFetch(url) {
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
                const dato = await respuesta.json();
            } catch (error) {
                setError(error.message);
            }

        }

        return () => control.abort();
    }, [url]);

    return { datos, cargando, error };
}
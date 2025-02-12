import { useState, useEffect } from 'react';

export default function GetBackendData(page, limit) {
    const [realThreats, setRealThreats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchThreats = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:3001/api/threats?page=${page}&limit=${limit}`);
                
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error)
                }

                setRealThreats(data.threats);
            } catch (err) {
                setError(err.message)
            }
            setLoading(false);
        }

        fetchThreats();
    }, [page, limit]);

    return {realThreats, loading, error}
}
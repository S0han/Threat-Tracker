import React, { useState } from 'react';
import Pagination from './Pagination';

import getBackendData from '../functions/GetBackendData';

export default function ThreatsTable() {
    const [filterThreat, setFilterThreat] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const { realThreats, loading, error } = getBackendData(page, limit);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    
    const uniqueThreatTypes = [...new Set(realThreats.map((item) => item.threat_type))];
    const filteredThreats = filterThreat 
        ? realThreats.filter((item) => (item.threat_type === filterThreat))
        : realThreats;

    const sortedThreats = [...filteredThreats].sort((a, b) => {
        return sortOrder === 'desc'
        ? new Date(b.date_added) - new Date(a.date_added)
        : new Date(a.date_added) - new Date(b.date_added)
    });
    
    const handleSortToggle = () => {
        setSortOrder((prevSortOrder) => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
    }

    return (
        <div>
            
            <label>Filter by Threat Type</label>
            <select onChange={(e) => setFilterThreat(e.target.value)} value={filterThreat}>
                <option value="">All</option>
                {
                    uniqueThreatTypes.map((threat) => (
                        <option key={threat} value={threat}>{threat}</option>
                    ))
                }
            </select>

            <button onClick={handleSortToggle}>
                Sort by Date ({sortOrder === 'desc' ? 'Descending' : 'Ascending'})
            </button>

            <table>
                <thead>
                    <tr>
                        <th>Host</th>
                        <th>URL</th>
                        <th>Threat Type</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedThreats.map(item => (
                            <tr key={item.id}>
                                <td>{item.host}</td>
                                <td>{item.url}</td>
                                <td>{item.threat_type}</td>
                                <td>{item.date_added}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <Pagination page={page} setPage={setPage} realThreats={realThreats} limit={limit} />
        </div>
    );
}
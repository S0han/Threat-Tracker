import React, { useState } from 'react';

export default function ThreatsTable() {
    const [filterThreat, setFilterThreat] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    
    const dummy_threats = [
        { id: 1, host: "cat.com", url: "https://cat.com", threatType: "catSteal", dateAdded: "2024-02-10" },
        { id: 2, host: "dog.com", url: "https://dog.com", threatType: "dogAttack", dateAdded: "2024-01-10" }
    ]
    
    const uniqueThreatTypes = [...new Set(dummy_threats.map((item) => item.threatType))];
    const filteredThreats = filterThreat 
        ? dummy_threats.filter((item) => (item.threatType === filterThreat))
        : dummy_threats;

    const sortedThreats = [...filteredThreats].sort((a, b) => {
        return sortOrder === 'desc'
        ? new Date(b.dateAdded) - new Date(a.dateAdded)
        : new Date(a.dateAdded) - new Date(b.dateAdded)
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
                                <td>{item.threatType}</td>
                                <td>{item.dateAdded}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}
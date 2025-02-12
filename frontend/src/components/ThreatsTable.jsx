import React, { useState } from 'react';
import Pagination from './Pagination';
import SortFilter from './SortFilter';

import getBackendData from '../functions/getBackendData';

export default function ThreatsTable() {
    const [filterThreat, setFilterThreat] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const { realThreats, loading, error } = getBackendData(page, limit);

    if (loading) {
        return <p className="text-center text-xl">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-xl text-red-500">Error: {error}</p>;
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
            <SortFilter 
                uniqueThreatTypes={uniqueThreatTypes} 
                setFilterThreat={setFilterThreat}
                filterThreat={filterThreat}
                handleSortToggle={handleSortToggle}
                sortOrder={sortOrder}
            />

            <table className="min-w-full border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                        <th className="px-6 py-3 min-w-[150px]">Host</th>
                        <th className="px-6 py-3 min-w-[250px]">URL</th>
                        <th className="px-6 py-3 min-w-[180px]">Threat Type</th>
                        <th className="px-6 py-3 min-w-[200px]">Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedThreats.map(item => (
                            <tr key={item.id} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-3">{item.host}</td>
                                <td className="px-6 py-3">{item.url}</td>
                                <td className="px-6 py-3">{item.threat_type}</td>
                                <td className="px-6 py-3">{item.date_added}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <Pagination page={page} setPage={setPage} realThreats={realThreats} limit={limit} />
        </div>
    );
}
export default function SortFilter({ uniqueThreatTypes, setFilterThreat, filterThreat, handleSortToggle, sortOrder }) {
    return (
        <div className="flex">
            <div className="flex px-4">
                <label className="text-sm font-medium">Filter by Threat Type:</label>
                <select 
                    className="border border-gray-300 rounded px-4 py-2 text-sm"
                    onChange={(e) => setFilterThreat(e.target.value)} 
                    value={filterThreat}
                >
                    <option value="">All</option>
                    {
                        uniqueThreatTypes.map((threat) => (
                            <option key={threat} value={threat}>{threat}</option>
                        ))
                    }
                </select>
            </div>

            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                onClick={handleSortToggle}
            >
                Sort by Date ({sortOrder === 'desc' ? 'Descending' : 'Ascending'})
            </button>
        </div>
    );
}
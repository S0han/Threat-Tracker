export default function SortFilter({ uniqueThreatTypes, setFilterThreat, filterThreat, handleSortToggle, sortOrder }) {
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
        </div>
    );
}
export default function Pagination({ page, setPage, realThreats, limit }) {
    return (
        <div className="flex justify-center">
            <button 
                className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 transition ${page === 1 ? 'cursor-not-allowed' : ''}`}
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
            >
                Previous
            </button>
            <span className="text-sm">Page {page}</span>
            <button 
                className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 transition ${realThreats.length < limit ? 'cursor-not-allowed' : ''}`}
                disabled={realThreats.length < limit}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
        </div>
    )
}
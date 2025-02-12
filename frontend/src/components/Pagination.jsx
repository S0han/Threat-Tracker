export default function Pagination({ page, setPage, realThreats, limit }) {
    return (
        <div>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span> Page {page} </span>
            <button 
                disabled={realThreats.length < limit}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
        </div>
    )
} 
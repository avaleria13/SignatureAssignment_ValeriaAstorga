
import { useState } from "react";

const API_URL = "http://localhost:3000/api/adoptions";

function App() {
    const [adoptionId, setAdoptionId] = useState("");
    const [universityId, setUniversityId] = useState("");
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    async function fetchAdoptions(endpoint = "") {
        setLoading(true);
        setError("");
        setAdoptions([]);

        try {
            const response = await fetch(API_URL + endpoint);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Request failed."
                );
            }

            setAdoptions(
                Array.isArray(data) ? data : [data]
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    }

    function searchAdoption(event) {
        event.preventDefault();
        fetchAdoptions(`/${adoptionId}`);
    }

    function searchUniversity(event) {
        event.preventDefault();
        fetchAdoptions(`/university/${universityId}`);
    }

    const columns = [
        ...new Set(
            adoptions.flatMap(
                adoption => Object.keys(adoption)
            )
        )
    ].filter(key => key !== "_id");

    function formatValue(value) {
        if (value === null || value === undefined) {
            return "—";
        }

        if (typeof value === "object") {
            return JSON.stringify(value);
        }

        return String(value);
    }

    return (
        <>
            <a className="skip-link" href="#main-content">
                Skip to main content
            </a>

            <header className="site-header">
                <div className="container">
                    <p className="eyebrow">
                        Academic Records / Database Explorer
                    </p>

                    <h1>University Adoptions</h1>

                    <p>
                        Browse and search university adoption
                        records.
                    </p>
                </div>
            </header>

            <main id="main-content" className="container">
                <section
                    className="panel"
                    aria-labelledby="all-title"
                >
                    <h2 id="all-title">All adoptions</h2>

                    <p>
                        Retrieve every adoption sorted by date.
                    </p>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => fetchAdoptions()}
                    >
                        View all adoptions
                    </button>
                </section>

                <div className="search-grid">
                    <section
                        className="panel"
                        aria-labelledby="adoption-title"
                    >
                        <h2 id="adoption-title">
                            Search by adoption
                        </h2>

                        <form onSubmit={searchAdoption}>
                            <label htmlFor="adoption-id">
                                Adoption ID
                            </label>

                            <input
                                id="adoption-id"
                                name="adoptionId"
                                type="number"
                                min="1"
                                step="1"
                                required
                                placeholder="Example: 14"
                                value={adoptionId}
                                onChange={event =>
                                    setAdoptionId(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                Search adoption
                            </button>
                        </form>
                    </section>

                    <section
                        className="panel"
                        aria-labelledby="university-title"
                    >
                        <h2 id="university-title">
                            Search by university
                        </h2>

                        <form onSubmit={searchUniversity}>
                            <label htmlFor="university-id">
                                University ID
                            </label>

                            <input
                                id="university-id"
                                name="universityId"
                                type="number"
                                min="1"
                                step="1"
                                required
                                placeholder="Example: 100724"
                                value={universityId}
                                onChange={event =>
                                    setUniversityId(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                Search university
                            </button>
                        </form>
                    </section>
                </div>

                <section
                    className="panel"
                    aria-labelledby="results-title"
                    aria-busy={loading}
                >
                    <h2 id="results-title">Search results</h2>

                    <p role="status">
                        {loading
                            ? "Loading adoption records..."
                            : !searched
                                ? "Select a search option to begin."
                                : error
                                    ? "Search unsuccessful."
                                    : `${adoptions.length} record(s) found.`
                        }
                    </p>

                    {error && (
                        <p className="error" role="alert">
                            {error}
                        </p>
                    )}

                    {adoptions.length > 0 && (
                        <div
                            className="table-container"
                            tabIndex={0}
                            role="region"
                            aria-label="Adoption records table"
                        >
                            <table>
                                <caption>
                                    Retrieved adoption records
                                </caption>

                                <thead>
                                    <tr>
                                        {columns.map(column => (
                                            <th
                                                key={column}
                                                scope="col"
                                            >
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {adoptions.map(
                                        (adoption, index) => (
                                            <tr
                                                key={
                                                    adoption._id
                                                    || index
                                                }
                                            >
                                                {columns.map(
                                                    column => (
                                                        <td key={column}>
                                                            {formatValue(
                                                                adoption[column]
                                                            )}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            <footer className="site-footer">
                <p>
                    Project 2 — MongoDB, Express, React
                    and Node.js
                </p>
            </footer>
        </>
    );
}

export default App;

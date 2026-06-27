const API_URL = import.meta.env.VITE_API_URL

export async function retrieveDocuments (query, provider) {
    const response = await fetch(API_URL+"/research", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            provider
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.detail || "Search error")
    }

    return data
}

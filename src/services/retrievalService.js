const API_URL = import.meta.env.VITE_API_URL

export async function retrieveDocuments (query) {
    const response = await fetch(API_URL+"/research", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
        }),
    })

    return await response.json()
}
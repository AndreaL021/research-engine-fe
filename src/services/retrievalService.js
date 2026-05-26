export async function retrieveDocuments (query) {
    const response = await fetch("http://127.0.0.1:8000/research", {
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
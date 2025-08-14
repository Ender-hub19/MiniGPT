async function processMessage(userInput) {
    const normalizedInput = normalizeText(userInput);

    // Primero, intentar con las respuestas predefinidas (chatbot básico)
    for (const [keywords, responseList] of responses) {
        if (keywords.some(keyword => normalizedInput.includes(keyword))) {
            return getRandomResponse(responseList);
        }
    }

    // Si no hay coincidencia, usar la API de Hugging Face para el Mini-GPT
    const HUGGING_FACE_API_TOKEN = "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"; // ¡REEMPLAZA ESTO CON TU TOKEN REAL!
    const HUGGING_FACE_MODEL_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"; // Modelo de ejemplo

    try {
        const response = await fetch(HUGGING_FACE_MODEL_URL, {
            headers: { Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}` },
            method: "POST",
            body: JSON.stringify({ inputs: userInput }),
        });

        const result = await response.json();

        if (response.ok && result && result.length > 0 && result[0].generated_text) {
            // La API de DialoGPT devuelve el historial de conversación, necesitamos la última parte
            const generatedText = result[0].generated_text;
            const lastResponse = generatedText.split("\n").pop(); // Obtener la última línea
            return lastResponse.trim();
        } else {
            console.error("Error de la API de Hugging Face:", result);
            return getRandomResponse(defaultResponses); // Fallback a respuestas por defecto
        }
    } catch (error) {
        console.error("Error al llamar a la API de Hugging Face:", error);
        return getRandomResponse(defaultResponses); // Fallback a respuestas por defecto
    }
}

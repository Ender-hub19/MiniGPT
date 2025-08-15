async function processMessage(userInput) {
    const normalizedInput = normalizeText(userInput); { // document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messagesContainer');

    // Función para agregar mensajes al chat
    function addMessage(text, sender = 'user') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
    }

    // Función para manejar el envío
    async function handleSend() {
        const userInput = messageInput.value.trim();
        if (userInput) {
            addMessage(userInput, 'user'); // Mostrar mensaje del usuario
            messageInput.value = '';
            // Aquí puedes llamar a tu función chatbot o simplemente responder fijo
            const botResponse = '¡Mensaje recibido!'; // Reemplaza por tu lógica de respuesta
            addMessage(botResponse, 'bot');
        }
    }

    sendButton.addEventListener('click', handleSend);

    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});

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

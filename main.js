// --- Mobile Menu Toggle ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}


// --- Clickable Feature Cards ---

// 1. Define all the button IDs and their corresponding links.
const buttonLinks = {
    // Tourist Section
    "aiPersonalization": "src/ai-chatbot/inde.html", // Corrected path from "inde.html"
    "immersiveExp": "src/ar-vr/index.html",
    "safety": "src/safety-features/index.html",

    // Community Section
    "digitalMarketplace": "src/marketplace/index.html",
    "verification": "src/blockchain-info/index.html",
    "financialInclusion": "src/finance/index.html",

    // Heritage Section
    "culturalShowcase": "src/culture/index.html",
    "knowledgeHub": "src/knowledge/index.html",
    "gamified": "src/gamification/index.html",

    // Governance Section
    "analytics": "src/dashboard/index.html",
    "aiImprovement": "src/feedback-analysis/index.html",
    "sustainable": "src/eco-tourism/index.html"
};

// 2. A single function to handle all clicks.
function handleFeatureClick(event) {
    const clickedId = event.currentTarget.id;
    const urlToOpen = buttonLinks[clickedId];

    if (urlToOpen) {
        window.location.href = urlToOpen;
    } else {
        console.warn(`No URL defined for ID: ${clickedId}`);
    }
}

// 3. Loop through all the keys (the IDs) in our buttonLinks object.
for (const id in buttonLinks) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('click', handleFeatureClick);
    }
}



// --- Floating Chatbot Functionality --- 🤖

// This entire section is wrapped in a check to ensure it only runs if the chatbot HTML exists on the page.
const chatToggle = document.getElementById('chat-toggle');
if (chatToggle) {
    const chatWidget = document.getElementById('chat-widget');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatContainer = document.getElementById('chat-container');
    const chatLoading = document.getElementById('chat-loading');

    // --- API Configuration ---
    // API key from your second file is now here.
    const API_KEY = "AIzaSyDVSQYHRDMP-eTPnhDsNLgXXstiXDSzbP4"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    let chatHistory = []; // Stores the conversation history

    // --- Chatbot UI Logic ---
    const toggleChat = () => {
        chatWidget.classList.toggle('hidden');
        chatWidget.classList.toggle('flex');
    };
    
    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);

    // --- Chatbot API Logic ---
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (API_KEY.includes("YOUR_API_KEY")) {
            appendChatMessage('model', "The chatbot is disabled. An API key is required.");
            return;
        }

        const userInput = chatInput.value.trim();
        if (!userInput) return;

        appendChatMessage('user', userInput);
        chatInput.value = '';
        chatLoading.classList.remove('hidden');

        try {
            // This is a general-purpose prompt for the main page chatbot.
            const systemPrompt = `You are a friendly and helpful multilingual travel assistant for a Jharkhand Tourism website.
            Your goal is to answer user questions concisely and encourage them to use the "AI-Powered Personalization" feature to generate a detailed itinerary.
            If the user asks a question in a specific language, you MUST respond in that same language.
            Keep your answers helpful and to the point.`;
            
            let chatContextForAPI = [...chatHistory, { role: "user", parts: [{ text: userInput }] }];
            
            const payload = {
                contents: chatContextForAPI,
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            
            const result = await response.json();
            const botResponse = result.candidates[0].content.parts[0].text;
            
            appendChatMessage('model', botResponse);
            
            // Add messages to history to maintain context
            chatHistory.push({ role: "user", parts: [{ text: userInput }] });
            chatHistory.push({ role: "model", parts: [{ text: botResponse }] });

        } catch (err) {
            console.error('Chat Error:', err);
            appendChatMessage('model', "Sorry, I'm having a little trouble right now. Please try again.");
        } finally {
            chatLoading.classList.add('hidden');
        }
    });

    function appendChatMessage(role, text) {
        const messageWrapper = document.createElement('div');
        const icon = role === 'user' ? 
            `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-gray-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>` :
            `<div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-blue-600"><path d="M12.57 2.43A14.5 14.5 0 0 1 21.5 14.2c0 8.07-10.09 9.38-11.23 2.16a12.5 12.5 0 0 1 10.46-15.06Z"/><path d="M12.57 2.43A14.5 14.5 0 0 0 3.5 14.2c0 8.07 10.09 9.38 11.23 2.16A12.5 12.5 0 0 0 4.27 1.11Z"/></svg>
            </div>`;

        messageWrapper.className = `flex items-start gap-2.5 mb-4 ${role === 'user' ? 'justify-end' : ''}`;
        
        const messageContent = `
            <div class="flex flex-col gap-1 w-full max-w-[320px]">
                <div class="leading-1.5 p-3 border-gray-200 ${role === 'user' ? 'bg-blue-600 text-white rounded-s-xl rounded-es-xl' : 'bg-gray-100 rounded-e-xl rounded-es-xl'}">
                    <p class="text-sm font-normal">${text}</p>
                </div>
            </div>`;
        
        if (role === 'user') {
            messageWrapper.innerHTML = messageContent + icon;
        } else {
            messageWrapper.innerHTML = icon + messageContent;
        }

        chatContainer.appendChild(messageWrapper);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}
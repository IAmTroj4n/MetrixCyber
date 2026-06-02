// --- Chatbot Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const chatHTML = `
        <div id="chatbot-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; font-family: 'Outfit', sans-serif;">
            <div id="chatbot-toggle" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, #7000ff, #0da19c); display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 5px 15px rgba(13, 161, 156, 0.3); transition: transform 0.3s;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <div id="chatbot-window" style="display: none; width: 350px; height: 450px; background: #0a0a0f; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; position: absolute; bottom: 80px; right: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5); flex-direction: column; overflow: hidden;">
                <div style="background: rgba(10,10,15,0.9); padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #0da19c; font-family: 'Space Grotesk';">Metrix AI Assistant</strong>
                    <span id="chatbot-close" style="color: #8b949e; cursor: pointer;">✕</span>
                </div>
                <div id="chatbot-messages" style="flex: 1; padding: 15px; overflow-y: auto; color: #f0f4f8; font-size: 0.9rem; display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; max-width: 80%; align-self: flex-start;">
                        Hello! How can I help you with Saudi compliance (SACS-210, SABIC CT, NCA) or IT services today?
                    </div>
                </div>
                <div style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px;">
                    <input type="text" id="chatbot-input" placeholder="Type your message..." style="flex: 1; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: white; outline: none;">
                    <button id="chatbot-send" style="background: #0da19c; color: #000; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">Send</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const toggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const close = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');
    const messages = document.getElementById('chatbot-messages');

    toggle.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        toggle.style.transform = chatWindow.style.display === 'flex' ? 'scale(0.9)' : 'scale(1)';
    });

    close.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        toggle.style.transform = 'scale(1)';
    });

    const sendMessage = () => {
        const text = input.value.trim();
        if (!text) return;

        // User message
        messages.innerHTML += `<div style="background: linear-gradient(45deg, #7000ff, #0da19c); color: white; padding: 10px; border-radius: 8px; max-width: 80%; align-self: flex-end;">${text}</div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        // Bot response (mocked)
        setTimeout(() => {
            let reply = "Our team will get back to you shortly. For compliance forms, please visit the Compliance page.";
            if (text.toLowerCase().includes('sacs') || text.toLowerCase().includes('aramco')) {
                reply = "We provide full support for Aramco SACS-210 CCC/CCC+ certification. Please fill out the evaluation form on our Compliance page.";
            } else if (text.toLowerCase().includes('sabic')) {
                reply = "SABIC CyberTrust compliance is one of our core specialties. We assist with SAQ and evidence collection.";
            } else if (text.toLowerCase().includes('nca')) {
                reply = "We help organizations align with NCA ECC-1:2018 and CSCC-1:2019 frameworks.";
            }
            
            messages.innerHTML += `<div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; max-width: 80%; align-self: flex-start;">${reply}</div>`;
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    };

    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

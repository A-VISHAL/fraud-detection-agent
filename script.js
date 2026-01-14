// Demo Payment App - Logic
const WEBHOOK_URL = "http://localhost:5678/webhook-test/0672fa7f-94f6-47a2-9741-fcc278bc9b7b";

document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    const timestampInput = document.getElementById('timestamp');
    const payButton = document.getElementById('pay-button');
    const payLoader = document.getElementById('pay-loader');
    const btnText = payButton.querySelector('.btn-text');
    const statusMessage = document.getElementById('status-message');

    const notificationContainer = document.getElementById('notification-container');

    // Show notification helper
    const showNotification = (title, message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        
        if (type === 'error') {
            icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        } else if (type === 'info') {
            icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        }

        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        notificationContainer.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    };

    // Auto-fill current time
    const updateTime = () => {
        const now = new Date();
        timestampInput.value = now.toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'medium'
        });
    };

    updateTime();
    // Refresh time every minute to keep it fairly accurate if the user stays on the page
    setInterval(updateTime, 60000);

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(paymentForm);
        const userId = formData.get('user_id');
        const merchant = formData.get('merchant');
        const amount = formData.get('amount');
        const timestamp = new Date().toISOString();

        // Prepare payload
        const payload = {
            user_id: userId,
            merchant: merchant,
            amount: parseFloat(amount),
            timestamp: timestamp,
            location: "Chennai"
        };

        // UI State: Loading
        payButton.disabled = true;
        payLoader.style.display = 'block';
        btnText.style.opacity = '0.5';
        statusMessage.classList.add('hidden');

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // UI State: Reset loading
            payLoader.style.display = 'none';
            btnText.style.opacity = '1';
            payButton.disabled = false;

            if (response.ok) {
                // Get the response as text first to handle both string and JSON responses
                const responseText = await response.text();
                let displayMsg = responseText;

                try {
                    // Try to parse as JSON to see if there's a specific 'message' field
                    const data = JSON.parse(responseText);
                    displayMsg = data.message || data.output || data.result || responseText;
                } catch (e) {
                    // If not JSON, we just use the raw text (which is what you pasted in n8n)
                    displayMsg = responseText;
                }

                console.log("Webhook Success Content:", displayMsg);
                
                showNotification("Payment Authorized", displayMsg, "success");
                statusMessage.classList.remove('hidden');

                // Reset form on success
                setTimeout(() => {
                    paymentForm.reset();
                    updateTime();
                }, 3000);
            } else {
                // Server Error: Status 400, 500, etc.
                console.error("Webhook Server Error:", response.status);
                showNotification("Transaction Alert", "Something went wrong. Please try again.", "error");
            }

        } catch (error) {
            // Network or CORS Error
            console.error("Fetch Exception:", error);
            
            payLoader.style.display = 'none';
            btnText.style.opacity = '1';
            payButton.disabled = false;

            showNotification("Connection Error", "Network error occurred or request blocked. Please check your connection.", "error");
        }
    });
});

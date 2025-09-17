document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const verifyForm = document.getElementById('verify-form');
    const verifyBtn = document.getElementById('verify-btn');
    const productIdInput = document.getElementById('product-id-input');
    const resultDisplay = document.getElementById('result-display');
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const etherscanLink = document.getElementById('etherscan-link');

    // --- API Configuration ---
    // IMPORTANT: Replace "YOUR_ETHERSCAN_API_KEY" with your actual key
    const ETHERSCAN_API_KEY = "YOUR_ETHERSCAN_API_KEY";

    verifyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const txHash = productIdInput.value.trim();

        // Basic validation for an Ethereum transaction hash
        if (!/^0x([A-Fa-f0-9]{64})$/.test(txHash)) {
            displayResult('error', 'Invalid Format', 'Please enter a valid 66-character transaction hash starting with "0x".');
            return;
        }

        if (ETHERSCAN_API_KEY === "YOUR_ETHERSCAN_API_KEY") {
             displayResult('error', 'API Key Missing', 'The developer needs to add an Etherscan API key.');
            return;
        }

        // --- Start Verification Process ---
        showLoadingState();

        const apiUrl = `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok.');
            
            const data = await response.json();

            if (data.status === "0") { // Etherscan API returns status "0" for an error in the request
                throw new Error(data.result || 'Invalid transaction hash.');
            }
            
            // Check the actual transaction status
            if (data.result.status === "1") {
                displayResult('success', 'Verification Successful', `This product's authenticity was confirmed on the blockchain.`);
            } else if (data.result.status === "0") {
                displayResult('fail', 'Verification Failed', 'This product could not be verified on the blockchain.');
            } else {
                 displayResult('error', 'Unknown Status', 'The transaction status could not be determined.');
            }
            etherscanLink.href = `https://etherscan.io/tx/${txHash}`;

        } catch (error) {
            console.error('Verification Error:', error);
            displayResult('error', 'Verification Error', error.message);
        } finally {
            hideLoadingState();
        }
    });

    // --- UI Update Functions ---
    function showLoadingState() {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>`;
        resultDisplay.classList.add('hidden');
    }

    function hideLoadingState() {
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = `<span>Verify</span>`;
    }

    function displayResult(type, title, message) {
        resultDisplay.classList.remove('hidden', 'bg-green-100', 'border-green-500', 'bg-red-100', 'border-red-500', 'bg-yellow-100', 'border-yellow-500');
        resultIcon.classList.remove('fa-check-circle', 'text-green-500', 'fa-times-circle', 'text-red-500', 'fa-exclamation-triangle', 'text-yellow-500');
        etherscanLink.classList.remove('hidden');

        resultTitle.textContent = title;
        resultMessage.textContent = message;

        if (type === 'success') {
            resultDisplay.classList.add('bg-green-100', 'border-green-500');
            resultIcon.classList.add('fa-check-circle', 'text-green-500');
        } else if (type === 'fail') {
            resultDisplay.classList.add('bg-red-100', 'border-red-500');
            resultIcon.classList.add('fa-times-circle', 'text-red-500');
        } else { // Error or other
            resultDisplay.classList.add('bg-yellow-100', 'border-yellow-500');
            resultIcon.classList.add('fa-exclamation-triangle', 'text-yellow-500');
            etherscanLink.classList.add('hidden'); // Hide link on format error
        }
    }
});
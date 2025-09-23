document.addEventListener('DOMContentLoaded', () => {
    const calculatorForm = document.getElementById('calculator-form');
    const resultDisplay = document.getElementById('result-display');
    const carbonOutput = document.getElementById('carbon-output');
    const treesEquivalent = document.getElementById('trees-equivalent');
    const tipsList = document.getElementById('tips-list');

    // Emission factors (in kg CO2 per unit). These are simplified estimates.
    const emissionFactors = {
        transport: {
            car: 0.18,      // per km
            train: 0.04,    // per km
            bus: 0.08,      // per km
            flight: 0.25    // per km
        },
        accommodation: {
            budget: 10,     // per night
            'mid-range': 25, // per night
            luxury: 50      // per night
        }
    };

    calculatorForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload

        // Get user inputs
        const transportMode = document.getElementById('transport-mode').value;
        const distance = parseFloat(document.getElementById('distance').value) || 0;
        const nights = parseFloat(document.getElementById('nights').value) || 0;
        const hotelType = document.getElementById('hotel-type').value;

        // Calculate footprint
        const transportFootprint = distance * emissionFactors.transport[transportMode];
        const accommodationFootprint = nights * emissionFactors.accommodation[hotelType];
        const totalFootprint = transportFootprint + accommodationFootprint;

        // Display results
        carbonOutput.textContent = totalFootprint.toFixed(2);
        
        // A mature tree absorbs about 21 kg of CO2 per year.
        const trees = (totalFootprint / 21).toFixed(1);
        treesEquivalent.textContent = trees;
        
        // Generate and display tips
        generateTips(totalFootprint);
        
        // Show the result section
        resultDisplay.classList.remove('hidden');
    });

    function generateTips(footprint) {
        tipsList.innerHTML = ''; // Clear previous tips
        let tips = [];

        if (footprint < 100) {
            tips = [
                'Choose local restaurants to reduce food miles.',
                'Carry a reusable water bottle to avoid plastic waste.',
                'Opt for walking or cycling for short distances.'
            ];
        } else if (footprint < 500) {
            tips = [
                'Prioritize train travel over short-haul flights for your next trip.',
                'Choose accommodations with certified eco-labels.',
                'Contribute to a local community conservation project.'
            ];
        } else {
            tips = [
                'Consider donating to a certified carbon offset program, like a reforestation project.',
                'Group your trips to reduce the frequency of long-distance travel.',
                'Advocate for and choose travel companies with strong sustainability policies.'
            ];
        }

        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }
});
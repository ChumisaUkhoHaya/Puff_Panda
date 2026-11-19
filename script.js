document.addEventListener('DOMContentLoaded', () => {
    const ageGate = document.getElementById('age-gate');
    const mainContent = document.getElementById('main-content');
    const enterBtn = document.getElementById('enter-btn');
    const exitBtn = document.getElementById('exit-btn');

    // Check if user has already verified their age
    const isVerified = localStorage.getItem('puffPandaAgeVerified');

    if (isVerified === 'true') {
        // Skip age gate
        ageGate.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        // Show age gate (default behavior based on HTML inline styles)
        ageGate.style.display = 'flex';
    }

    // Handle Enter Button
    enterBtn.addEventListener('click', () => {
        localStorage.setItem('puffPandaAgeVerified', 'true');
        
        // Fade out effect
        ageGate.style.opacity = '0';
        setTimeout(() => {
            ageGate.style.display = 'none';
            mainContent.style.display = 'block';
        }, 300); // Wait for transition
    });

    // Handle Exit Button
    exitBtn.addEventListener('click', () => {
        // Redirect them away from the site
        window.location.href = 'https://www.google.com';
    });
});

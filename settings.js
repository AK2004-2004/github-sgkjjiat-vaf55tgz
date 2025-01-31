document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    loadSettings();

    // Save settings button
    const saveButton = document.getElementById('saveSettings');
    saveButton.addEventListener('click', saveSettings);

    // Add click handler to day buttons
    const dayButtons = document.querySelectorAll('.day-button input');
    dayButtons.forEach(button => {
        button.addEventListener('change', () => {
            button.parentElement.classList.toggle('active', button.checked);
        });
    });
});

function loadSettings() {
    // Load settings from localStorage
    const settings = JSON.parse(localStorage.getItem('filterSettings') || '{}');

    // Set filter mode
    const filterMode = settings.filterMode ?? 'normal';
    document.querySelector(`input[name="filterMode"][value="${filterMode}"]`).checked = true;

    // Set time inputs
    document.getElementById('filterStartTime').value = settings.filterStartTime ?? '18:00';
    document.getElementById('filterEndTime').value = settings.filterEndTime ?? '09:00';

    // Set vacation dates if they exist
    if (settings.vacationStart) {
        document.getElementById('vacationStart').value = settings.vacationStart;
    }
    if (settings.vacationEnd) {
        document.getElementById('vacationEnd').value = settings.vacationEnd;
    }

    // Set active days
    const activeDays = settings.activeDays ?? [1, 2, 3, 4, 5];
    document.querySelectorAll('.day-button input').forEach(button => {
        const day = parseInt(button.value);
        button.checked = activeDays.includes(day);
        button.parentElement.classList.toggle('active', button.checked);
    });
}

function saveSettings() {
    const settings = {
        filterMode: document.querySelector('input[name="filterMode"]:checked').value,
        filterStartTime: document.getElementById('filterStartTime').value,
        filterEndTime: document.getElementById('filterEndTime').value,
        vacationStart: document.getElementById('vacationStart').value,
        vacationEnd: document.getElementById('vacationEnd').value,
        activeDays: Array.from(document.querySelectorAll('.day-button input:checked')).map(input => parseInt(input.value))
    };

    localStorage.setItem('filterSettings', JSON.stringify(settings));
    
    // Show success message
    const saveButton = document.getElementById('saveSettings');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Modifications enregistrées !';
    saveButton.classList.add('success');
    
    setTimeout(() => {
        saveButton.textContent = originalText;
        saveButton.classList.remove('success');
    }, 2000);
}
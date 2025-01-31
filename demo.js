// Simple demo interactions
document.addEventListener('DOMContentLoaded', () => {
    const toggleFilter = document.getElementById('toggleFilter');
    const toggleText = document.getElementById('toggleText');
    const filterStatus = document.getElementById('filterStatus');
    const filterMode = document.getElementById('filterMode');
    const emojiIcon = document.querySelector('.emoji-icon');
    const updateMessage = document.getElementById('updateMessage');
    const addException = document.getElementById('addException');
    const exceptionEmail = document.getElementById('exceptionEmail');
    const exceptionsList = document.getElementById('exceptionsList');

    // Load filter mode from localStorage
    const settings = JSON.parse(localStorage.getItem('filterSettings') || '{}');
    const currentMode = settings.filterMode || 'normal';
    filterMode.textContent = currentMode === 'normal' ? 'Mode normal' : 'Mode agressif';
    filterMode.className = `filter-mode-indicator ${currentMode}`;

    // Emoji states
    const emojis = {
        inactive: '😴',
        normal: {
            active: '🧹' // Balai pour le nettoyage normal
        },
        aggressive: {
            active: '🚫' // Interdiction pour le mode agressif
        }
    };

    // Toggle filter
    toggleFilter.addEventListener('click', () => {
        const isEnabled = toggleFilter.classList.contains('enabled');
        if (isEnabled) {
            toggleFilter.classList.remove('enabled');
            toggleFilter.classList.add('disabled');
            toggleText.textContent = 'INACTIF';
            filterStatus.textContent = "Le filtre n'est pas en marche";
            emojiIcon.textContent = emojis.inactive;
        } else {
            toggleFilter.classList.remove('disabled');
            toggleFilter.classList.add('enabled');
            toggleText.textContent = 'ACTIF';
            filterStatus.textContent = "Le filtre est en marche, attention aucun email ne vous parviendra";
            const mode = filterMode.classList.contains('aggressive') ? 'aggressive' : 'normal';
            emojiIcon.textContent = emojis[mode].active;
        }
    });

    // Update message
    updateMessage.addEventListener('click', () => {
        alert('Message updated!');
    });

    // Add exception
    addException.addEventListener('click', () => {
        const email = exceptionEmail.value.trim();
        if (email) {
            const item = document.createElement('div');
            item.className = 'exception-item';
            item.innerHTML = `
                <span>${email}</span>
                <button class="remove-exception">Remove</button>
            `;
            exceptionsList.appendChild(item);
            exceptionEmail.value = '';

            // Add remove handler to new button
            item.querySelector('.remove-exception').addEventListener('click', () => {
                item.remove();
            });
        }
    });

    // Remove exception
    document.querySelectorAll('.remove-exception').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.exception-item').remove();
        });
    });
});
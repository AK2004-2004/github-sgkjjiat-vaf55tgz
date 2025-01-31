// State management
let state = {
    user: null,
    filterConfig: {
        enabled: false,
        autoReplyMessage: "Je suis actuellement en train d'utiliser un filtre email. Pour les sujets urgents, merci de me contacter par un autre canal.",
        exceptions: []
    }
};

// DOM Elements
const userSection = document.getElementById('userSection');
const loginSection = document.getElementById('loginSection');
const filterSection = document.getElementById('filterSection');
const userPicture = document.getElementById('userPicture');
const logoutButton = document.getElementById('logoutButton');
const toggleFilter = document.getElementById('toggleFilter');
const toggleText = document.getElementById('toggleText');
const autoReplyMessage = document.getElementById('autoReplyMessage');
const updateMessage = document.getElementById('updateMessage');
const exceptionEmail = document.getElementById('exceptionEmail');
const addException = document.getElementById('addException');
const exceptionsList = document.getElementById('exceptionsList');

// Google OAuth callback
function handleCredentialResponse(response) {
    if (!response.credential) {
        console.error('No credential received');
        return;
    }

    // Decode the JWT token to get user info
    const responsePayload = decodeJwtResponse(response.credential);
    
    state.user = {
        email: responsePayload.email,
        name: responsePayload.name,
        picture: responsePayload.picture
    };

    // Save user info to localStorage
    localStorage.setItem('user', JSON.stringify(state.user));

    updateUI();
}

// Helper function to decode JWT
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Check for existing session on page load
window.onload = function() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        updateUI();
    }
};

// UI update function
function updateUI() {
    if (state.user) {
        userSection.style.display = 'flex';
        loginSection.style.display = 'none';
        filterSection.style.display = 'block';
        userPicture.src = state.user.picture;
        userPicture.alt = state.user.name;
        
        updateFilterUI();
        updateExceptionsList();
    } else {
        userSection.style.display = 'none';
        loginSection.style.display = 'flex';
        filterSection.style.display = 'none';
    }
}

// Filter UI update
function updateFilterUI() {
    toggleFilter.className = `stop-button ${state.filterConfig.enabled ? 'enabled' : 'disabled'}`;
    toggleText.textContent = state.filterConfig.enabled ? 'ACTIF' : 'INACTIF';
    document.getElementById('filterStatus').textContent = state.filterConfig.enabled 
        ? "Le filtre est en marche, attention aucun email ne vous parviendra"
        : "Le filtre n'est pas en marche";
    autoReplyMessage.value = state.filterConfig.autoReplyMessage;
}

// Exceptions list update
function updateExceptionsList() {
    exceptionsList.innerHTML = '';
    state.filterConfig.exceptions.forEach(email => {
        const item = document.createElement('div');
        item.className = 'exception-item';
        item.innerHTML = `
            <span>${email}</span>
            <button class="remove-exception" onclick="removeException('${email}')">Supprimer</button>
        `;
        exceptionsList.appendChild(item);
    });
}

// Event Listeners
logoutButton.addEventListener('click', () => {
    state.user = null;
    localStorage.removeItem('user');
    updateUI();
});

toggleFilter.addEventListener('click', () => {
    state.filterConfig.enabled = !state.filterConfig.enabled;
    updateFilterUI();
});

updateMessage.addEventListener('click', () => {
    state.filterConfig.autoReplyMessage = autoReplyMessage.value;
});

addException.addEventListener('click', () => {
    const email = exceptionEmail.value.trim();
    if (email && !state.filterConfig.exceptions.includes(email)) {
        state.filterConfig.exceptions.push(email);
        exceptionEmail.value = '';
        updateExceptionsList();
    }
});

function removeException(email) {
    state.filterConfig.exceptions = state.filterConfig.exceptions.filter(e => e !== email);
    updateExceptionsList();
}

// Initial UI update
updateUI();
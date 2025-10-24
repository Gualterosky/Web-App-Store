// auth.js - Sistema de Autenticación para Mundo PC
// ADAPTADO para usar 'correo' en lugar de 'email'

const API_URL = "http://localhost:3000/api";

// =============================================
// UTILIDADES
// =============================================

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (successDiv) {
        successDiv.classList.remove('show');
    }
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }
}

function showSuccess(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (errorDiv) {
        errorDiv.classList.remove('show');
    }
    
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.add('show');
        
        setTimeout(() => {
            successDiv.classList.remove('show');
        }, 5000);
    }
}

function hideMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (errorDiv) errorDiv.classList.remove('show');
    if (successDiv) successDiv.classList.remove('show');
}

function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// =============================================
// GESTIÓN DE TOKENS Y AUTENTICACIÓN
// =============================================

function saveAuthData(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
}

function getAuthToken() {
    return localStorage.setItem('authToken');
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
}

function isAuthenticated() {
    return !!getAuthToken();
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    clearAuthData();
    window.location.href = 'login.html';
}

// =============================================
// MANEJO DE LOGIN
// =============================================

async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const correo = document.getElementById('loginEmail').value.trim(); // ADAPTADO
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked;
    
    // Validaciones básicas
    if (!correo || !password) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    if (!isValidEmail(correo)) {
        showError('Por favor ingresa un correo electrónico válido');
        return;
    }
    
    setLoadingState(submitBtn, true);
    hideMessages();
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, password }) // ADAPTADO
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión');
        }
        
        // Guardar datos de autenticación
        saveAuthData(data.token, data.user);
        
        showSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        
        // Redirigir después de 1 segundo
        setTimeout(() => {
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'Index.html';
            window.location.href = redirectUrl;
        }, 1000);
        
    } catch (error) {
        console.error('Error en login:', error);
        showError(error.message || 'Error al iniciar sesión. Por favor intenta de nuevo.');
    } finally {
        setLoadingState(submitBtn, false);
    }
}

// =============================================
// MANEJO DE REGISTRO
// =============================================

async function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const nombre = document.getElementById('registerName').value.trim();
    const correo = document.getElementById('registerEmail').value.trim(); // ADAPTADO
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validaciones
    if (!nombre || !correo || !password || !confirmPassword) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    if (!isValidEmail(correo)) {
        showError('Por favor ingresa un correo electrónico válido');
        return;
    }
    
    if (password.length < 8) {
        showError('La contraseña debe tener al menos 8 caracteres');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }
    
    if (!isStrongPassword(password)) {
        showError('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número');
        return;
    }
    
    setLoadingState(submitBtn, true);
    hideMessages();
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                nombre,
                correo, // ADAPTADO
                password 
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al crear la cuenta');
        }
        
        // Auto-login después del registro (el backend ya devuelve el token)
        saveAuthData(data.token, data.user);
        
        showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
        
        setTimeout(() => {
            window.location.href = 'Index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Error en registro:', error);
        showError(error.message || 'Error al crear la cuenta. Por favor intenta de nuevo.');
    } finally {
        setLoadingState(submitBtn, false);
    }
}

// =============================================
// VALIDACIONES
// =============================================

function isValidEmail(correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
}

function isStrongPassword(password) {
    // Al menos 8 caracteres, una mayúscula, una minúscula y un número
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
}

// =============================================
// FUNCIONES PARA CARRITO (con autenticación)
// =============================================

async function addToCartAPI(productId, quantity = 1) {
    const token = getAuthToken();
    
    if (!token) {
        const currentUrl = window.location.pathname;
        window.location.href = `login.html?redirect=${encodeURIComponent(currentUrl)}`;
        return null;
    }
    
    try {
        const response = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });
        
        if (response.status === 401) {
            // Token expirado o inválido
            clearAuthData();
            window.location.href = 'login.html';
            return null;
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al agregar al carrito');
        }
        
        return data;
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        throw error;
    }
}

async function getCart() {
    const token = getAuthToken();
    
    if (!token) {
        return { items: [], total: 0, count: 0 };
    }
    
    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            clearAuthData();
            return { items: [], total: 0, count: 0 };
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        return { items: [], total: 0, count: 0 };
    }
}

async function updateCartItem(itemId, quantity) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No autenticado');
    }
    
    try {
        const response = await fetch(`${API_URL}/cart/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar');
        }
        
        return data;
    } catch (error) {
        console.error('Error al actualizar item:', error);
        throw error;
    }
}

async function removeFromCart(itemId) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No autenticado');
    }
    
    try {
        const response = await fetch(`${API_URL}/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar');
        }
        
        return data;
    } catch (error) {
        console.error('Error al eliminar item:', error);
        throw error;
    }
}

async function clearCart() {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No autenticado');
    }
    
    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al vaciar carrito');
        }
        
        return data;
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        throw error;
    }
}

// =============================================
// ACTUALIZACIÓN DE UI CON INFO DE USUARIO
// =============================================

function updateUIWithUserInfo() {
    const user = getUserData();
    
    if (user) {
        // Actualizar elementos que muestren el nombre del usuario
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = user.nombre || user.correo; // ADAPTADO
        });
        
        // Mostrar/ocultar elementos según autenticación
        const authElements = document.querySelectorAll('.auth-only');
        authElements.forEach(el => {
            el.style.display = 'block';
        });
        
        const guestElements = document.querySelectorAll('.guest-only');
        guestElements.forEach(el => {
            el.style.display = 'none';
        });
    }
}

// =============================================
// INICIALIZACIÓN
// =============================================

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateUIWithUserInfo();
    
    // Verificar si hay un formulario de login/registro
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Si el usuario ya está autenticado y está en la página de login
    if (isAuthenticated() && window.location.pathname.includes('login.html')) {
        window.location.href = 'Index.html';
    }
});

// Exportar funciones para uso global
window.auth = {
    login: handleLogin,
    register: handleRegister,
    logout,
    isAuthenticated,
    requireAuth,
    getAuthToken,
    getUserData,
    addToCartAPI,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
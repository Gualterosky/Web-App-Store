// navigation.js - Sistema de navegación compartido
(function() {
    'use strict';

    // Verificar si el usuario está autenticado
    function isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    // Obtener datos del usuario
    function getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    // Actualizar UI de autenticación en el menú
    function updateAuthUI() {
        const authLink = document.getElementById('authLink');
        if (!authLink) return;

        const user = getUserData();
        
        if (isAuthenticated() && user) {
            authLink.innerHTML = `
                <a href="#" onclick="handleLogout(event)" style="color: #fff; display: flex; align-items: center; gap: 8px;">
                    <span>👤 ${user.nombre || 'Usuario'}</span>
                    <span style="opacity: 0.8;">| Cerrar Sesión</span>
                </a>
            `;
        } else {
            authLink.innerHTML = '<a href="login.html" style="color: #fff;">Iniciar Sesión</a>';
        }
    }

    // Manejar cierre de sesión
    window.handleLogout = function(event) {
        if (event) event.preventDefault();
        
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            // Redirigir según la página actual
            const currentPage = window.location.pathname;
            if (currentPage.includes('Carrito.html') || currentPage.includes('producto-detalle.html')) {
                window.location.href = 'Index.html';
            } else {
                window.location.reload();
            }
        }
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAuthUI);
    } else {
        updateAuthUI();
    }

    // Actualizar periódicamente (por si el usuario inicia sesión en otra pestaña)
    setInterval(updateAuthUI, 5000);

    // Exportar funciones globales
    window.navigationAuth = {
        isAuthenticated,
        getUserData,
        updateAuthUI
    };
})();
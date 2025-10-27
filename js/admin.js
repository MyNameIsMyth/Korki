document.addEventListener('DOMContentLoaded', function() {
    console.log('admin.js загружен');
    
    // ИСПОЛЬЗУЕМ НОВЫЕ МАРШРУТЫ БЕЗ АВТОРИЗАЦИИ
    const API_BASE = 'http://localhost:3000/api/simple-admin';
    let currentAdmin = null;
    let applications = [];
    
    const loginModal = document.getElementById('loginModal');
    const adminInterface = document.getElementById('adminInterface');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const statusFilter = document.getElementById('statusFilter');
    
    // ФИКСИРОВАННЫЕ ДАННЫЕ ДЛЯ АДМИНА
    const ADMIN_CREDENTIALS = {
        login: 'Admin',
        password: 'KorokNET'
    };
    
    // Проверяем авторизацию
    checkAdminAuth();
    
    // Обработчик авторизации
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    
    // Обработчик выхода
    logoutBtn.addEventListener('click', handleLogout);
    
    // Обработчик обновления
    refreshBtn.addEventListener('click', function() {
        loadApplications();
        loadStats();
        showNotification('Данные обновлены', 'success');
    });
    
    // Обработчик фильтра
    statusFilter.addEventListener('change', function() {
        loadApplications();
    });
    
    // Проверка авторизации администратора
    function checkAdminAuth() {
        const admin = JSON.parse(localStorage.getItem('admin') || '{}');
        const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated');
        
        if (isAdminAuthenticated && admin.id) {
            currentAdmin = admin;
            showAdminInterface();
            loadData();
        } else {
            showLoginModal();
        }
    }
    
    // Обработка входа администратора - ТОЛЬКО КЛИЕНТСКАЯ ПРОВЕРКА
    function handleAdminLogin(e) {
        e.preventDefault();
        
        const login = document.getElementById('adminLogin').value;
        const password = document.getElementById('adminPassword').value;
        
        if (!login || !password) {
            showNotification('Заполните все поля', 'error');
            return;
        }
        
        // ПРОВЕРКА ФИКСИРОВАННЫХ ДАННЫХ - БЕЗ ОБРАЩЕНИЯ К СЕРВЕРУ
        if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
            // Авторизация успешна
            const adminData = {
                id: 1,
                username: 'Admin',
                full_name: 'Администратор Системы',
                email: 'admin@koro4ki-est.ru'
            };
            
            localStorage.setItem('admin', JSON.stringify(adminData));
            localStorage.setItem('isAdminAuthenticated', 'true');
            currentAdmin = adminData;
            
            showAdminInterface();
            loadData();
            showNotification('Авторизация успешна!', 'success');
        } else {
            showNotification('Неверный логин или пароль', 'error');
        }
    }
    
    // Выход из системы
    function handleLogout() {
        localStorage.removeItem('admin');
        localStorage.removeItem('isAdminAuthenticated');
        currentAdmin = null;
        showLoginModal();
        adminLoginForm.reset();
        showNotification('Вы вышли из системы', 'success');
    }
    
    function showLoginModal() {
        loginModal.style.display = 'flex';
        adminInterface.style.display = 'none';
    }
    
    function showAdminInterface() {
        loginModal.style.display = 'none';
        adminInterface.style.display = 'block';
    }
    
    // Загрузка всех данных
    function loadData() {
        loadStats();
        loadApplications();
    }
    
    // Загрузка статистики - БЕЗ ЗАГОЛОВКОВ АВТОРИЗАЦИИ
    async function loadStats() {
        try {
            const response = await fetch(`${API_BASE}/stats`);
            
            if (!response.ok) {
                throw new Error('Ошибка загрузки статистики');
            }
            
            const stats = await response.json();
            
            // Обновляем статистику на странице
            document.getElementById('totalApplications').textContent = stats.total || 0;
            document.getElementById('newApplications').textContent = stats.pending || 0;
            document.getElementById('inProgressApplications').textContent = stats.approved || 0;
            document.getElementById('completedApplications').textContent = stats.completed || 0;
            document.getElementById('rejectedApplications').textContent = stats.rejected || 0;
            
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
            showNotification('Ошибка загрузки статистики', 'error');
        }
    }
    
    // Загрузка заявок - БЕЗ ЗАГОЛОВКОВ АВТОРИЗАЦИИ
    async function loadApplications() {
        try {
            const statusFilterValue = statusFilter.value;
            let url = `${API_BASE}/applications`;
            
            // Преобразуем статусы для бэкенда
            const statusMap = {
                'new': 'pending',
                'in_progress': 'approved',
                'completed': 'completed',
                'rejected': 'rejected'
            };
            
            if (statusFilterValue && statusFilterValue !== 'all') {
                const backendStatus = statusMap[statusFilterValue] || statusFilterValue;
                url += `?status=${backendStatus}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Ошибка загрузки заявок');
            }
            
            applications = await response.json();
            renderApplicationsTable(applications);
            
        } catch (error) {
            console.error('Ошибка загрузки заявок:', error);
            showNotification('Ошибка загрузки заявок', 'error');
        }
    }
    
    // Отрисовка таблицы заявок
    function renderApplicationsTable(applicationsList) {
        const tbody = document.getElementById('applicationsTableBody');
        const emptyState = document.getElementById('emptyState');
        
        tbody.innerHTML = '';
        
        if (applicationsList.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        applicationsList.forEach(app => {
            const row = document.createElement('tr');
            
            // Преобразуем статусы для фронтенда
            const statusMap = {
                'pending': { text: 'Новая', class: 'new' },
                'approved': { text: 'Идет обучение', class: 'in_progress' },
                'completed': { text: 'Обучение завершено', class: 'completed' },
                'rejected': { text: 'Отклонена', class: 'rejected' }
            };
            
            const statusInfo = statusMap[app.status] || { text: app.status, class: app.status };
            
            row.innerHTML = `
                <td>${app.id}</td>
                <td>
                    <strong>${app.student_name}</strong><br>
                    <small>${app.student_email}</small><br>
                    <small>${app.student_phone}</small>
                </td>
                <td>
                    <strong>${app.course_name}</strong><br>
                    <small>${app.duration_months} мес.</small>
                </td>
                <td>${formatDate(app.desired_start_date)}</td>
                <td>${getPaymentMethodText(app.payment_method)}</td>
                <td>${formatDateTime(app.created_at)}</td>
                <td>
                    <span class="status-badge status-${statusInfo.class}">
                        ${statusInfo.text}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <select class="status-select" data-application-id="${app.id}">
                            <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Новая</option>
                            <option value="approved" ${app.status === 'approved' ? 'selected' : ''}>Идет обучение</option>
                            <option value="completed" ${app.status === 'completed' ? 'selected' : ''}>Обучение завершено</option>
                            <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Отклонена</option>
                        </select>
                        <button class="button button-small button-danger" onclick="deleteApplication(${app.id})">
                            Удалить
                        </button>
                    </div>
                </td>
            `;
            
            // Добавляем обработчик изменения статуса
            const statusSelect = row.querySelector('.status-select');
            statusSelect.addEventListener('change', function() {
                updateApplicationStatus(app.id, this.value);
            });
            
            tbody.appendChild(row);
        });
    }
    
    // Обновление статуса заявки - БЕЗ ЗАГОЛОВКОВ АВТОРИЗАЦИИ
    async function updateApplicationStatus(applicationId, newStatus) {
        try {
            const response = await fetch(`${API_BASE}/applications/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    status: newStatus,
                    admin_notes: `Статус изменен администратором`
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('Статус заявки обновлен', 'success');
                loadApplications();
                loadStats(); // Обновляем статистику
            } else {
                showNotification(data.error || 'Ошибка обновления статуса', 'error');
            }
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            showNotification('Ошибка обновления статуса', 'error');
        }
    }
    
    // Удаление заявки - БЕЗ ЗАГОЛОВКОВ АВТОРИЗАЦИИ
    async function deleteApplication(applicationId) {
        if (!confirm('Вы уверены, что хотите удалить эту заявку?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/applications/${applicationId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('Заявка удалена', 'success');
                loadApplications();
                loadStats(); // Обновляем статистику
            } else {
                showNotification(data.error || 'Ошибка удаления заявки', 'error');
            }
        } catch (error) {
            console.error('Ошибка удаления заявки:', error);
            showNotification('Ошибка удаления заявки', 'error');
        }
    }
    
    // Вспомогательные функции
    function getPaymentMethodText(method) {
        const methodMap = {
            'bank_card': 'Банковская карта',
            'electronic_wallet': 'Электронный кошелек',
            'bank_transfer': 'Банковский перевод'
        };
        return methodMap[method] || method;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }
    
    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('ru-RU');
    }
    
    function showNotification(message, type) {
        // Удаляем существующие уведомления
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Стили для уведомлений
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else {
            notification.style.background = '#6b7280';
        }
        
        document.body.appendChild(notification);
        
        // Автоматически удаляем через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Глобальные функции
    window.deleteApplication = deleteApplication;
});
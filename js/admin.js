document.addEventListener('DOMContentLoaded', function() {
    console.log('admin.js загружен');
    
    // Данные для авторизации
    const ADMIN_CREDENTIALS = {
        login: 'Admins',
        password: 'KorokNET'
    };
    
    // Моковые данные заявок
    let applications = [
        {
            id: 1,
            userName: 'Иванов Иван Иванович',
            userEmail: 'ivanov@example.ru',
            userPhone: '8(999)123-45-67',
            courseName: 'Digital-маркетинг',
            startDate: '2024-01-15',
            paymentMethod: 'bank_card',
            status: 'new',
            additionalInfo: 'Хотел бы уточнить расписание занятий',
            createdAt: '2024-01-10T10:00:00'
        },
        {
            id: 2,
            userName: 'Петрова Анна Александровна',
            userEmail: 'petrova@example.ru',
            userPhone: '8(916)234-56-78',
            courseName: 'Веб-разработка',
            startDate: '2024-03-01',
            paymentMethod: 'electronic_wallet',
            status: 'in_progress',
            additionalInfo: '',
            createdAt: '2024-02-20T14:30:00'
        },
        {
            id: 3,
            userName: 'Сидоров Сергей Михайлович',
            userEmail: 'sidorov@example.ru',
            userPhone: '8(903)345-67-89',
            courseName: 'Data Science',
            startDate: '2024-04-20',
            paymentMethod: 'bank_transfer',
            status: 'completed',
            additionalInfo: 'Интересуюсь стажировкой после курса',
            createdAt: '2024-03-15T09:15:00'
        }
    ];
    
    const loginModal = document.getElementById('loginModal');
    const adminInterface = document.getElementById('adminInterface');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const statusFilter = document.getElementById('statusFilter');
    
    // Проверяем авторизацию
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAdminAuthenticated === 'true') {
        showAdminInterface();
    } else {
        showLoginModal();
    }
    
    // Обработчик авторизации
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const login = document.getElementById('adminLogin').value;
        const password = document.getElementById('adminPassword').value;
        
        if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('adminAuthenticated', 'true');
            showAdminInterface();
            showNotification('Авторизация успешна!', 'success');
        } else {
            showNotification('Неверный логин или пароль', 'error');
        }
    });
    
    // Обработчик выхода
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminAuthenticated');
        showLoginModal();
        showNotification('Вы вышли из системы', 'success');
    });
    
    // Обработчик обновления
    refreshBtn.addEventListener('click', function() {
        loadApplications();
        showNotification('Данные обновлены', 'success');
    });
    
    // Обработчик фильтра
    statusFilter.addEventListener('change', function() {
        loadApplications();
    });
    
    function showLoginModal() {
        loginModal.style.display = 'flex';
        adminInterface.style.display = 'none';
        adminLoginForm.reset();
    }
    
    function showAdminInterface() {
        loginModal.style.display = 'none';
        adminInterface.style.display = 'block';
        loadApplications();
    }
    
    function loadApplications() {
        const selectedStatus = statusFilter.value;
        let filteredApplications = applications;
        
        if (selectedStatus !== 'all') {
            filteredApplications = applications.filter(app => app.status === selectedStatus);
        }
        
        renderApplications(filteredApplications);
        updateStats();
    }
    
    function renderApplications(applicationsList) {
        const applicationsListElement = document.getElementById('applicationsList');
        
        if (applicationsList.length === 0) {
            applicationsListElement.innerHTML = `
                <div class="application-card" style="text-align: center; padding: 3rem;">
                    <h3 style="color: var(--wine-light); margin-bottom: 1rem;">Заявки не найдены</h3>
                    <p style="color: var(--wine-light);">Нет заявок, соответствующих выбранному фильтру</p>
                </div>
            `;
            return;
        }
        
        applicationsListElement.innerHTML = applicationsList.map(app => `
            <div class="application-card" data-application-id="${app.id}">
                <div class="application-header">
                    <div>
                        <h3 class="application-title">${app.courseName}</h3>
                        <div class="application-user">
                            ${app.userName} • ${app.userEmail} • ${app.userPhone}
                        </div>
                    </div>
                    <span class="application-status status-${app.status}">
                        ${getStatusText(app.status)}
                    </span>
                </div>
                
                <div class="application-details">
                    <div class="application-detail">
                        <span class="detail-label">Дата начала</span>
                        <span class="detail-value">${formatDate(app.startDate)}</span>
                    </div>
                    <div class="application-detail">
                        <span class="detail-label">Способ оплаты</span>
                        <span class="detail-value">${getPaymentMethodText(app.paymentMethod)}</span>
                    </div>
                    <div class="application-detail">
                        <span class="detail-label">Дата подачи</span>
                        <span class="detail-value">${formatDateTime(app.createdAt)}</span>
                    </div>
                </div>
                
                ${app.additionalInfo ? `
                    <div class="application-detail">
                        <span class="detail-label">Дополнительная информация</span>
                        <span class="detail-value">${app.additionalInfo}</span>
                    </div>
                ` : ''}
                
                <div class="application-actions">
                    <div class="status-buttons">
                        ${app.status !== 'in_progress' ? `
                            <button class="status-btn btn-in-progress" onclick="changeApplicationStatus(${app.id}, 'in_progress')">
                                Идет обучение
                            </button>
                        ` : ''}
                        
                        ${app.status !== 'completed' ? `
                            <button class="status-btn btn-completed" onclick="changeApplicationStatus(${app.id}, 'completed')">
                                Обучение завершено
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function updateStats() {
        const total = applications.length;
        const newApps = applications.filter(app => app.status === 'new').length;
        const inProgress = applications.filter(app => app.status === 'in_progress').length;
        const completed = applications.filter(app => app.status === 'completed').length;
        
        document.getElementById('totalApplications').textContent = total;
        document.getElementById('newApplications').textContent = newApps;
        document.getElementById('inProgressApplications').textContent = inProgress;
        document.getElementById('completedApplications').textContent = completed;
    }
    
    function getStatusText(status) {
        const statusMap = {
            'new': 'Новая',
            'in_progress': 'Идет обучение',
            'completed': 'Обучение завершено'
        };
        return statusMap[status] || status;
    }
    
    function getPaymentMethodText(method) {
        const methodMap = {
            'cash': 'Наличными',
            'phone_transfer': 'Перевод по телефону',
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
        
        document.body.appendChild(notification);
        
        // Автоматически удаляем через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Глобальная функция для изменения статуса
    window.changeApplicationStatus = function(applicationId, newStatus) {
        const applicationIndex = applications.findIndex(app => app.id === applicationId);
        
        if (applicationIndex !== -1) {
            applications[applicationIndex].status = newStatus;
            loadApplications();
            
            const statusText = getStatusText(newStatus);
            showNotification(`Статус заявки изменен на "${statusText}"`, 'success');
            
            // В реальном проекте здесь был бы fetch на сервер
            console.log(`Статус заявки ${applicationId} изменен на: ${newStatus}`);
        }
    };
});
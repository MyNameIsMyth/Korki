document.addEventListener('DOMContentLoaded', function() {
    console.log('applications.js загружен');
    
    // Проверяем авторизацию
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    console.log('Проверка авторизации:', { isAuthenticated, userData });
    
    if (!isAuthenticated || isAuthenticated !== 'true' || !userData) {
        console.log('Пользователь не авторизован, редирект на login.html');
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }

    let user;
    try {
        user = JSON.parse(userData);
        console.log('Данные пользователя:', user);
    } catch (error) {
        console.error('Ошибка парсинга user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'login.html';
        return;
    }

    // Обновляем навигацию
    updateNavigation(user);
    
    // Инициализируем приложение
    initializeApplications();
});

function updateNavigation(user) {
    console.log('Обновление навигации для пользователя:', user);
    
    const nav = document.querySelector('.nav-list');
    if (!nav) {
        console.log('Навигация не найдена');
        return;
    }

    // Убираем кнопки входа и регистрации
    const loginBtn = nav.querySelector('a[href="login.html"]');
    const registerBtn = nav.querySelector('a[href="register.html"]');
    
    if (loginBtn) {
        console.log('Удаляем кнопку входа');
        loginBtn.remove();
    }
    if (registerBtn) {
        console.log('Удаляем кнопку регистрации');
        registerBtn.remove();
    }

    // Добавляем информацию о пользователе
    const userInfo = document.createElement('li');
    userInfo.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <span style="color: var(--cream); font-weight: 500;">${user.full_name || 'Пользователь'}</span>
            <a href="create-application.html" class="nav-link">Подать заявку</a>
            <a href="#" class="nav-link nav-button" id="logoutBtn">Выйти</a>
        </div>
    `;
    nav.appendChild(userInfo);

    // Обработчик выхода
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

function logout() {
    console.log('Выход из системы');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '../index.html';
}

function initializeApplications() {
    console.log('Инициализация страницы заявок');
    
    // Моковые данные заявок
    const applications = [
        {
            id: 1,
            courseName: "Digital-маркетинг",
            startDate: "2024-01-15",
            paymentMethod: "bank_card",
            status: "completed",
            hasReview: true,
            review: {
                rating: 5,
                text: "Отличный курс! Преподаватели - профессионалы своего дела. Получил много практических знаний, которые сразу применил в работе. Особенно понравились кейсы из реальной практики и индивидуальный подход к каждому студенту.",
                date: "2024-04-20"
            },
            createdAt: "2024-01-10"
        },
        {
            id: 2,
            courseName: "Веб-разработка", 
            startDate: "2024-03-01",
            paymentMethod: "electronic_wallet",
            status: "approved",
            hasReview: false,
            createdAt: "2024-02-20"
        },
        {
            id: 3,
            courseName: "Data Science",
            startDate: "2024-04-20",
            paymentMethod: "bank_transfer",
            status: "pending",
            hasReview: false,
            createdAt: "2024-03-15"
        },
        {
            id: 4,
            courseName: "Графический дизайн",
            startDate: "2024-05-15",
            paymentMethod: "cash",
            status: "completed",
            hasReview: false,
            createdAt: "2024-04-10"
        }
    ];

    renderApplications(applications);
    setupEventListeners();
}

function renderApplications(applications) {
    const applicationsList = document.getElementById('applicationsList');
    if (!applicationsList) {
        console.error('Элемент applicationsList не найден');
        return;
    }

    if (applications.length === 0) {
        applicationsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>У вас пока нет заявок</h3>
                <p>Подайте первую заявку на обучение и начните свой путь к новым знаниям!</p>
                <a href="create-application.html" class="button button-primary">
                    📋 Подать заявку
                </a>
            </div>
        `;
        return;
    }

    applicationsList.innerHTML = applications.map(app => `
        <div class="application-card" data-application-id="${app.id}">
            <div class="application-header">
                <div class="application-info">
                    <h3 class="application-title">${app.courseName}</h3>
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
                            <span class="detail-value">${formatDate(app.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <span class="application-status status-${app.status}">
                    ${getStatusText(app.status)}
                </span>
            </div>

            ${app.hasReview ? `
                <div class="application-review">
                    <div class="review-header">
                        <div class="review-rating">${'★'.repeat(app.review.rating)}${'☆'.repeat(5 - app.review.rating)}</div>
                        <span class="review-date">${formatDate(app.review.date)}</span>
                    </div>
                    <p class="review-text">${app.review.text}</p>
                </div>
            ` : `
                <div class="no-review">
                    <p>📝 Отзыв еще не оставлен</p>
                </div>
            `}

            <div class="application-actions">
                <div class="action-buttons">
                    ${app.status === 'completed' && !app.hasReview ? 
                        `<button class="button button-primary" onclick="openReviewModal(${app.id})">
                            ✍️ Оставить отзыв
                        </button>` : 
                        ''
                    }
                    ${app.status === 'completed' && app.hasReview ? 
                        `<button class="button button-secondary" disabled>
                            ✅ Отзыв оставлен
                        </button>` : 
                        ''
                    }
                    ${app.status !== 'completed' ? 
                        `<button class="button button-secondary" disabled>
                            ⏳ Отзыв доступен после завершения
                        </button>` : 
                        ''
                    }
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'pending': '⏳ На рассмотрении',
        'approved': '✅ Одобрена', 
        'rejected': '❌ Отклонена',
        'completed': '🎓 Завершена'
    };
    return statusMap[status] || status;
}

function getPaymentMethodText(method) {
    const methodMap = {
        'cash': '💵 Наличными',
        'phone_transfer': '📱 Перевод по телефону',
        'bank_card': '💳 Банковская карта',
        'electronic_wallet': '👛 Электронный кошелек',
        'bank_transfer': '🏦 Банковский перевод'
    };
    return methodMap[method] || method;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function setupEventListeners() {
    // Обработчики для модального окна отзывов
    const modal = document.getElementById('reviewModal');
    const modalClose = document.getElementById('modalClose');
    const cancelReview = document.getElementById('cancelReview');
    const reviewForm = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.star');
    const reviewText = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeModal();
        });
    }

    if (cancelReview) {
        cancelReview.addEventListener('click', function() {
            closeModal();
        });
    }

    // Закрытие модального окна при клике вне его
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Обработчики для звезд рейтинга
    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                setRating(rating);
            });
        });
    }

    // Счетчик символов для отзыва
    if (reviewText && charCount) {
        reviewText.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 450) {
                charCount.parentElement.className = 'char-counter error';
            } else if (count > 400) {
                charCount.parentElement.className = 'char-counter warning';
            } else {
                charCount.parentElement.className = 'char-counter';
            }
        });
    }

    // Обработка отправки отзыва
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview();
        });
    }
}

let currentApplicationId = null;
let currentRating = 0;

function openReviewModal(applicationId) {
    currentApplicationId = applicationId;
    const modal = document.getElementById('reviewModal');
    const application = getApplicationById(applicationId);
    
    if (application && modal) {
        // Обновляем заголовок модального окна
        document.querySelector('.modal-header h3').textContent = `Отзыв: ${application.courseName}`;
        
        // Сбрасываем форму
        resetReviewForm();
        
        // Показываем модальное окно
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetReviewForm();
    }
}

function resetReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.star');
    const charCount = document.getElementById('charCount');
    
    if (reviewForm) {
        reviewForm.reset();
    }
    
    // Сбрасываем рейтинг
    currentRating = 0;
    stars.forEach(star => star.classList.remove('active'));
    document.getElementById('reviewRating').value = '';
    
    // Сбрасываем счетчик символов
    if (charCount) {
        charCount.textContent = '0';
        charCount.parentElement.className = 'char-counter';
    }
}

function setRating(rating) {
    const stars = document.querySelectorAll('.star');
    currentRating = rating;
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    document.getElementById('reviewRating').value = rating;
}

function getApplicationById(applicationId) {
    // В реальном приложении здесь был бы запрос к серверу
    // Для демо возвращаем null
    return null;
}

function submitReview() {
    const rating = currentRating;
    const reviewText = document.getElementById('reviewText').value.trim();
    
    if (!rating) {
        showNotification('Пожалуйста, поставьте оценку курсу', 'error');
        return;
    }
    
    if (!reviewText) {
        showNotification('Пожалуйста, напишите текст отзыва', 'error');
        return;
    }
    
    if (reviewText.length < 10) {
        showNotification('Отзыв должен содержать не менее 10 символов', 'error');
        return;
    }
    
    // В реальном проекте здесь был бы fetch на сервер
    console.log('Отправка отзыва:', {
        applicationId: currentApplicationId,
        rating: rating,
        text: reviewText
    });
    
    // Имитация успешной отправки
    showNotification('Спасибо за ваш отзыв! Он успешно сохранен.', 'success');
    
    // Закрываем модальное окно
    setTimeout(() => {
        closeModal();
        
        // Обновляем интерфейс (в реальном приложении - перезагрузка данных)
        const applications = document.querySelectorAll('.application-card');
        applications.forEach(card => {
            if (parseInt(card.dataset.applicationId) === currentApplicationId) {
                const actionsContainer = card.querySelector('.application-actions');
                if (actionsContainer) {
                    actionsContainer.innerHTML = `
                        <div class="action-buttons">
                            <button class="button button-secondary" disabled>
                                ✅ Отзыв оставлен
                            </button>
                        </div>
                    `;
                }
                
                const reviewContainer = card.querySelector('.no-review');
                if (reviewContainer) {
                    reviewContainer.outerHTML = `
                        <div class="application-review">
                            <div class="review-header">
                                <div class="review-rating">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
                                <span class="review-date">${formatDate(new Date().toISOString())}</span>
                            </div>
                            <p class="review-text">${reviewText}</p>
                        </div>
                    `;
                }
            }
        });
    }, 1500);
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
    
    // Автоматически удаляем через 4 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Глобальные функции
window.openReviewModal = openReviewModal;
window.closeModal = closeModal;
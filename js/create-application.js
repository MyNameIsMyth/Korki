document.addEventListener('DOMContentLoaded', function() {
    console.log('create-application.js загружен');
    
    // Проверяем авторизацию
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || isAuthenticated !== 'true' || !userData) {
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
    
    // Инициализируем форму
    initializeForm();
});

function updateNavigation(user) {
    const nav = document.querySelector('.nav-list');
    if (!nav) return;

    // Убираем кнопки входа и регистрации
    const loginBtn = nav.querySelector('a[href="login.html"]');
    const registerBtn = nav.querySelector('a[href="register.html"]');
    
    if (loginBtn) loginBtn.remove();
    if (registerBtn) registerBtn.remove();

    // Добавляем информацию о пользователе
    const existingUserInfo = nav.querySelector('.user-info');
    if (!existingUserInfo) {
        const userInfo = document.createElement('li');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="color: var(--cream);">${user.full_name || 'Пользователь'}</span>
                <a href="#" class="nav-link nav-button" id="logoutBtn">Выйти</a>
            </div>
        `;
        nav.appendChild(userInfo);
    }

    // Обработчик выхода
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '../index.html';
}

function initializeForm() {
    const form = document.getElementById('applicationForm');
    const startDateInput = document.getElementById('startDate');
    
    // Устанавливаем минимальную дату (текущая дата + 7 дней)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    startDateInput.min = minDate.toISOString().split('T')[0];
    
    // Обработчик отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            await submitApplication();
        }
    });
    
    // Валидация в реальном времени
    setupRealTimeValidation();
}

function setupRealTimeValidation() {
    const courseNameInput = document.getElementById('courseName');
    const startDateInput = document.getElementById('startDate');
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    
    // Валидация названия курса
    courseNameInput.addEventListener('blur', function() {
        validateCourseName();
    });
    
    // Валидация даты
    startDateInput.addEventListener('change', function() {
        validateStartDate();
    });
    
    // Валидация способа оплаты
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            validatePaymentMethod();
        });
    });
}

function validateForm() {
    const isCourseNameValid = validateCourseName();
    const isStartDateValid = validateStartDate();
    const isPaymentMethodValid = validatePaymentMethod();
    
    return isCourseNameValid && isStartDateValid && isPaymentMethodValid;
}

function validateCourseName() {
    const courseNameInput = document.getElementById('courseName');
    const errorElement = document.getElementById('courseNameError');
    const courseName = courseNameInput.value.trim();
    
    const availableCourses = [
        'Digital-маркетинг',
        'Веб-разработка', 
        'Data Science',
        'Графический дизайн',
        'Мобильная разработка'
    ];
    
    if (!courseName) {
        showError(errorElement, 'Пожалуйста, введите название курса');
        return false;
    }
    
    if (!availableCourses.includes(courseName)) {
        showError(errorElement, 'Пожалуйста, выберите курс из списка');
        return false;
    }
    
    hideError(errorElement);
    return true;
}

function validateStartDate() {
    const startDateInput = document.getElementById('startDate');
    const errorElement = document.getElementById('startDateError');
    const startDate = new Date(startDateInput.value);
    const minDate = new Date(startDateInput.min);
    
    if (!startDateInput.value) {
        showError(errorElement, 'Пожалуйста, выберите дату начала обучения');
        return false;
    }
    
    if (startDate < minDate) {
        showError(errorElement, 'Дата начала должна быть не ранее чем через 7 дней от текущей');
        return false;
    }
    
    hideError(errorElement);
    return true;
}

function validatePaymentMethod() {
    const errorElement = document.getElementById('paymentMethodError');
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!selectedPayment) {
        showError(errorElement, 'Пожалуйста, выберите способ оплаты');
        return false;
    }
    
    hideError(errorElement);
    return true;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    return false;
}

function hideError(errorElement) {
    errorElement.style.display = 'none';
    return true;
}

async function submitApplication() {
    const form = document.getElementById('applicationForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Показываем загрузку
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Собираем данные формы
        const formData = {
            courseName: document.getElementById('courseName').value.trim(),
            startDate: document.getElementById('startDate').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            additionalInfo: document.getElementById('additionalInfo').value.trim()
        };
        
        // В реальном проекте здесь был бы fetch на бэкенд
        console.log('Данные заявки:', formData);
        
        // Имитация отправки на сервер
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Показываем уведомление об успехе
        showNotification('Заявка успешно отправлена на рассмотрение!', 'success');
        
        // Очищаем форму
        form.reset();
        
        // Перенаправляем на страницу заявок через 2 секунды
        setTimeout(() => {
            window.location.href = 'applications.html';
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка отправки заявки:', error);
        showNotification('Ошибка при отправке заявки. Попробуйте еще раз.', 'error');
    } finally {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
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
    
    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Глобальная функция для кнопки "Назад"
window.goBack = function() {
    window.history.back();
};
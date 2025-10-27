console.log('Скрипт create-application.js загружен успешно');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен - create-application.js');
    
    const applicationForm = document.getElementById('applicationForm');
    const submitBtn = document.getElementById('submitBtn');
    
    console.log('Форма найдена:', !!applicationForm);
    console.log('Кнопка найдена:', !!submitBtn);

    const API_BASE = 'http://localhost:3000/api';
    let courses = [];

    // Проверяем авторизацию
    checkAuth();

    // Инициализация формы
    initForm();

    // Загружаем список курсов
    loadCourses();

    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Форма отправлена');
            await submitApplication();
        });
    }

    // Обработчик для подсчета символов
    const additionalInfo = document.getElementById('additionalInfo');
    if (additionalInfo) {
        additionalInfo.addEventListener('input', function() {
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = this.value.length;
            }
        });
    }

    // Обработчик выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (!isAuthenticated || !user.id) {
            alert('Для подачи заявки необходимо авторизоваться');
            window.location.href = 'login.html';
            return;
        }
        console.log('Пользователь авторизован:', user);
    }

    async function loadCourses() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('Загружаем курсы для пользователя:', user);
            
            const response = await fetch(`${API_BASE}/courses`, {
                headers: {
                    'x-user-id': user.id,
                    'x-user-login': user.login
                }
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка загрузки курсов: ${response.status}`);
            }

            courses = await response.json();
            console.log('Курсы загружены:', courses);
            updateCoursesList();
            
        } catch (error) {
            console.error('Ошибка загрузки курсов:', error);
            showError('Не удалось загрузить список курсов');
        }
    }

    function updateCoursesList() {
        const datalist = document.getElementById('coursesList');
        const courseNameInput = document.getElementById('courseName');
        
        if (!datalist || !courseNameInput) {
            console.error('Элементы формы не найдены');
            return;
        }
        
        // Очищаем список
        datalist.innerHTML = '';
        
        // Добавляем курсы в datalist
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.name;
            option.setAttribute('data-id', course.id);
            datalist.appendChild(option);
        });

        // Обработчик изменения курса
        courseNameInput.addEventListener('change', function() {
            const selectedCourse = courses.find(course => course.name === this.value);
            if (selectedCourse) {
                this.setAttribute('data-course-id', selectedCourse.id);
            }
        });
    }

    function initForm() {
        const startDateInput = document.getElementById('startDate');
        const todayDateElement = document.getElementById('todayDate');
        const minDateInfoElement = document.getElementById('minDateInfo');
        
        if (!startDateInput) return;
        
        // Устанавливаем минимальную дату (сегодня)
        const today = new Date().toISOString().split('T')[0];
        startDateInput.min = today;
        
        if (todayDateElement) {
            todayDateElement.textContent = `Сегодня: ${formatDate(today)}`;
        }
        
        if (minDateInfoElement) {
            minDateInfoElement.textContent = `Можно выбрать с ${formatDate(today)}`;
        }
    }

    async function submitApplication() {
        const courseNameInput = document.getElementById('courseName');
        const startDateInput = document.getElementById('startDate');
        const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
        const submitBtn = document.getElementById('submitBtn');
        
        // Проверяем существование элементов
        if (!courseNameInput || !startDateInput || !submitBtn) {
            showError('Ошибка формы');
            return false;
        }
        
        // Валидация
        if (!courseNameInput.value) {
            showError('Выберите курс из списка');
            return false;
        }

        // Находим выбранный курс
        const selectedCourse = courses.find(course => course.name === courseNameInput.value);
        if (!selectedCourse) {
            showError('Выберите курс из списка');
            return false;
        }

        const courseId = selectedCourse.id;

        if (!startDateInput.value) {
            showError('Выберите дату начала обучения');
            return false;
        }

        if (!paymentMethodInput) {
            showError('Выберите способ оплаты');
            return false;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const applicationData = {
            course_id: courseId,
            desired_start_date: startDateInput.value,
            payment_method: paymentMethodInput.value
        };

        try {
            // Блокируем кнопку отправки
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            const response = await fetch(`${API_BASE}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.id,
                    'x-user-login': user.login
                },
                body: JSON.stringify(applicationData)
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Заявка успешно отправлена!');
                setTimeout(() => {
                    window.location.href = 'applications.html';
                }, 2000);
            } else {
                showError(data.error || 'Ошибка при отправке заявки');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showError('Ошибка соединения с сервером');
        } finally {
            // Восстанавливаем кнопку
            submitBtn.textContent = 'Отправить заявку';
            submitBtn.disabled = false;
        }

        return true;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    function showError(message) {
        alert('Ошибка: ' + message);
    }

    function showSuccess(message) {
        alert('Успех: ' + message);
    }

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '../index.html';
    }
});

function goBack() {
    window.history.back();
}
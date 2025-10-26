document.addEventListener('DOMContentLoaded', function() {
    // Моковые данные заявок (в реальном проекте получались бы с сервера)
    const applications = [
        {
            id: 1,
            courseName: "Digital-маркетинг",
            startDate: "15.01.2024",
            paymentMethod: "Банковская карта",
            status: "completed",
            hasReview: true,
            review: {
                rating: 5,
                text: "Отличный курс! Преподаватели - профессионалы своего дела. Получил много практических знаний."
            }
        },
        {
            id: 2,
            courseName: "Веб-разработка",
            startDate: "01.03.2024",
            paymentMethod: "Электронный кошелек",
            status: "approved",
            hasReview: false
        },
        {
            id: 3,
            courseName: "Data Science",
            startDate: "20.04.2024",
            paymentMethod: "Банковский перевод",
            status: "pending",
            hasReview: false
        },
        {
            id: 4,
            courseName: "Графический дизайн",
            startDate: "10.02.2024",
            paymentMethod: "Банковская карта",
            status: "rejected",
            hasReview: false
        }
    ];

    const applicationsList = document.getElementById('applicationsList');
    const reviewModal = document.getElementById('reviewModal');
    const modalClose = document.getElementById('modalClose');
    const cancelReview = document.getElementById('cancelReview');
    const reviewForm = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.star');
    const reviewRating = document.getElementById('reviewRating');
    const logoutBtn = document.getElementById('logoutBtn');

    let currentApplicationId = null;

    // Функция для отображения статуса
    function getStatusText(status) {
        const statusMap = {
            'pending': 'На рассмотрении',
            'approved': 'Одобрена',
            'rejected': 'Отклонена',
            'completed': 'Завершена'
        };
        return statusMap[status] || status;
    }

    // Функция для отображения заявок
    function renderApplications() {
        applicationsList.innerHTML = '';
        
        applications.forEach(app => {
            const appCard = document.createElement('div');
            appCard.className = 'application-card';
            
            appCard.innerHTML = `
                <div class="application-header">
                    <div>
                        <h3 class="application-title">${app.courseName}</h3>
                        <div class="application-details">
                            <div class="application-detail">
                                <span class="detail-label">Дата начала:</span>
                                <span class="detail-value">${app.startDate}</span>
                            </div>
                            <div class="application-detail">
                                <span class="detail-label">Способ оплаты:</span>
                                <span class="detail-value">${app.paymentMethod}</span>
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
                        </div>
                        <p class="review-text">${app.review.text}</p>
                    </div>
                ` : ''}
                <div class="application-actions">
                    ${app.status === 'completed' && !app.hasReview ? 
                        `<button class="button button-primary" onclick="openReviewModal(${app.id})">Оставить отзыв</button>` : 
                        ''
                    }
                    ${app.status === 'completed' && app.hasReview ? 
                        `<button class="button button-secondary" disabled>Отзыв оставлен</button>` : 
                        ''
                    }
                    ${app.status !== 'completed' ? 
                        `<button class="button button-secondary" disabled>Отзыв доступен после завершения</button>` : 
                        ''
                    }
                </div>
            `;
            
            applicationsList.appendChild(appCard);
        });
    }

    // Функция для открытия модального окна отзыва
    window.openReviewModal = function(applicationId) {
        currentApplicationId = applicationId;
        const application = applications.find(app => app.id === applicationId);
        
        if (application) {
            document.querySelector('.modal-header h3').textContent = `Оставить отзыв: ${application.courseName}`;
            reviewModal.style.display = 'block';
            resetReviewForm();
        }
    };

    // Функция для сброса формы отзыва
    function resetReviewForm() {
        reviewForm.reset();
        reviewRating.value = '';
        stars.forEach(star => star.classList.remove('active'));
    }

    // Обработчики для звезд рейтинга
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            reviewRating.value = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Закрытие модального окна
    modalClose.addEventListener('click', function() {
        reviewModal.style.display = 'none';
    });

    cancelReview.addEventListener('click', function() {
        reviewModal.style.display = 'none';
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === reviewModal) {
            reviewModal.style.display = 'none';
        }
    });

    // Обработка отправки отзыва
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rating = parseInt(reviewRating.value);
        const reviewText = document.getElementById('reviewText').value.trim();
        
        if (!rating) {
            alert('Пожалуйста, поставьте оценку курсу');
            return;
        }
        
        if (!reviewText) {
            alert('Пожалуйста, напишите текст отзыва');
            return;
        }
        
        // В реальном проекте здесь был бы fetch на сервер
        const applicationIndex = applications.findIndex(app => app.id === currentApplicationId);
        if (applicationIndex !== -1) {
            applications[applicationIndex].hasReview = true;
            applications[applicationIndex].review = {
                rating: rating,
                text: reviewText
            };
            
            console.log('Отзыв отправлен:', {
                applicationId: currentApplicationId,
                rating: rating,
                text: reviewText
            });
            
            alert('Спасибо за ваш отзыв!');
            reviewModal.style.display = 'none';
            renderApplications(); // Перерисовываем список
        }
    });

    // Выход из системы
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Вы уверены, что хотите выйти?')) {
            alert('В реальном проекте здесь был бы выход из системы');
            // window.location.href = '../index.html';
        }
    });

    // Инициализация
    renderApplications();
});
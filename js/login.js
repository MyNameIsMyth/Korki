// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('loginForm');
//     const loginInput = document.getElementById('login');
//     const passwordInput = document.getElementById('password');
    
//     // Функция для показа ошибок
//     function showError(input, message) {
//         const errorElement = document.getElementById(input.id + 'Error');
//         errorElement.textContent = message;
//         errorElement.style.display = 'block';
//         input.style.borderColor = '#E53E3E';
//     }
    
//     // Функция для скрытия ошибок
//     function hideError(input) {
//         const errorElement = document.getElementById(input.id + 'Error');
//         errorElement.style.display = 'none';
//         input.style.borderColor = '#38A169';
//     }
    
//     // Валидация в реальном времени
//     loginInput.addEventListener('input', function() {
//         if (this.checkValidity()) {
//             hideError(this);
//         }
//     });
    
//     passwordInput.addEventListener('input', function() {
//         if (this.checkValidity()) {
//             hideError(this);
//         }
//     });
    
//     // Валидация при потере фокуса
//     loginInput.addEventListener('blur', function() {
//         if (!this.checkValidity()) {
//             if (this.validity.patternMismatch) {
//                 showError(this, 'Логин должен содержать только латинские буквы и цифры');
//             } else if (this.validity.tooShort) {
//                 showError(this, 'Логин должен быть не менее 6 символов');
//             } else {
//                 showError(this, 'Пожалуйста, введите логин');
//             }
//         }
//     });
    
//     passwordInput.addEventListener('blur', function() {
//         if (!this.checkValidity()) {
//             if (this.validity.tooShort) {
//                 showError(this, 'Пароль должен быть не менее 8 символов');
//             } else {
//                 showError(this, 'Пожалуйста, введите пароль');
//             }
//         }
//     });
    
//     // Обработка отправки формы
//     form.addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         let isValid = true;
        
//         // Проверяем логин
//         if (!loginInput.checkValidity()) {
//             if (loginInput.validity.patternMismatch) {
//                 showError(loginInput, 'Логин должен содержать только латинские буквы и цифры');
//             } else if (loginInput.validity.tooShort) {
//                 showError(loginInput, 'Логин должен быть не менее 6 символов');
//             } else {
//                 showError(loginInput, 'Пожалуйста, введите логин');
//             }
//             isValid = false;
//         }
        
//         // Проверяем пароль
//         if (!passwordInput.checkValidity()) {
//             if (passwordInput.validity.tooShort) {
//                 showError(passwordInput, 'Пароль должен быть не менее 8 символов');
//             } else {
//                 showError(passwordInput, 'Пожалуйста, введите пароль');
//             }
//             isValid = false;
//         }
        
//         if (isValid) {
//             // В реальном проекте здесь был бы fetch на сервер
//             const loginData = {
//                 login: loginInput.value,
//                 password: passwordInput.value
//             };
            
//             console.log('Данные для авторизации:', loginData);
            
//             // Имитация успешной авторизации
//             alert('Авторизация успешна! В реальном проекте здесь был бы переход в личный кабинет.');
            
//             // Очищаем форму
//             form.reset();
            
//             // Сбрасываем стили полей
//             loginInput.style.borderColor = '#E5E5E5';
//             passwordInput.style.borderColor = '#E5E5E5';
//         }
//     });
// });
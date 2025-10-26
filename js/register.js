// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('registerForm');
//     const inputs = form.querySelectorAll('input');
    
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
//     inputs.forEach(input => {
//         input.addEventListener('input', function() {
//             if (this.checkValidity()) {
//                 hideError(this);
//             }
//         });
        
//         input.addEventListener('blur', function() {
//             if (!this.checkValidity()) {
//                 showError(this, this.validationMessage);
//             }
//         });
//     });
    
//     // Обработка отправки формы
//     form.addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         let isValid = true;
        
//         // Проверяем все поля
//         inputs.forEach(input => {
//             if (!input.checkValidity()) {
//                 showError(input, input.validationMessage);
//                 isValid = false;
//             }
//         });
        
//         if (isValid) {
//             // Собираем данные формы
//             const formData = {
//                 login: document.getElementById('login').value,
//                 password: document.getElementById('password').value,
//                 fullname: document.getElementById('fullname').value,
//                 phone: document.getElementById('phone').value,
//                 email: document.getElementById('email').value
//             };
            
//             // В реальном проекте здесь был бы fetch на сервер
//             console.log('Данные для регистрации:', formData);
//             alert('Регистрация успешна! В реальном проекте данные были бы отправлены на сервер.');
            
//             // Очищаем форму
//             form.reset();
            
//             // Сбрасываем стили полей
//             inputs.forEach(input => {
//                 input.style.borderColor = '#E5E5E5';
//             });
//         }
//     });
// });
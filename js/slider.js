document.addEventListener('DOMContentLoaded', function() {
    class Slider {
        constructor() {
            this.slides = document.querySelectorAll('.slide');
            this.dots = document.querySelectorAll('.dot');
            this.prevBtn = document.querySelector('.slider-prev');
            this.nextBtn = document.querySelector('.slider-next');
            this.currentSlide = 0;
            this.slideInterval = null;
            this.autoPlayDelay = 5000; // 5 секунд
            
            this.init();
        }
        
        init() {
            // Инициализация событий
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Добавляем обработчики для точек
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Автопрокрутка
            this.startAutoPlay();
            
            // Пауза при наведении
            this.addHoverPause();
            
            // Обработка клавиатуры
            this.addKeyboardNavigation();
        }
        
        showSlide(index) {
            // Скрываем все слайды
            this.slides.forEach(slide => slide.classList.remove('active'));
            this.dots.forEach(dot => dot.classList.remove('active'));
            
            // Показываем выбранный слайд
            this.slides[index].classList.add('active');
            this.dots[index].classList.add('active');
            
            this.currentSlide = index;
        }
        
        nextSlide() {
            let nextIndex = this.currentSlide + 1;
            if (nextIndex >= this.slides.length) {
                nextIndex = 0;
            }
            this.showSlide(nextIndex);
            this.restartAutoPlay();
        }
        
        prevSlide() {
            let prevIndex = this.currentSlide - 1;
            if (prevIndex < 0) {
                prevIndex = this.slides.length - 1;
            }
            this.showSlide(prevIndex);
            this.restartAutoPlay();
        }
        
        goToSlide(index) {
            this.showSlide(index);
            this.restartAutoPlay();
        }
        
        startAutoPlay() {
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        }
        
        stopAutoPlay() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
                this.slideInterval = null;
            }
        }
        
        restartAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
        
        addHoverPause() {
            const slider = document.querySelector('.slider-container');
            
            slider.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });
            
            slider.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
            
            // Для мобильных устройств - пауза при касании
            slider.addEventListener('touchstart', () => {
                this.stopAutoPlay();
            });
            
            slider.addEventListener('touchend', () => {
                setTimeout(() => this.startAutoPlay(), 3000);
            });
        }
        
        addKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            });
        }
    }
    
    // Инициализация слайдера
    new Slider();
    
    // Дополнительные улучшения
    function enhanceSliderAccessibility() {
        const slides = document.querySelectorAll('.slide');
        
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Слайд ${index + 1} из ${slides.length}`);
            slide.setAttribute('aria-hidden', index !== 0 ? 'true' : 'false');
        });
        
        // Обновляем aria-hidden при смене слайдов
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    const isActive = target.classList.contains('active');
                    target.setAttribute('aria-hidden', !isActive);
                }
            });
        });
        
        slides.forEach(slide => {
            observer.observe(slide, { attributes: true });
        });
    }
    
    enhanceSliderAccessibility();
    
    // Ленивая загрузка изображений (если будут реальные изображения)
    function lazyLoadImages() {
        const images = document.querySelectorAll('.slide-image img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
    
    lazyLoadImages();
});
/**
 * Modern Project Slider with smooth transitions and controls
 */

class ProjectSlider {
  constructor(options) {
    // Default configuration
    this.config = {
      containerId: 'projects-slider-container',
      sliderId: 'projects-slider',
      slideClass: 'project-slide',
      autoplay: true,
      autoplaySpeed: 5000, // ms
      pauseOnHover: true,
      transitionSpeed: 500, // ms
      showDots: true,
      showArrows: true,
      ...options
    };
    
    // State
    this.currentSlide = 0;
    this.slideCount = 0;
    this.autoplayTimer = null;
    this.isTransitioning = false;
    
    // DOM Elements
    this.container = document.getElementById(this.config.containerId);
    this.slider = document.getElementById(this.config.sliderId);
    this.slides = this.slider ? Array.from(this.slider.querySelectorAll(`.${this.config.slideClass}`)) : [];
    this.slideCount = this.slides.length;
    
    // Only initialize if we have slides
    if (this.slideCount > 0) {
      this.init();
    }
  }
  
  init() {
    // Set up initial state
    this.setupSlider();
    
    // Add navigation if needed
    if (this.config.showArrows) {
      this.addArrowNavigation();
    }
    
    if (this.config.showDots) {
      this.addDotNavigation();
    }
    
    // Start autoplay if enabled
    if (this.config.autoplay) {
      this.startAutoplay();
      
      if (this.config.pauseOnHover) {
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
      }
    }
    
    // Handle window resize
    window.addEventListener('resize', () => this.goToSlide(this.currentSlide));
    
    // Initial slide positioning
    setTimeout(() => this.goToSlide(0), 100);
  }
  
  setupSlider() {
    // Make sure slides are properly sized
    this.slides.forEach(slide => {
      slide.style.minWidth = '100%';
    });
  }
  
  addArrowNavigation() {
    // Create navigation container
    const navElement = document.createElement('div');
    navElement.className = 'slider-nav';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-arrow prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.prevSlide();
    });
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-arrow next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.nextSlide();
    });
    
    // Add to DOM
    navElement.appendChild(prevBtn);
    navElement.appendChild(nextBtn);
    this.container.appendChild(navElement);
  }
  
  addDotNavigation() {
    // Create dots container
    const dotsElement = document.createElement('div');
    dotsElement.className = 'slider-dots';
    
    // Create a dot for each slide
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsElement.appendChild(dot);
    });
    
    // Add to DOM after the slider container
    this.container.parentNode.insertBefore(dotsElement, this.container.nextSibling);
    this.dots = Array.from(dotsElement.querySelectorAll('.slider-dot'));
  }
  
  updateDots() {
    if (!this.config.showDots || !this.dots) return;
    
    this.dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  startAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
    
    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, this.config.autoplaySpeed);
  }
  
  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
  
  nextSlide() {
    if (this.isTransitioning) return;
    this.goToSlide((this.currentSlide + 1) % this.slideCount);
  }
  
  prevSlide() {
    if (this.isTransitioning) return;
    this.goToSlide((this.currentSlide - 1 + this.slideCount) % this.slideCount);
  }
  
  goToSlide(index) {
    if (this.isTransitioning || index === this.currentSlide) return;
    
    this.isTransitioning = true;
    this.currentSlide = index;
    
    // Calculate the translation amount
    const slideWidth = this.container.clientWidth;
    const translateX = -index * slideWidth;
    
    // Apply the transition
    this.slider.style.transition = `transform ${this.config.transitionSpeed}ms ease-in-out`;
    this.slider.style.transform = `translateX(${translateX}px)`;
    
    // Update dots
    this.updateDots();
    
    // Reset autoplay if enabled
    if (this.config.autoplay && this.autoplayTimer) {
      this.pauseAutoplay();
      this.startAutoplay();
    }
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, this.config.transitionSpeed);
  }
}

// Initialize the slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on pages with the projects section
  if (document.getElementById('projects')) {
    const projectSlider = new ProjectSlider({
      containerId: 'projects-slider-container',
      sliderId: 'projects-slider',
      slideClass: 'project-slide',
      autoplay: true,
      autoplaySpeed: 6000,
      pauseOnHover: true,
      showDots: true,
      showArrows: true
    });
  }
  
  // Fix for potential script.js error
  // This will override any existing showSlide function that might be causing errors
  window.showSlide = function(i) {
    // Empty implementation to prevent errors
    console.log('Old carousel function called but disabled');
    return;
  };
});
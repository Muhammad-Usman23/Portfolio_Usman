/**
 * Responsive image handling
 * Improves performance by loading appropriate image sizes based on device
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if the browser supports IntersectionObserver
  if ('IntersectionObserver' in window) {
    // Create a new IntersectionObserver instance
    const imageObserver = new IntersectionObserver((entries, observer) => {
      // Loop through the entries
      entries.forEach(entry => {
        // If the image is in the viewport
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // If the image has a data-src attribute
          if (img.dataset.src) {
            // Set the src attribute to load the image
            img.src = img.dataset.src;
            
            // Remove the data-src attribute
            img.removeAttribute('data-src');
            
            // Add a loaded class for potential animations
            img.classList.add('loaded');
          }
          
          // Stop observing the image
          observer.unobserve(img);
        }
      });
    }, {
      // Options
      rootMargin: '50px 0px', // Start loading images when they're 50px from entering the viewport
      threshold: 0.1 // Trigger when at least 10% of the image is visible
    });
    
    // Get all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // Observe each image
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // Simple scroll event to load images
    function lazyLoad() {
      lazyImages.forEach(img => {
        if (img.getBoundingClientRect().top <= window.innerHeight && 
            img.getBoundingClientRect().bottom >= 0 && 
            getComputedStyle(img).display !== 'none') {
          
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
        }
      });
      
      // If all images are loaded, remove the scroll event listener
      if (lazyImages.length === 0) {
        window.removeEventListener('scroll', lazyLoad);
        window.removeEventListener('resize', lazyLoad);
        window.removeEventListener('orientationchange', lazyLoad);
      }
    }
    
    // Add event listeners
    window.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationchange', lazyLoad);
    
    // Initial load
    lazyLoad();
  }
  
  // Handle responsive background images
  function updateBackgroundImages() {
    const bgElements = document.querySelectorAll('[data-bg]');
    
    bgElements.forEach(el => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      
      let bgUrl;
      
      if (isMobile && el.dataset.bgMobile) {
        bgUrl = el.dataset.bgMobile;
      } else if (isTablet && el.dataset.bgTablet) {
        bgUrl = el.dataset.bgTablet;
      } else {
        bgUrl = el.dataset.bg;
      }
      
      el.style.backgroundImage = `url(${bgUrl})`;
    });
  }
  
  // Initial update
  updateBackgroundImages();
  
  // Update on resize
  window.addEventListener('resize', updateBackgroundImages);
});
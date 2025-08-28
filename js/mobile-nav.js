/**
 * Mobile navigation functionality
 * Handles the mobile menu toggle and navigation behavior
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const navToggle = document.createElement('button');
  
  // Create mobile nav toggle button
  navToggle.className = 'nav-toggle';
  navToggle.setAttribute('aria-label', 'Toggle navigation menu');
  navToggle.innerHTML = `
    <span class="nav-toggle-bar"></span>
    <span class="nav-toggle-bar"></span>
    <span class="nav-toggle-bar"></span>
  `;
  
  // Add toggle button to header
  header.appendChild(navToggle);
  
  // Toggle navigation when button is clicked
  navToggle.addEventListener('click', function() {
    nav.classList.toggle('open');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Update ARIA attributes for accessibility
    const isExpanded = nav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isExpanded);
  });
  
  // Close mobile menu when clicking on navigation links
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // If window width is greater than 768px, close mobile menu
      if (window.innerWidth > 768 && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }, 250);
  });
});
// animations.js - Floating icons and cursor effects

// Configuration
const FLOATING_ICONS = [
  { icon: '⚛️', size: 24 }, // React
  { icon: '🔷', size: 20 }, // TypeScript
  { icon: '🟨', size: 22 }, // JavaScript
  { icon: '🚀', size: 26 }, // Performance
  { icon: '🎨', size: 24 }, // Design
  { icon: '⚙️', size: 22 }, // Automation
  { icon: '📱', size: 24 }, // Mobile
  { icon: '🤖', size: 20 }, // AI
  { icon: '<>', size: 20, isText: true }, // Code
  { icon: '{ }', size: 22, isText: true }, // JSON
  { icon: '</>', size: 24, isText: true }, // HTML
  { icon: '🌐', size: 26 }, // Web
];

const BUBBLE_CONFIG = {
  count: 15,
  size: { min: 4, max: 10 },
  duration: { min: 600, max: 1500 },
  opacity: { min: 0.2, max: 0.6 },
};

// DOM Elements
let floatingContainer;
let bubbleContainer;

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on the landing page (hero section exists)
  if (document.getElementById('hero')) {
    initFloatingIcons();
    initBubblingCursor();
  }
});

// Create floating icons container and start animation
function initFloatingIcons() {
  // Create container for floating icons
  floatingContainer = document.createElement('div');
  floatingContainer.className = 'floating-icons-container';
  document.getElementById('hero').appendChild(floatingContainer);

  // Create each floating icon
  FLOATING_ICONS.forEach((iconConfig, index) => {
    createFloatingIcon(iconConfig, index);
  });
}

// Create a single floating icon with random position and animation
function createFloatingIcon(iconConfig, index) {
  const icon = document.createElement(iconConfig.isText ? 'span' : 'div');
  icon.className = 'floating-icon';
  icon.textContent = iconConfig.icon;
  icon.style.fontSize = `${iconConfig.size}px`;
  
  // Random initial position
  const xPos = Math.random() * 100; // percentage across screen
  const yPos = Math.random() * 100; // percentage down screen
  icon.style.left = `${xPos}%`;
  icon.style.top = `${yPos}%`;
  
  // Random animation duration and delay
  const duration = 15 + Math.random() * 20; // 15-35 seconds
  const delay = index * 0.5; // stagger start times
  icon.style.animationDuration = `${duration}s`;
  icon.style.animationDelay = `${delay}s`;
  
  // Add to container
  floatingContainer.appendChild(icon);
}

// Initialize bubbling cursor effect
function initBubblingCursor() {
  // Create container for bubbles
  bubbleContainer = document.createElement('div');
  bubbleContainer.className = 'bubble-container';
  document.body.appendChild(bubbleContainer);
  
  // Track mouse movement
  let lastX = 0;
  let lastY = 0;
  let throttleTimer;
  
  document.addEventListener('mousemove', (e) => {
    // Throttle bubble creation for performance
    if (!throttleTimer) {
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        
        // Only create bubbles if mouse has moved significantly
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          createBubble(e.clientX, e.clientY);
          lastX = e.clientX;
          lastY = e.clientY;
        }
      }, 50); // Throttle to max 20 bubbles per second
    }
  });
}

// Create a single bubble at cursor position
function createBubble(x, y) {
  // Limit total bubbles for performance
  if (bubbleContainer.children.length > BUBBLE_CONFIG.count) {
    // Remove oldest bubble if we're at the limit
    bubbleContainer.removeChild(bubbleContainer.children[0]);
  }
  
  const bubble = document.createElement('div');
  bubble.className = 'cursor-bubble';
  
  // Random size
  const size = BUBBLE_CONFIG.size.min + 
    Math.random() * (BUBBLE_CONFIG.size.max - BUBBLE_CONFIG.size.min);
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  
  // Position at cursor
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;
  
  // Random opacity
  const opacity = BUBBLE_CONFIG.opacity.min + 
    Math.random() * (BUBBLE_CONFIG.opacity.max - BUBBLE_CONFIG.opacity.min);
  bubble.style.opacity = opacity;
  
  // Random animation duration
  const duration = BUBBLE_CONFIG.duration.min + 
    Math.random() * (BUBBLE_CONFIG.duration.max - BUBBLE_CONFIG.duration.min);
  bubble.style.animationDuration = `${duration}ms`;
  
  // Add to container
  bubbleContainer.appendChild(bubble);
  
  // Remove bubble after animation completes
  setTimeout(() => {
    if (bubble.parentNode === bubbleContainer) {
      bubbleContainer.removeChild(bubble);
    }
  }, duration);
}
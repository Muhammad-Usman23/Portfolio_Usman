// Small interactive behaviors: reveal on scroll, contact form
// Note: Mobile nav toggle is now handled in mobile-nav.js

// Reveal on scroll
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target;
      // if element has data-delay, apply CSS variable for stagger
      const delay = el.dataset.delay ? Number(el.dataset.delay) : 0;
      el.style.setProperty('--delay-ms', `${delay}ms`);
      el.classList.add('in-view');
      observer.unobserve(el);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.animate').forEach((el,i)=>{
  // if no explicit delay, stagger slightly
  if(!el.dataset.delay) el.dataset.delay = i*80;
  observer.observe(el);
});

// Projects carousel - Removed as we're using the new slider implementation
// The old carousel code has been removed to prevent conflicts

// Define empty showSlide function to prevent errors
window.showSlide = function(n) {
  console.log('Old showSlide function called, but has been replaced with new slider implementation');
  return false;
};

// Contact form integration
const FORM_ENDPOINT = ''; // <--- Set your Formspree endpoint here (e.g. https://formspree.io/f/yourid)
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
if(contactForm){
  contactForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    // Basic validation
    const nameV = contactForm.querySelector('#name');
    const emailV = contactForm.querySelector('#email');
    const msgV = contactForm.querySelector('#message');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!nameV.value.trim() || !emailV.value.trim() || !msgV.value.trim()){
      formMsg.textContent = 'Please fill in all fields.';
      return;
    }
    if(!emailPattern.test(emailV.value.trim())){
      formMsg.textContent = 'Please enter a valid email address.';
      return;
    }

    const data = new FormData(contactForm);

    if(FORM_ENDPOINT){
      try{
        const res = await fetch(FORM_ENDPOINT, {method:'POST', body:data, headers:{'Accept':'application/json'}});
        if(res.ok){
          formMsg.textContent = 'Thanks — your message was sent.';
          contactForm.reset();
        } else {
          formMsg.textContent = 'There was an error sending the form. Please try again later.';
        }
      }catch(err){
        formMsg.textContent = 'Network error. Please try again later.';
      }
    } else {
      // Fallback: open user's email client with prefilled content
      const name = data.get('name');
      const email = data.get('email');
      const message = data.get('message');
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
  window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;
    }
  });
}

// Clear form helper
const clearBtn = document.getElementById('clearForm');
if(clearBtn){
  clearBtn.addEventListener('click', ()=>{
    contactForm.reset();
    formMsg.textContent = '';
  });
}

// Footer year
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = "2021";
}

// Smooth internal link offset (if header sticky)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.length>1){
      const el = document.querySelector(href);
      if(el){
        // Adjust offset based on screen size
        const isMobile = window.innerWidth <= 768;
        const headerOffset = isMobile ? 70 : 80; // Smaller offset on mobile
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({top:y, behavior:'smooth'});
      }
    }
  });
});

// Typing roles animation
const rolesEl = document.getElementById('roles');
if(rolesEl){
  const roles = rolesEl.dataset.roles.split(',').map(s=>s.trim());
  let rIdx = 0, charIdx = 0, forward = true;
  function tick(){
    const cur = roles[rIdx];
    if(forward){
      charIdx++;
      if(charIdx > cur.length){ forward = false; setTimeout(tick, 900); return; }
    } else {
      charIdx--;
      if(charIdx < 0){ forward = true; rIdx = (rIdx+1)%roles.length; setTimeout(tick, 300); return; }
    }
    rolesEl.textContent = cur.slice(0,charIdx);
    setTimeout(tick, forward ? 80 : 40);
  }
  tick();
}

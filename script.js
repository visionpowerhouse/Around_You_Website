// Mobile menu with improved UX
function toggleMenu(){
  const navlinks = document.getElementById('navlinks');
  const menuBtn = document.querySelector('.menu');
  navlinks.classList.toggle('open');
  
  // Update button text
  if(navlinks.classList.contains('open')){
    menuBtn.textContent = '✕';
    menuBtn.setAttribute('aria-expanded', 'true');
    // Close menu when clicking outside
    document.addEventListener('click', closeMenuOnOutsideClick);
    // Close menu on Escape key
    document.addEventListener('keydown', closeMenuOnEscape);
  } else {
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', closeMenuOnOutsideClick);
    document.removeEventListener('keydown', closeMenuOnEscape);
  }
}

function closeMenuOnOutsideClick(e){
  const navlinks = document.getElementById('navlinks');
  const menuBtn = document.querySelector('.menu');
  if(!navlinks.contains(e.target) && !menuBtn.contains(e.target)){
    navlinks.classList.remove('open');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', closeMenuOnOutsideClick);
    document.removeEventListener('keydown', closeMenuOnEscape);
  }
}

function closeMenuOnEscape(e){
  if(e.key === 'Escape'){
    const navlinks = document.getElementById('navlinks');
    const menuBtn = document.querySelector('.menu');
    navlinks.classList.remove('open');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
    document.removeEventListener('click', closeMenuOnOutsideClick);
    document.removeEventListener('keydown', closeMenuOnEscape);
  }
}

// Watch Preview button handler - just scrolls to video
document.getElementById('watchPreviewBtn').addEventListener('click', function(e){
  e.preventDefault();
  const phoneFrame = document.getElementById('phoneFrame');
  
  // Scroll to phone frame smoothly
  phoneFrame.scrollIntoView({behavior:'smooth', block:'center'});
});

// Smooth scroll for on‑page anchors
document.addEventListener('click', function(e){
  const a = e.target.closest('a[href^="#"]');
  if(!a || a.id === 'watchPreviewBtn') return;
  const id = a.getAttribute('href');
  if(id.length > 1){
    const el = document.querySelector(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', id);
    }
  }
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth ticker auto-scroll - infinite carousel with no gaps
(function(){
  const ticker = document.getElementById('ticker');
  if(!ticker) return;
  const tickerContent = document.getElementById('tickerContent');
  if(!tickerContent) return;
  
  // Wait for DOM to be ready
  setTimeout(() => {
    const originalItems = Array.from(tickerContent.children);
    if(originalItems.length === 0) return;
    
    // Calculate dimensions
    const itemHeight = originalItems[0].offsetHeight || 48;
    const tickerHeight = ticker.offsetHeight;
    const visibleCount = Math.ceil(tickerHeight / itemHeight) || 3;
    
    // Ensure we have enough items to fill visible area + buffer
    const totalNeeded = visibleCount + 2;
    const repeatTimes = Math.ceil(totalNeeded / originalItems.length) + 1;
    
    // Clone items to create seamless loop
    for(let i = 0; i < repeatTimes; i++){
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        tickerContent.appendChild(clone);
      });
    }
    
    let currentIndex = 0;
    const totalOriginalItems = originalItems.length;
    
    // Set transition style
    tickerContent.style.transition = 'transform 0.6s ease-in-out';
    
    function scrollNext(){
      currentIndex++;
      const translateY = currentIndex * itemHeight;
      
      // When we've scrolled through all original items, reset seamlessly
      if(currentIndex >= totalOriginalItems){
        currentIndex = 0;
        // Temporarily disable transition for instant reset
        tickerContent.style.transition = 'none';
        tickerContent.style.transform = 'translateY(0)';
        
        // Re-enable transition after reset
        requestAnimationFrame(() => {
          setTimeout(() => {
            tickerContent.style.transition = 'transform 0.6s ease-in-out';
          }, 50);
        });
      } else {
        tickerContent.style.transform = `translateY(-${translateY}px)`;
      }
    }
    
    // Start auto-scrolling
    setInterval(scrollNext, 2500);
  }, 200);
})();

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e)=>{
    if(e.isIntersecting){
      e.target.animate([
        {opacity:0, transform:'translateY(18px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:500, easing:'ease-out', fill:'forwards'});
      io.unobserve(e.target);
    }
  })
}, {threshold:.12});
document.querySelectorAll('section .card, section h2, .feature').forEach(el=>io.observe(el));

// Scroll Progress Indicator
(function(){
  const progressBar = document.getElementById('scrollProgress');
  if(!progressBar) return;
  
  function updateProgress(){
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = scrollTop / (documentHeight - windowHeight);
    progressBar.style.transform = `scaleX(${Math.min(scrollPercent, 1)})`;
  }
  
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();
})();

// Back to Top Button
(function(){
  const backToTop = document.getElementById('backToTop');
  if(!backToTop) return;
  
  function toggleButton(){
    if(window.pageYOffset > 300){
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  }
  
  backToTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });
  
  window.addEventListener('scroll', toggleButton, {passive:true});
  toggleButton();
})();

// Lazy Load Video
(function(){
  const videoPlaceholder = document.getElementById('videoPlaceholder');
  const videoIframe = document.getElementById('videoIframe');
  
  if(!videoPlaceholder || !videoIframe) return;
  
  videoPlaceholder.addEventListener('click', function(){
    const src = videoIframe.getAttribute('data-src');
    if(src){
      videoIframe.src = src;
      videoPlaceholder.style.display = 'none';
      videoIframe.style.display = 'block';
    }
  });
})();

// Form Validation and Submission
(function(){
  // Google Sheets Web App URL - Replace with your Apps Script deployment URL
  // Get this URL after setting up Google Apps Script (see GOOGLE_SHEETS_SETUP.md)
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxqqBbhU1ZfMMatG8RmNaQP-B2eGtfaU9yfUJGkO7SfI-eH4Fw9GrP1urTYCXxadCXj/exec';
  
  const form = document.getElementById('joinForm');
  if(!form) return;
  
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const typeSelect = document.getElementById('userType');
  const cityInput = document.getElementById('userCity');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  
  function showError(field, message){
    const errorEl = document.getElementById(field + 'Error');
    if(errorEl) errorEl.textContent = message;
  }
  
  function clearErrors(){
    ['name', 'email', 'type'].forEach(field => {
      const errorEl = document.getElementById(field + 'Error');
      if(errorEl) errorEl.textContent = '';
    });
  }
  
  function validateForm(){
    let isValid = true;
    clearErrors();
    
    if(!nameInput.value.trim()){
      showError('name', 'Name is required');
      isValid = false;
    }
    
    if(!emailInput.value.trim()){
      showError('email', 'Email is required');
      isValid = false;
    } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)){
      showError('email', 'Please enter a valid email');
      isValid = false;
    }
    
    if(!typeSelect.value){
      showError('type', 'Please select your type');
      isValid = false;
    }
    
    return isValid;
  }
  
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    
    if(!validateForm()) return;
    
    // Check if Google Sheets URL is configured
    if(!GOOGLE_SHEETS_WEB_APP_URL || GOOGLE_SHEETS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'){
      // Fallback to localStorage if Google Sheets not configured
      console.warn('Google Sheets URL not configured. Using localStorage as fallback.');
      const submissions = JSON.parse(localStorage.getItem('waitlistSubmissions') || '[]');
      submissions.push({
        name: nameInput.value,
        email: emailInput.value,
        type: typeSelect.value,
        city: cityInput.value,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('waitlistSubmissions', JSON.stringify(submissions));
      
      form.style.display = 'none';
      successMessage.style.display = 'flex';
      successMessage.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    try {
      // Send data to Google Sheets via Apps Script
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        type: typeSelect.value,
        city: cityInput.value.trim() || 'Not provided',
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      // Note: With no-cors mode, we can't read the response
      // But if the request completes without error, assume success
      
      // Also store in localStorage as backup
      const submissions = JSON.parse(localStorage.getItem('waitlistSubmissions') || '[]');
      submissions.push(formData);
      localStorage.setItem('waitlistSubmissions', JSON.stringify(submissions));
      
      // Success
      form.style.display = 'none';
      successMessage.style.display = 'flex';
      
      // Reset form
      form.reset();
      
      // Scroll to success message
      successMessage.scrollIntoView({behavior:'smooth', block:'center'});
      
    } catch(error){
      // Error - try localStorage as fallback
      console.error('Error submitting to Google Sheets:', error);
      
      try {
        const submissions = JSON.parse(localStorage.getItem('waitlistSubmissions') || '[]');
        submissions.push({
          name: nameInput.value,
          email: emailInput.value,
          type: typeSelect.value,
          city: cityInput.value,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('waitlistSubmissions', JSON.stringify(submissions));
        
        // Show success even if Google Sheets failed (localStorage backup worked)
        form.style.display = 'none';
        successMessage.style.display = 'flex';
        successMessage.scrollIntoView({behavior:'smooth', block:'center'});
      } catch(backupError){
        // Both failed
        errorText.textContent = 'Unable to submit. Please check your connection and try again.';
        errorMessage.style.display = 'flex';
        form.style.display = 'block';
      }
    } finally {
      // Reset button
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    }
  });
  
  // Real-time validation
  nameInput.addEventListener('blur', function(){
    if(!this.value.trim()) showError('name', 'Name is required');
    else clearErrors();
  });
  
  emailInput.addEventListener('blur', function(){
    if(!this.value.trim()){
      showError('email', 'Email is required');
    } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)){
      showError('email', 'Please enter a valid email');
    } else {
      clearErrors();
    }
  });
  
  typeSelect.addEventListener('change', function(){
    if(this.value) clearErrors();
  });
})();

// Social Sharing
(function(){
  const shareButtons = document.querySelectorAll('.share-btn');
  if(shareButtons.length === 0) return;
  
  // Website URL for social sharing
  const websiteUrl = 'https://visionpowerhouse.github.io/Around_You/';
  const url = encodeURIComponent(websiteUrl);
  const title = encodeURIComponent(document.title);
  const text = encodeURIComponent('Check out Around You — Your 10 km, live. Anywhere in India.');
  
  shareButtons.forEach(btn => {
    btn.addEventListener('click', function(){
      const platform = this.getAttribute('data-platform');
      let shareUrl = '';
      
      switch(platform){
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
          window.open(shareUrl, '_blank', 'width=550,height=420');
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          window.open(shareUrl, '_blank', 'width=550,height=420');
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${text}%20${url}`;
          window.open(shareUrl, '_blank');
          break;
        case 'copy':
          navigator.clipboard.writeText(websiteUrl).then(() => {
            const originalText = this.textContent;
            this.textContent = '✓ Copied!';
            setTimeout(() => {
              this.textContent = originalText;
            }, 2000);
          }).catch(() => {
            alert('Failed to copy link. Please copy manually: ' + websiteUrl);
          });
          break;
      }
    });
  });
})();


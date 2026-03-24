/**
 * SÖRB & MER - Main JavaScript
 * Premium Furniture Design & Execution
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeader();
  initHeroSlider();
  initMobileNav();
  initScrollReveal();
  initSmoothScroll();
  initFilters();
  initGalleryLightbox();
});

/**
 * Header - Scroll behavior
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/**
 * Hero Slider
 */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  let slideInterval;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    
    if (dots.length > 0) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
    
    currentSlide = index;
  }
  
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }
  
  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoplay() {
    clearInterval(slideInterval);
  }
  
  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      showSlide(index);
      startAutoplay();
    });
  });
  
  // Start autoplay
  startAutoplay();
}

/**
 * Mobile Navigation
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (!menuToggle || !nav) return;
  
  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });
  
  // Close nav when clicking on a link
  const navLinks = nav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove('nav-open');
    });
  });
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length === 0) return;
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Filter functionality for Projects/Gallery
 */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-filter]');
  
  if (filterBtns.length === 0 || filterItems.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter items
      filterItems.forEach(item => {
        const itemFilter = item.dataset.filter;
        
        if (filter === 'all' || itemFilter === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

/**
 * Gallery Lightbox
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.masonry-item, .gallery-item');
  
  if (galleryItems.length === 0) return;
  
  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <button class="lightbox-close">&times;</button>
    <button class="lightbox-prev">&#8249;</button>
    <button class="lightbox-next">&#8250;</button>
    <div class="lightbox-content">
      <img src="" alt="">
    </div>
  `;
  
  // Add lightbox styles
  const lightboxStyles = document.createElement('style');
  lightboxStyles.textContent = `
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .lightbox.active {
      display: flex;
    }
    .lightbox-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.95);
    }
    .lightbox-content {
      position: relative;
      z-index: 1;
      max-width: 90vw;
      max-height: 90vh;
    }
    .lightbox-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    }
    .lightbox-close,
    .lightbox-prev,
    .lightbox-next {
      position: absolute;
      z-index: 2;
      background: none;
      border: none;
      color: white;
      font-size: 40px;
      cursor: pointer;
      padding: 10px;
      line-height: 1;
      transition: opacity 0.3s;
    }
    .lightbox-close:hover,
    .lightbox-prev:hover,
    .lightbox-next:hover {
      opacity: 0.7;
    }
    .lightbox-close {
      top: 20px;
      right: 20px;
    }
    .lightbox-prev {
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .lightbox-next {
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  `;
  
  document.head.appendChild(lightboxStyles);
  document.body.appendChild(lightbox);
  
  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return img ? img.src : '';
  }).filter(src => src);
  
  function openLightbox(index) {
    currentIndex = index;
    const img = lightbox.querySelector('img');
    img.src = images[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightbox.querySelector('img').src = images[currentIndex];
  }
  
  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightbox.querySelector('img').src = images[currentIndex];
  }
  
  // Event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
  lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

/**
 * Counter Animation for Stats
 */
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  
  updateCounter();
}

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = parseInt(counter.dataset.target, 10);
      if (target) {
        animateCounter(counter, target);
        counterObserver.unobserve(counter);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
  counterObserver.observe(counter);
});

/**
 * Parallax Effect for Hero
 */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const scrolled = window.pageYOffset;
  const parallaxElements = hero.querySelectorAll('.hero-slide img');
  
  parallaxElements.forEach(el => {
    el.style.transform = `translateY(${scrolled * 0.3}px)`;
  });
}, { passive: true });

/**
 * Lazy Loading Images
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
        }
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

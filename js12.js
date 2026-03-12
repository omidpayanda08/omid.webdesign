 // Default configuration
    const defaultConfig = {
      hero_title: "Business to Web Bridge",
      hero_subtitle: "Web Developer & Digital Strategist",
      about_name: "Alex Chen",
      about_bio: "Transforming business visions into digital reality"
    };
    
    // Initialize Element SDK
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
          // Update hero section
          const heroTitle = document.getElementById('hero-title');
          const heroSubtitle = document.getElementById('hero-subtitle');
          const aboutNameDisplay = document.getElementById('about-name-display');
          const aboutBioDisplay = document.getElementById('about-bio-display');
          const aboutNameCode = document.getElementById('about-name-code');
          const aboutBioCode = document.getElementById('about-bio-code');
          
          if (heroTitle) heroTitle.textContent = config.hero_title || defaultConfig.hero_title;
          if (heroSubtitle) heroSubtitle.textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
          if (aboutNameDisplay) aboutNameDisplay.textContent = config.about_name || defaultConfig.about_name;
          if (aboutBioDisplay) aboutBioDisplay.textContent = config.about_bio || defaultConfig.about_bio;
          if (aboutNameCode) aboutNameCode.textContent = `"${config.about_name || defaultConfig.about_name}"`;
          if (aboutBioCode) aboutBioCode.textContent = config.about_bio || defaultConfig.about_bio;
        },
        mapToCapabilities: (config) => ({
          recolorables: [],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
          ["hero_title", config.hero_title || defaultConfig.hero_title],
          ["hero_subtitle", config.hero_subtitle || defaultConfig.hero_subtitle],
          ["about_name", config.about_name || defaultConfig.about_name],
          ["about_bio", config.about_bio || defaultConfig.about_bio]
        ])
      });
    }
    
    // Calculator functionality
    let calcValue = '0';
    let calcOperator = null;
    let calcPrevValue = null;
    let calcNewNumber = true;
    
    function updateCalcDisplay() {
      document.getElementById('calc-display').textContent = calcValue;
    }
    
    function calcInput(val) {
      if ('0123456789'.includes(val)) {
        if (calcNewNumber) {
          calcValue = val;
          calcNewNumber = false;
        } else {
          calcValue = calcValue === '0' ? val : calcValue + val;
        }
      } else if (val === '.') {
        if (!calcValue.includes('.')) {
          calcValue += '.';
          calcNewNumber = false;
        }
      } else if ('+-×÷'.includes(val)) {
        if (calcOperator && !calcNewNumber) {
          calcEquals();
        }
        calcPrevValue = calcValue;
        calcOperator = val;
        calcNewNumber = true;
        document.getElementById('calc-history').textContent = `${calcPrevValue} ${calcOperator}`;
      } else if (val === '±') {
        calcValue = String(-parseFloat(calcValue));
      } else if (val === '%') {
        calcValue = String(parseFloat(calcValue) / 100);
      }
      updateCalcDisplay();
    }
    
    function calcEquals() {
      if (calcOperator && calcPrevValue !== null) {
        const prev = parseFloat(calcPrevValue);
        const current = parseFloat(calcValue);
        let result;
        switch (calcOperator) {
          case '+': result = prev + current; break;
          case '-': result = prev - current; break;
          case '×': result = prev * current; break;
          case '÷': result = current !== 0 ? prev / current : 'Error'; break;
        }
        document.getElementById('calc-history').textContent = `${calcPrevValue} ${calcOperator} ${calcValue} =`;
        calcValue = String(result);
        calcOperator = null;
        calcPrevValue = null;
        calcNewNumber = true;
        updateCalcDisplay();
      }
    }
    
    function calcClear() {
      calcValue = '0';
      calcOperator = null;
      calcPrevValue = null;
      calcNewNumber = true;
      document.getElementById('calc-history').textContent = '';
      updateCalcDisplay();
    }
    
    // Memory Game
    const gameEmojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯'];
    let gameCards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let gameMoves = 0;
    let gameScore = 0;
    let canFlip = true;
    
    function initGame() {
      const allEmojis = [...gameEmojis, ...gameEmojis];
      gameCards = allEmojis.sort(() => Math.random() - 0.5);
      flippedCards = [];
      matchedPairs = 0;
      gameMoves = 0;
      gameScore = 0;
      canFlip = true;
      
      document.getElementById('game-score').textContent = gameScore;
      document.getElementById('game-moves').textContent = gameMoves;
      
      const board = document.getElementById('game-board');
      board.innerHTML = '';
      
      gameCards.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'aspect-square glass rounded-lg text-xl flex items-center justify-center transition-all duration-300 hover:bg-purple-400/20';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.onclick = () => flipCard(card);
        board.appendChild(card);
      });
    }
    
    function flipCard(card) {
      if (!canFlip || card.dataset.flipped === 'true' || flippedCards.length >= 2) return;
      
      card.textContent = card.dataset.emoji;
      card.dataset.flipped = 'true';
      card.classList.add('bg-purple-400/30');
      flippedCards.push(card);
      
      if (flippedCards.length === 2) {
        gameMoves++;
        document.getElementById('game-moves').textContent = gameMoves;
        canFlip = false;
        
        if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
          matchedPairs++;
          gameScore += 10;
          document.getElementById('game-score').textContent = gameScore;
          flippedCards = [];
          canFlip = true;
          
          if (matchedPairs === gameEmojis.length) {
            setTimeout(() => {
              const bonus = Math.max(0, 100 - gameMoves * 2);
              gameScore += bonus;
              document.getElementById('game-score').textContent = gameScore;
            }, 500);
          }
        } else {
          setTimeout(() => {
            flippedCards.forEach(c => {
              c.textContent = '?';
              c.dataset.flipped = 'false';
              c.classList.remove('bg-purple-400/30');
            });
            flippedCards = [];
            canFlip = true;
          }, 1000);
        }
      }
    }
    
    // Hotel Feedback
    let feedbackRating = 1;
    
    function setRating(rating) {
      feedbackRating = rating;
      const stars = document.querySelectorAll('#star-rating button');
      stars.forEach((star, index) => {
        star.classList.toggle('opacity-30', index >= rating);
      });
    }
    
    function submitFeedback(event) {
      event.preventDefault();
      const form = document.getElementById('feedback-form');
      const success = document.getElementById('feedback-success');
      form.classList.add('hidden');
      success.classList.remove('hidden');
      
      setTimeout(() => {
        form.classList.remove('hidden');
        success.classList.add('hidden');
        form.reset();
        setRating(1);
      }, 3000);
    }
    
    // Particle Animation
    function initParticles() {
      const canvas = document.getElementById('particle-canvas');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const particles = [];
      const particleCount = 30;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 3 + 1,
          color: `hsl(${180 + Math.random() * 60}, 100%, 60%)`
        });
      }
      
      function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          // Draw connections
          particles.forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 80) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(0, 245, 255, ${0.3 - dist / 300})`;
              ctx.stroke();
            }
          });
        });
        
        requestAnimationFrame(animate);
      }
      
      animate();
    }
    
    // Bar Chart Animation
    function animateBarChart() {
      const bars = document.querySelectorAll('#bar-chart > div');
      setInterval(() => {
        bars.forEach(bar => {
          const newHeight = 30 + Math.random() * 60;
          bar.style.height = `${newHeight}%`;
        });
      }, 2000);
    }
    
    // 3D Cube Animation
    function animateCube() {
      const cube = document.getElementById('cube-3d');
      if (!cube) return;
      
      let rotX = 0;
      let rotY = 0;
      
      function rotate() {
        rotX += 0.5;
        rotY += 0.8;
        cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        requestAnimationFrame(rotate);
      }
      
      rotate();
    }
    
    // AI Bars Animation
    function animateAIBars() {
      const bars = ['ai-bar-1', 'ai-bar-2', 'ai-bar-3'];
      setInterval(() => {
        bars.forEach(id => {
          const bar = document.getElementById(id);
          if (bar) {
            const width = 20 + Math.random() * 80;
            bar.style.width = `${width}%`;
          }
        });
      }, 1500);
    }
    
    // Initialize all animations
    initGame();
    initParticles();
    animateBarChart();
    animateCube();
    animateAIBars();
    
    // Smooth scroll for navigation
   
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});
  //form js
document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const button = document.getElementById("submit-btn");

form.addEventListener("submit", async function(e) {

e.preventDefault();

button.innerText = "Sending...";
button.disabled = true;

const data = new FormData(form);

const response = await fetch("https://api.web3forms.com/submit", {
method: "POST",
body: data
});

const result = await response.json();

status.classList.remove("hidden");

if(result.success){
status.innerText = "✅ Message sent successfully!";
form.reset();
button.innerText = "Send Message";
button.disabled = false;
}else{
status.innerText = "❌ Something went wrong.";
}

});

});
//مینی آپ ها


 const appData = {
      userPanel: {
        user: {
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          avatar: '👤',
          membership: 'Premium',
          joinDate: '2023/06/15',
          wallet: 5250000
        }
      },
      reservation: {
        services: [
          { id: 1, name: 'Online Consultation', duration: '30 min', price: 150000 },
          { id: 2, name: 'In-Person Session', duration: '1 hour', price: 300000 },
          { id: 3, name: 'Premium Package', duration: '2 hours', price: 500000 }
        ],
        selectedService: null,
        selectedDate: null,
        selectedTime: null
      },
      cart: {
        items: [
          { id: 1, name: 'Digital Product A', price: 250000, quantity: 1, image: '📱' },
          { id: 2, name: 'Monthly Subscription', price: 99000, quantity: 1, image: '⭐' },
          { id: 3, name: 'Learning Bundle', price: 450000, quantity: 2, image: '📚' }
        ]
      },
      projectForm: { submitted: false, formData: {} },
      serviceOrder: {
        services: [
          { id: 1, name: 'Logo Design', price: 500000, icon: '🎨' },
          { id: 2, name: 'Website Design', price: 3000000, icon: '💻' },
          { id: 3, name: 'SEO Optimization', price: 1500000, icon: '📈' },
          { id: 4, name: 'Content Creation', price: 800000, icon: '✍️' },
          { id: 5, name: 'Social Media Management', price: 1200000, icon: '📱' }
        ],
        selectedServices: [],
        orderStep: 1
      }
    };

    function formatPrice(price) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 1000).replace('.00', 'K');
    }

    function openModal(appId) {
      const container = document.getElementById('modalContainer');
      const body = document.getElementById('modalBody');
      body.innerHTML = getAppContent(appId);
      container.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      const container = document.getElementById('modalContainer');
      container.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }

    function getAppContent(appId) {
      switch(appId) {
        case 'userPanel': return getUserPanelContent();
        case 'reservation': return getReservationContent();
        case 'cart': return getCartContent();
        case 'projectForm': return getProjectFormContent();
        case 'serviceOrder': return getServiceOrderContent();
        default: return '';
      }
    }

    function getUserPanelContent() {
      const user = appData.userPanel.user;
      return `
        <div class="text-center mb-6">
          <div class="text-7xl mb-4">${user.avatar}</div>
          <h2 class="text-2xl font-bold">${user.name}</h2>
          <span class="status-badge bg-yellow-500/20 text-yellow-400 mt-2 inline-block">${user.membership} Member</span>
        </div>
        <div class="space-y-4">
          <div class="glass rounded-xl p-4 flex justify-between items-center">
            <span class="text-gray-400">📧 Email</span>
            <span class="font-medium">${user.email}</span>
          </div>
          <div class="glass rounded-xl p-4 flex justify-between items-center">
            <span class="text-gray-400">📱 Phone</span>
            <span class="font-medium">${user.phone}</span>
          </div>
          <div class="glass rounded-xl p-4 flex justify-between items-center">
            <span class="text-gray-400">📅 Member Since</span>
            <span class="font-medium">${user.joinDate}</span>
          </div>
          <div class="glass rounded-xl p-4 flex justify-between items-center">
            <span class="text-gray-400">💰 Wallet Balance</span>
            <span class="font-bold text-green-400">${formatPrice(user.wallet)}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-6">
          <button class="btn-primary text-white py-3 rounded-xl font-medium">Edit Profile</button>
          <button class="btn-secondary text-white py-3 rounded-xl font-medium">Add Funds</button>
        </div>
      `;
    }

    function getReservationContent() {
      const { services } = appData.reservation;
      return `
        <h2 class="text-2xl font-bold mb-6 text-center">📅 Book a Service</h2>
        <div class="space-y-3 mb-6">
          <label class="block text-gray-400 text-sm mb-2">Select Service</label>
          ${services.map(s => `
            <div class="glass rounded-xl p-4 cursor-pointer hover:bg-white/10 transition reservation-service" 
                 onclick="selectService(${s.id})" data-id="${s.id}">
              <div class="flex justify-between items-center">
                <div>
                  <h4 class="font-bold">${s.name}</h4>
                  <span class="text-gray-400 text-sm">Duration: ${s.duration}</span>
                </div>
                <span class="text-green-400 font-bold">${formatPrice(s.price)}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-gray-400 text-sm mb-2">Date</label>
            <input type="date" id="reserveDate" class="input-field w-full rounded-xl p-3">
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">Time</label>
            <select id="reserveTime" class="input-field w-full rounded-xl p-3">
              <option value="">Select Time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
            </select>
          </div>
        </div>
        <button onclick="submitReservation()" class="btn-success w-full text-white py-4 rounded-xl font-bold text-lg">Confirm Reservation ✓</button>
      `;
    }

    let selectedServiceId = null;
    function selectService(id) {
      selectedServiceId = id;
      document.querySelectorAll('.reservation-service').forEach(el => el.classList.remove('ring-2', 'ring-purple-500'));
      document.querySelector(`[data-id="${id}"]`).classList.add('ring-2', 'ring-purple-500');
    }

    function submitReservation() {
      const date = document.getElementById('reserveDate')?.value;
      const time = document.getElementById('reserveTime')?.value;
      if (!selectedServiceId || !date || !time) {
        showToast('Please select all options', 'error');
        return;
      }
      showToast('Reservation confirmed! ✓', 'success');
      setTimeout(closeModal, 1500);
    }

    function getCartContent() {
      const { items } = appData.cart;
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return `
        <h2 class="text-2xl font-bold mb-6 text-center">🛒 Shopping Cart</h2>
        <div id="cartItems" class="space-y-4 mb-6">
          ${items.map(item => `
            <div class="glass rounded-xl p-4 cart-item" data-id="${item.id}">
              <div class="flex items-center gap-4">
                <div class="text-4xl">${item.image}</div>
                <div class="flex-1">
                  <h4 class="font-bold">${item.name}</h4>
                  <span class="text-green-400">${formatPrice(item.price)}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="updateQuantity(${item.id}, -1)" class="counter-btn bg-red-500/20 text-red-400">−</button>
                  <span class="w-8 text-center font-bold quantity-display">${item.quantity}</span>
                  <button onclick="updateQuantity(${item.id}, 1)" class="counter-btn bg-green-500/20 text-green-400">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-300 text-xl">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="glass rounded-xl p-4 mb-6">
          <div class="flex justify-between items-center text-lg">
            <span>Total:</span>
            <span id="cartTotal" class="font-bold text-2xl text-green-400">${formatPrice(total)}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <button onclick="closeModal()" class="glass text-white py-3 rounded-xl font-medium hover:bg-white/10">Continue Shopping</button>
          <button onclick="checkout()" class="btn-success text-white py-3 rounded-xl font-bold">Checkout 💳</button>
        </div>
      `;
    }

    function updateQuantity(id, delta) {
      const item = appData.cart.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        const cartItem = document.querySelector(`.cart-item[data-id="${id}"]`);
        cartItem.querySelector('.quantity-display').textContent = item.quantity;
        updateCartTotal();
      }
    }

    function removeFromCart(id) {
      appData.cart.items = appData.cart.items.filter(i => i.id !== id);
      document.getElementById('modalBody').innerHTML = getCartContent();
      showToast('Item removed from cart', 'info');
    }

    function updateCartTotal() {
      const total = appData.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      document.getElementById('cartTotal').textContent = formatPrice(total);
    }

    function checkout() {
      if (appData.cart.items.length === 0) {
        showToast('Cart is empty', 'error');
        return;
      }
      showToast('Processing payment...', 'success');
    }

    function getProjectFormContent() {
      if (appData.projectForm.submitted) {
        return `
          <div class="text-center py-10">
            <div class="text-7xl mb-4">✅</div>
            <h2 class="text-2xl font-bold mb-2">Request Submitted!</h2>
            <p class="text-gray-400">Our team will contact you soon.</p>
            <button onclick="resetProjectForm()" class="btn-primary text-white py-3 px-8 rounded-xl mt-6">Submit Another</button>
          </div>
        `;
      }
      return `
        <h2 class="text-2xl font-bold mb-6 text-center">📝 Project Request</h2>
        <form id="projectFormEl" onsubmit="submitProjectForm(event)" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Full Name *</label>
              <input type="text" name="fullName" required class="input-field w-full rounded-xl p-3">
            </div>
            <div>
              <label class="block text-gray-400 text-sm mb-2">Phone *</label>
              <input type="tel" name="phone" required class="input-field w-full rounded-xl p-3">
            </div>
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">Email</label>
            <input type="email" name="email" class="input-field w-full rounded-xl p-3">
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">Project Type *</label>
            <select name="projectType" required class="input-field w-full rounded-xl p-3">
              <option value="">Select Type</option>
              <option value="website">Website Design</option>
              <option value="app">Mobile App</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="branding">Branding</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">Description *</label>
            <textarea name="description" required rows="4" class="input-field w-full rounded-xl p-3 resize-none"></textarea>
          </div>
          <button type="submit" class="btn-primary w-full text-white py-4 rounded-xl font-bold text-lg">Submit Request 📤</button>
        </form>
      `;
    }

    function submitProjectForm(e) {
      e.preventDefault();
      appData.projectForm.submitted = true;
      document.getElementById('modalBody').innerHTML = getProjectFormContent();
      showToast('Project request submitted!', 'success');
    }

    function resetProjectForm() {
      appData.projectForm.submitted = false;
      document.getElementById('modalBody').innerHTML = getProjectFormContent();
    }

    function getServiceOrderContent() {
      const { services, selectedServices, orderStep } = appData.serviceOrder;
      const total = services.filter(s => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
      
      if (orderStep === 2) {
        return `
          <h2 class="text-2xl font-bold mb-6 text-center">🔧 Confirm Order</h2>
          <div class="space-y-3 mb-6">
            ${services.filter(s => selectedServices.includes(s.id)).map(s => `
              <div class="glass rounded-xl p-4 flex justify-between items-center">
                <span>${s.icon} ${s.name}</span>
                <span class="text-green-400">${formatPrice(s.price)}</span>
              </div>
            `).join('')}
          </div>
          <div class="glass rounded-xl p-4 mb-6">
            <div class="flex justify-between items-center text-xl">
              <span>Total:</span>
              <span class="font-bold text-green-400">${formatPrice(total)}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button onclick="backToServiceSelection()" class="glass text-white py-3 rounded-xl font-medium hover:bg-white/10">Back</button>
            <button onclick="confirmServiceOrder()" class="btn-success text-white py-3 rounded-xl font-bold">Confirm ✓</button>
          </div>
        `;
      }
      
      return `
        <h2 class="text-2xl font-bold mb-6 text-center">🔧 Order Services</h2>
        <p class="text-gray-400 text-center mb-6">Select the services you need</p>
        <div class="space-y-3 mb-6">
          ${services.map(s => `
            <div class="glass rounded-xl p-4 cursor-pointer hover:bg-white/10 transition service-item ${selectedServices.includes(s.id) ? 'ring-2 ring-purple-500 bg-purple-500/10' : ''}" 
                 onclick="toggleService(${s.id})" data-id="${s.id}">
              <div class="flex items-center gap-4">
                <div class="text-3xl">${s.icon}</div>
                <div class="flex-1">
                  <h4 class="font-bold">${s.name}</h4>
                  <span class="text-green-400">${formatPrice(s.price)}</span>
                </div>
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedServices.includes(s.id) ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}">
                  ${selectedServices.includes(s.id) ? '✓' : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="glass rounded-xl p-4 mb-6">
          <div class="flex justify-between items-center">
            <span>Selected: <strong>${selectedServices.length}</strong></span>
            <span class="font-bold text-green-400">${formatPrice(total)}</span>
          </div>
        </div>
        <button onclick="proceedToConfirm()" 
                class="btn-primary w-full text-white py-4 rounded-xl font-bold text-lg ${selectedServices.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                ${selectedServices.length === 0 ? 'disabled' : ''}>
          Proceed to Confirm →
        </button>
      `;
    }

    function toggleService(id) {
      const idx = appData.serviceOrder.selectedServices.indexOf(id);
      if (idx === -1) {
        appData.serviceOrder.selectedServices.push(id);
      } else {
        appData.serviceOrder.selectedServices.splice(idx, 1);
      }
      document.getElementById('modalBody').innerHTML = getServiceOrderContent();
    }

    function proceedToConfirm() {
      if (appData.serviceOrder.selectedServices.length === 0) return;
      appData.serviceOrder.orderStep = 2;
      document.getElementById('modalBody').innerHTML = getServiceOrderContent();
    }

    function backToServiceSelection() {
      appData.serviceOrder.orderStep = 1;
      document.getElementById('modalBody').innerHTML = getServiceOrderContent();
    }

    function confirmServiceOrder() {
      showToast('Order confirmed! ✓', 'success');
      appData.serviceOrder.selectedServices = [];
      appData.serviceOrder.orderStep = 1;
      setTimeout(closeModal, 1500);
    }

    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
      };
      toast.className = `fixed bottom-6 left-1/2 transform -translate-x-1/2 ${colors[type]} text-white px-6 py-3 rounded-full shadow-lg z-[100]`;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
 




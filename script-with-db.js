// Trading Platform JavaScript with Database Integration

// Global variables
let currentSection = 'dashboard';
let currentUser = null;
let currentAdmin = null;
let portfolioData = {
    totalValue: 0,
    todayPnl: 0,
    availableCash: 0,
    winRate: 0
};

let marketData = {};
let videos = [];
let videoCategories = [];

// API Base URL
const API_BASE = '/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkUserAuth();
    setupMobileMenu();
    setupVideoModal();
});

// Check if user is authenticated
async function checkUserAuth() {
    const savedUser = localStorage.getItem('tradingUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
        await loadUserData();
    } else {
        showLoginModal();
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Welcome to Trading Platform</h2>
            <div class="auth-tabs">
                <button class="tab-btn active" onclick="showAuthTab('login')">Login</button>
                <button class="tab-btn" onclick="showAuthTab('register')">Register</button>
            </div>
            <div id="login-form" class="auth-form">
                <input type="email" id="login-email" placeholder="Email" required>
                <input type="password" id="login-password" placeholder="Password" required>
                <button onclick="handleLogin()">Login</button>
            </div>
            <div id="register-form" class="auth-form" style="display: none;">
                <input type="text" id="register-name" placeholder="Full Name" required>
                <input type="email" id="register-email" placeholder="Email" required>
                <input type="password" id="register-password" placeholder="Password" required>
                <button onclick="handleRegister()">Register</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Show auth tab
function showAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.style.display = 'none');
    
    if (tab === 'login') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('login-form').style.display = 'block';
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('register-form').style.display = 'block';
    }
}

// Handle login
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('tradingUser', JSON.stringify(currentUser));
            document.querySelector('.modal-overlay').remove();
            updateUserInterface();
            await loadUserData();
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

// Handle registration
async function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            alert('Registration successful! Please login.');
            showAuthTab('login');
        } else {
            alert('Registration failed: ' + data.error);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

// Update user interface
function updateUserInterface() {
    if (currentUser) {
        // Update user name and balance
        const userName = document.getElementById('userName');
        const userBalance = document.getElementById('userBalance');
        
        if (userName) {
            userName.textContent = currentUser.name;
        }
        
        if (userBalance) {
            userBalance.textContent = `$${currentUser.balance.toFixed(2)}`;
        }
    }
}

// Load user data
async function loadUserData() {
    if (!currentUser) return;

    try {
        // Load market data
        await loadMarketData();
        
        // Load portfolio data
        await loadPortfolioData();
        
        // Load trades
        await loadTrades();
        
        // Load videos
        await loadVideos();
        
        // Load video categories
        await loadVideoCategories();
        
        // Update dashboard
        updateDashboard();
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load market data
async function loadMarketData() {
    try {
        const response = await fetch(`${API_BASE}/market-data`);
        const data = await response.json();
        
        if (data.success) {
            marketData = {};
            data.data.forEach(item => {
                marketData[item.symbol] = {
                    price: item.price,
                    change: item.change_percent,
                    changePercent: item.change_percent,
                    volume: item.volume,
                    marketCap: item.market_cap
                };
            });
            updateMarketCards();
        }
    } catch (error) {
        console.error('Error loading market data:', error);
    }
}

// Load portfolio data
async function loadPortfolioData() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/portfolio?user_id=${currentUser.id}`);
        const data = await response.json();
        
        if (data.success) {
            portfolioData = {
                totalValue: data.summary.total_value,
                todayPnl: data.summary.total_profit_loss,
                availableCash: currentUser.balance,
                winRate: 0 // Calculate based on trades
            };
            updatePortfolioTable(data.data);
        }
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}

// Load trades
async function loadTrades() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/trades?user_id=${currentUser.id}`);
        const data = await response.json();
        
        if (data.success) {
            updateTradesTable(data.data);
        }
    } catch (error) {
        console.error('Error loading trades:', error);
    }
}

// Initialize the application
function initializeApp() {
    console.log('Trading Platform initialized with database integration');
    
    // Set initial active section
    showSection('dashboard');
    
    // Initialize portfolio data
    updatePortfolioData();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            
            // Close mobile menu on mobile
            if (window.innerWidth <= 1024) {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('open');
            }
        });
    });
    
    // Trading form
    const tradingForm = document.getElementById('tradingForm');
    if (tradingForm) {
        tradingForm.addEventListener('submit', handleTradeSubmission);
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Video filters
    const categoryFilter = document.getElementById('categoryFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterVideos);
    }
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterVideos);
    }

    // Admin panel button
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    if (adminPanelBtn) {
        adminPanelBtn.addEventListener('click', createAdminVideoForm);
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('tradingUser');
    location.reload();
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    currentSection = sectionId;
    
    // Load section-specific data
    if (sectionId === 'portfolio') {
        loadPortfolioData();
    } else if (sectionId === 'trading') {
        loadMarketData();
    } else if (sectionId === 'analytics') {
        loadTrades();
    }
}

// Handle trade submission
async function handleTradeSubmission(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login to trade');
        return;
    }

    const formData = new FormData(e.target);
    const tradeData = {
        user_id: currentUser.id,
        symbol: formData.get('symbol'),
        type: formData.get('type'),
        quantity: parseFloat(formData.get('quantity')),
        price: parseFloat(formData.get('price'))
    };

    try {
        const response = await fetch(`${API_BASE}/trades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tradeData)
        });

        const data = await response.json();

        if (data.success) {
            alert('Trade executed successfully!');
            e.target.reset();
            
            // Reload user data
            await loadUserData();
            
            // Update balance
            currentUser.balance -= tradeData.quantity * tradeData.price;
            updateUserInterface();
        } else {
            alert('Trade failed: ' + data.error);
        }
    } catch (error) {
        console.error('Trade error:', error);
        alert('Trade failed. Please try again.');
    }
}

// Update market cards
function updateMarketCards() {
    const marketCards = document.querySelectorAll('.market-card');
    marketCards.forEach(card => {
        const symbol = card.querySelector('h3').textContent;
        if (marketData[symbol]) {
            const data = marketData[symbol];
            const priceElement = card.querySelector('.price');
            const changeElement = card.querySelector('.change');
            
            if (priceElement) {
                priceElement.textContent = `$${data.price.toFixed(2)}`;
            }
            
            if (changeElement) {
                const changeClass = data.change >= 0 ? 'positive' : 'negative';
                changeElement.className = `change ${changeClass}`;
                changeElement.textContent = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}%`;
            }
        }
    });
}

// Update portfolio table
function updatePortfolioTable(portfolioItems) {
    const tbody = document.querySelector('#portfolio-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    portfolioItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.symbol}</td>
            <td>${item.quantity.toFixed(4)}</td>
            <td>$${item.average_price.toFixed(2)}</td>
            <td>$${item.current_price.toFixed(2)}</td>
            <td>$${item.total_value.toFixed(2)}</td>
            <td class="${item.profit_loss >= 0 ? 'positive' : 'negative'}">
                ${item.profit_loss >= 0 ? '+' : ''}$${item.profit_loss.toFixed(2)}
            </td>
            <td>
                <button class="btn btn-primary">Trade</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update trades table
function updateTradesTable(trades) {
    const tbody = document.querySelector('#trades-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    trades.forEach(trade => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trade.symbol}</td>
            <td class="${trade.type}">${trade.type.toUpperCase()}</td>
            <td>${trade.quantity.toFixed(4)}</td>
            <td>$${trade.price.toFixed(2)}</td>
            <td>$${trade.total_amount.toFixed(2)}</td>
            <td class="status ${trade.status}">${trade.status}</td>
            <td>${new Date(trade.created_at).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Show trading for specific symbol
function showTradingForSymbol(symbol) {
    showSection('trading');
    
    // Pre-fill trading form
    const symbolInput = document.querySelector('input[name="symbol"]');
    const priceInput = document.querySelector('input[name="price"]');
    
    if (symbolInput) symbolInput.value = symbol;
    if (priceInput && marketData[symbol]) {
        priceInput.value = marketData[symbol].price.toFixed(2);
    }
}

// Update dashboard
function updateDashboard() {
    // Update portfolio stats
    const totalValueElement = document.getElementById('totalValue');
    const todayPnlElement = document.getElementById('todayPnl');
    const availableCashElement = document.getElementById('availableCash');
    const winRateElement = document.getElementById('winRate');
    
    if (totalValueElement) totalValueElement.textContent = `$${portfolioData.totalValue.toFixed(2)}`;
    if (todayPnlElement) {
        todayPnlElement.textContent = `$${portfolioData.todayPnl.toFixed(2)}`;
        const changeElement = document.getElementById('todayPnlChange');
        if (changeElement) {
            changeElement.textContent = `${portfolioData.todayPnl >= 0 ? '+' : ''}${portfolioData.todayPnl.toFixed(2)}%`;
            changeElement.className = `stat-change ${portfolioData.todayPnl >= 0 ? 'positive' : 'negative'}`;
        }
    }
    if (availableCashElement) availableCashElement.textContent = `$${portfolioData.availableCash.toFixed(2)}`;
    if (winRateElement) winRateElement.textContent = `${portfolioData.winRate.toFixed(1)}%`;
}

// Update portfolio data
function updatePortfolioData() {
    // This will be called when portfolio data is loaded from API
    updateDashboard();
}

// Initialize charts (placeholder)
function initializeCharts() {
    // Chart initialization will be added here
    console.log('Charts initialized');
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(async () => {
        if (currentUser) {
            await loadMarketData();
            await loadPortfolioData();
        }
    }, 30000); // Update every 30 seconds
}

// Video Management Functions
async function loadVideos() {
    try {
        const response = await fetch(`${API_BASE}/videos?user_id=${currentUser?.id || ''}`);
        const data = await response.json();
        
        if (data.success) {
            videos = data.videos;
            updateVideoGrid();
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

async function loadVideoCategories() {
    try {
        const response = await fetch(`${API_BASE}/video-categories`);
        const data = await response.json();
        
        if (data.success) {
            videoCategories = data.categories;
            updateCategoryFilter();
        }
    } catch (error) {
        console.error('Error loading video categories:', error);
    }
}

function updateVideoGrid() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;

    videoGrid.innerHTML = '';

    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.onclick = () => openVideoModal(video);

        const progressPercent = video.duration ? (video.progress.watched_duration / video.duration) * 100 : 0;

        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail_url}" alt="${video.title}" onerror="this.src='https://via.placeholder.com/300x180?text=Video'">
                <div class="video-play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description || ''}</p>
                <div class="video-meta">
                    <span class="video-tag">${video.category || 'Uncategorized'}</span>
                    <span class="video-tag difficulty-${video.difficulty}">${video.difficulty}</span>
                    ${video.duration ? `<span class="video-tag">${formatDuration(video.duration)}</span>` : ''}
                </div>
                ${video.progress ? `
                    <div class="video-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        videoGrid.appendChild(videoCard);
    });
}

function updateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;

    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    videoCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

function openVideoModal(video) {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('video-player');
    const title = document.getElementById('video-title');
    const description = document.getElementById('video-description');
    const category = document.getElementById('video-category');
    const difficulty = document.getElementById('video-difficulty');
    const duration = document.getElementById('video-duration');

    if (!modal) return;

    // Update video player
    player.src = `https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`;
    
    // Update video info
    title.textContent = video.title;
    description.textContent = video.description || '';
    category.textContent = video.category || 'Uncategorized';
    difficulty.textContent = video.difficulty;
    duration.textContent = video.duration ? formatDuration(video.duration) : '';

    // Show modal
    modal.style.display = 'flex';

    // Track video progress
    trackVideoProgress(video);
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('video-player');
    
    if (modal) {
        modal.style.display = 'none';
    }
    
    if (player) {
        player.src = '';
    }
}

async function trackVideoProgress(video) {
    if (!currentUser) return;

    try {
        await fetch(`${API_BASE}/video-progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                video_id: video.id,
                watched_duration: video.progress?.watched_duration || 0,
                is_completed: false
            })
        });
    } catch (error) {
        console.error('Error tracking video progress:', error);
    }
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Admin Functions
async function handleAdminLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch(`${API_BASE}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            currentAdmin = data.admin;
            localStorage.setItem('tradingAdmin', JSON.stringify(currentAdmin));
            document.querySelector('.admin-login-modal').remove();
            showAdminPanel();
        } else {
            alert('Admin login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Admin login error:', error);
        alert('Admin login failed. Please try again.');
    }
}

function showAdminPanel() {
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    if (adminPanelBtn) {
        adminPanelBtn.style.display = 'block';
    }
}

function createAdminVideoForm() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;

    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.innerHTML = `
        <h3>Add New Video</h3>
        <form class="admin-form" onsubmit="handleVideoSubmit(event)">
            <div class="form-row">
                <input type="text" id="video-title" placeholder="Video Title" required>
                <input type="url" id="video-url" placeholder="YouTube URL" required>
            </div>
            <div class="form-row">
                <select id="video-category" required>
                    <option value="">Select Category</option>
                    ${videoCategories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                </select>
                <select id="video-difficulty" required>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>
            <textarea id="video-description" placeholder="Video Description"></textarea>
            <div class="form-row">
                <label>
                    <input type="checkbox" id="video-private"> Private Video
                </label>
            </div>
            <button type="submit" class="btn btn-primary">Add Video</button>
        </form>
    `;

    videoGrid.parentNode.insertBefore(adminPanel, videoGrid);
}

async function handleVideoSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('video-title').value;
    const url = document.getElementById('video-url').value;
    const category = document.getElementById('video-category').value;
    const difficulty = document.getElementById('video-difficulty').value;
    const description = document.getElementById('video-description').value;
    const isPrivate = document.getElementById('video-private').checked;

    try {
        const response = await fetch(`${API_BASE}/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                youtube_url: url,
                category,
                difficulty,
                description,
                is_private: isPrivate,
                uploaded_by: currentAdmin?.id
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Video added successfully!');
            event.target.reset();
            await loadVideos();
        } else {
            alert('Failed to add video: ' + data.error);
        }
    } catch (error) {
        console.error('Error adding video:', error);
        alert('Failed to add video. Please try again.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Video modal close
    const videoClose = document.querySelector('.video-close');
    if (videoClose) {
        videoClose.onclick = closeVideoModal;
    }

    // Video modal background click
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        videoModal.onclick = function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        };
    }

    // Video filters
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');

    if (categoryFilter) {
        categoryFilter.onchange = filterVideos;
    }
    if (difficultyFilter) {
        difficultyFilter.onchange = filterVideos;
    }

    // Admin panel button
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    if (adminPanelBtn) {
        adminPanelBtn.onclick = createAdminVideoForm;
    }
});

function filterVideos() {
    const category = document.getElementById('category-filter')?.value || '';
    const difficulty = document.getElementById('difficulty-filter')?.value || '';

    const filteredVideos = videos.filter(video => {
        const categoryMatch = !category || video.category === category;
        const difficultyMatch = !difficulty || video.difficulty === difficulty;
        return categoryMatch && difficultyMatch;
    });

    // Update video grid with filtered videos
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;

    videoGrid.innerHTML = '';

    filteredVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.onclick = () => openVideoModal(video);

        const progressPercent = video.duration ? (video.progress.watched_duration / video.duration) * 100 : 0;

        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail_url}" alt="${video.title}" onerror="this.src='https://via.placeholder.com/300x180?text=Video'">
                <div class="video-play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description || ''}</p>
                <div class="video-meta">
                    <span class="video-tag">${video.category || 'Uncategorized'}</span>
                    <span class="video-tag difficulty-${video.difficulty}">${video.difficulty}</span>
                    ${video.duration ? `<span class="video-tag">${formatDuration(video.duration)}</span>` : ''}
                </div>
                ${video.progress ? `
                    <div class="video-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        videoGrid.appendChild(videoCard);
    });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// Video Modal Setup
function setupVideoModal() {
    const videoClose = document.querySelector('.video-close');
    const videoModal = document.getElementById('videoModal');

    if (videoClose) {
        videoClose.onclick = closeVideoModal;
    }

    if (videoModal) {
        videoModal.onclick = function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        };
    }
}

// Update page title
function updatePageTitle(section) {
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'portfolio': 'Portfolio',
            'markets': 'Markets',
            'trading': 'Trading',
            'videos': 'Video Library',
            'analytics': 'Analytics'
        };
        pageTitle.textContent = titles[section] || 'Dashboard';
    }
}

// Update navigation
function updateNavigation(activeSection) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === activeSection) {
            item.classList.add('active');
        }
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    updateNavigation(sectionId);
    
    // Update page title
    updatePageTitle(sectionId);
    
    currentSection = sectionId;
    
    // Load section-specific data
    if (sectionId === 'portfolio') {
        loadPortfolioData();
    } else if (sectionId === 'trading') {
        loadMarketData();
    } else if (sectionId === 'analytics') {
        loadTrades();
    } else if (sectionId === 'videos') {
        loadVideos();
        loadVideoCategories();
    }
}

// Make functions globally available
window.showAuthTab = showAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.handleAdminLogin = handleAdminLogin;
window.handleVideoSubmit = handleVideoSubmit;

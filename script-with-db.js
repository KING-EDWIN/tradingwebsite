// Trading Platform JavaScript with Database Integration

// Global variables
let currentSection = 'dashboard';
let currentUser = null;
let portfolioData = {
    totalValue: 0,
    todayPnl: 0,
    availableCash: 0,
    winRate: 0
};

let marketData = {};

// API Base URL
const API_BASE = '/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkUserAuth();
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
        // Update balance display
        document.getElementById('balance').textContent = `$${currentUser.balance.toFixed(2)}`;
        
        // Update user info
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
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
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
        });
    });
    
    // Trading form
    const tradingForm = document.querySelector('.trading-form');
    if (tradingForm) {
        tradingForm.addEventListener('submit', handleTradeSubmission);
    }
    
    // Market card clicks
    const marketCards = document.querySelectorAll('.market-card');
    marketCards.forEach(card => {
        card.addEventListener('click', function() {
            const symbol = this.querySelector('h3').textContent;
            showTradingForSymbol(symbol);
        });
    });
    
    // Trade buttons in portfolio
    const tradeButtons = document.querySelectorAll('.btn-primary');
    tradeButtons.forEach(button => {
        if (button.textContent.trim() === 'Trade') {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const symbol = row.querySelector('td:first-child').textContent;
                showTradingForSymbol(symbol);
            });
        }
    });

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
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
    const totalValueElement = document.querySelector('.stat-value[data-stat="total-value"]');
    const todayPnlElement = document.querySelector('.stat-value[data-stat="today-pnl"]');
    const availableCashElement = document.querySelector('.stat-value[data-stat="available-cash"]');
    const winRateElement = document.querySelector('.stat-value[data-stat="win-rate"]');
    
    if (totalValueElement) totalValueElement.textContent = `$${portfolioData.totalValue.toFixed(2)}`;
    if (todayPnlElement) {
        todayPnlElement.textContent = `$${portfolioData.todayPnl.toFixed(2)}`;
        todayPnlElement.className = `stat-value ${portfolioData.todayPnl >= 0 ? 'positive' : 'negative'}`;
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

// Make functions globally available
window.showAuthTab = showAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;

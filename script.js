// Trading Platform JavaScript

// Global variables
let currentSection = 'dashboard';
let portfolioData = {
    totalValue: 12450.00,
    todayPnl: 245.00,
    availableCash: 8750.00,
    winRate: 68.5
};

let marketData = {
    AAPL: { price: 150.25, change: 2.45, changePercent: 1.66 },
    TSLA: { price: 245.80, change: 13.20, changePercent: 5.67 },
    GOOGL: { price: 2850.00, change: -35.50, changePercent: -1.23 }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateDashboard();
    initializeCharts();
    simulateRealTimeUpdates();
});

// Initialize the application
function initializeApp() {
    console.log('Trading Platform initialized');
    
    // Set initial active section
    showSection('dashboard');
    
    // Update balance display
    updateBalance();
    
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
    
    // Update section-specific data
    if (sectionId === 'dashboard') {
        updateDashboard();
    } else if (sectionId === 'portfolio') {
        updatePortfolio();
    } else if (sectionId === 'markets') {
        updateMarkets();
    } else if (sectionId === 'trading') {
        updateTrading();
    } else if (sectionId === 'analytics') {
        updateAnalytics();
    }
}

// Update dashboard data
function updateDashboard() {
    // Update stats
    document.getElementById('total-value').textContent = `$${portfolioData.totalValue.toLocaleString()}`;
    document.getElementById('today-pnl').textContent = `$${portfolioData.todayPnl.toLocaleString()}`;
    document.getElementById('available-cash').textContent = `$${portfolioData.availableCash.toLocaleString()}`;
    document.getElementById('win-rate').textContent = `${portfolioData.winRate}%`;
    
    // Update recent trades (this would normally come from an API)
    updateRecentTrades();
}

// Update portfolio data
function updatePortfolio() {
    // This would normally fetch data from an API
    console.log('Portfolio data updated');
}

// Update markets data
function updateMarkets() {
    // Update market prices
    Object.keys(marketData).forEach(symbol => {
        const data = marketData[symbol];
        const priceElement = document.querySelector(`#${symbol.toLowerCase()}-mini-chart`)?.closest('.market-card')?.querySelector('.price');
        const changeElement = document.querySelector(`#${symbol.toLowerCase()}-mini-chart`)?.closest('.market-card')?.querySelector('.change');
        
        if (priceElement) {
            priceElement.textContent = `$${data.price.toFixed(2)}`;
        }
        if (changeElement) {
            changeElement.textContent = `${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`;
            changeElement.className = `change ${data.changePercent >= 0 ? 'positive' : 'negative'}`;
        }
    });
}

// Update trading interface
function updateTrading() {
    console.log('Trading interface updated');
}

// Update analytics
function updateAnalytics() {
    console.log('Analytics updated');
}

// Update balance display
function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = `$${portfolioData.availableCash.toLocaleString()}`;
    }
}

// Update portfolio data
function updatePortfolioData() {
    // This would normally fetch from an API
    console.log('Portfolio data updated');
}

// Update recent trades
function updateRecentTrades() {
    // This would normally fetch from an API
    console.log('Recent trades updated');
}

// Initialize charts
function initializeCharts() {
    // Portfolio Performance Chart
    const portfolioCtx = document.getElementById('portfolio-chart');
    if (portfolioCtx) {
        new Chart(portfolioCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [10000, 10200, 10500, 10300, 10800, 11200, 11000, 11500, 11800, 12000, 12200, 12450],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#888'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#888',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Market Overview Chart
    const marketCtx = document.getElementById('market-chart');
    if (marketCtx) {
        new Chart(marketCtx, {
            type: 'doughnut',
            data: {
                labels: ['AAPL', 'TSLA', 'GOOGL', 'Cash'],
                datasets: [{
                    data: [1502.50, 1229.00, 8550.00, 8750.00],
                    backgroundColor: [
                        '#00d4ff',
                        '#00ff88',
                        '#ff6b6b',
                        '#ffd93d'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20
                        }
                    }
                }
            }
        });
    }
    
    // Mini charts for market cards
    initializeMiniCharts();
}

// Initialize mini charts for market cards
function initializeMiniCharts() {
    const symbols = ['aapl', 'tsla', 'googl'];
    
    symbols.forEach(symbol => {
        const ctx = document.getElementById(`${symbol}-mini-chart`);
        if (ctx) {
            // Generate sample data
            const data = generateSampleData(20);
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.values,
                        borderColor: symbol === 'aapl' ? '#00d4ff' : symbol === 'tsla' ? '#00ff88' : '#ff6b6b',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    }
                }
            });
        }
    });
}

// Generate sample data for charts
function generateSampleData(points) {
    const labels = [];
    const values = [];
    let baseValue = 100;
    
    for (let i = 0; i < points; i++) {
        labels.push('');
        baseValue += (Math.random() - 0.5) * 10;
        values.push(Math.max(baseValue, 50));
    }
    
    return { labels, values };
}

// Handle trade submission
function handleTradeSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const tradeData = {
        symbol: document.getElementById('symbol').value.toUpperCase(),
        orderType: document.getElementById('order-type').value,
        side: document.getElementById('side').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value)
    };
    
    // Validate trade data
    if (!tradeData.symbol || !tradeData.quantity) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Simulate trade execution
    executeTrade(tradeData);
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showNotification('Trade executed successfully!', 'success');
}

// Execute trade (simulation)
function executeTrade(tradeData) {
    console.log('Executing trade:', tradeData);
    
    // Simulate trade execution
    setTimeout(() => {
        // Update portfolio data
        updatePortfolioAfterTrade(tradeData);
        
        // Update recent trades
        addRecentTrade(tradeData);
        
        // Update dashboard
        updateDashboard();
        
        // Show confirmation
        console.log('Trade executed successfully');
    }, 1000);
}

// Update portfolio after trade
function updatePortfolioAfterTrade(tradeData) {
    // This would normally update the actual portfolio
    console.log('Portfolio updated after trade');
}

// Add recent trade
function addRecentTrade(tradeData) {
    const tradesTable = document.getElementById('trades-tbody');
    if (tradesTable) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${tradeData.symbol}</td>
            <td><span class="trade-type ${tradeData.side}">${tradeData.side.charAt(0).toUpperCase() + tradeData.side.slice(1)}</span></td>
            <td>${tradeData.quantity}</td>
            <td>$${tradeData.price ? tradeData.price.toFixed(2) : 'Market'}</td>
            <td class="positive">+$0.00</td>
            <td>${new Date().toLocaleTimeString()}</td>
        `;
        tradesTable.insertBefore(newRow, tradesTable.firstChild);
        
        // Remove oldest trade if more than 10
        const rows = tradesTable.querySelectorAll('tr');
        if (rows.length > 10) {
            tradesTable.removeChild(rows[rows.length - 1]);
        }
    }
}

// Show trading for specific symbol
function showTradingForSymbol(symbol) {
    showSection('trading');
    
    // Pre-fill symbol in trading form
    const symbolInput = document.getElementById('symbol');
    if (symbolInput) {
        symbolInput.value = symbol;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff4444' : '#00d4ff'};
        color: #000;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update market prices
        Object.keys(marketData).forEach(symbol => {
            const data = marketData[symbol];
            const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
            data.price += change;
            data.change += change;
            data.changePercent = (data.change / (data.price - data.change)) * 100;
        });
        
        // Update portfolio value
        portfolioData.totalValue += (Math.random() - 0.5) * 100;
        portfolioData.todayPnl += (Math.random() - 0.5) * 50;
        
        // Update displays if on relevant sections
        if (currentSection === 'dashboard') {
            updateDashboard();
        } else if (currentSection === 'markets') {
            updateMarkets();
        }
        
        updateBalance();
    }, 5000); // Update every 5 seconds
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Add notification styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);





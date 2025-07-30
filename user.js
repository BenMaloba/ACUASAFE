document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Load nearby kiosks
    loadNearbyKiosks();
    
    // Load user orders
    loadUserOrders();
    
    // Handle logout
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('currentUser');
        window.location.href = '../auth/login.html';
    });
    
    // New order button
    document.getElementById('new-order-btn').addEventListener('click', function() {
        openNewOrderModal();
    });
    
    // Track order button
    document.getElementById('track-order-btn').addEventListener('click', function() {
        window.location.href = 'track-order.html';
    });
    
    // Close modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('new-order-modal').classList.add('hidden');
    });
    
    // Handle new order form submission
    document.getElementById('new-order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        placeNewOrder();
    });
});

function loadUserData() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.querySelector('.avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    } else {
        window.location.href = '../auth/login.html';
    }
}

function loadNearbyKiosks() {
    // In a real app, this would come from an API with location data
    const kiosks = JSON.parse(localStorage.getItem('acuasafe-kiosks')) || [];
    const container = document.getElementById('kiosk-cards-container');
    container.innerHTML = '';
    
    // Get approved kiosks
    const approvedKiosks = kiosks.filter(k => k.approved);
    
    if (approvedKiosks.length === 0) {
        container.innerHTML = '<p>No nearby water kiosks found.</p>';
        return;
    }
    
    // Display kiosks (for demo, showing all approved kiosks)
    approvedKiosks.forEach(kiosk => {
        const card = document.createElement('div');
        card.className = 'kiosk-card';
        
        // Random distance for demo (1-5 km)
        const distance = (Math.random() * 4 + 1).toFixed(1);
        
        card.innerHTML = `
            <h3>${kiosk.name}</h3>
            <p>${kiosk.location}</p>
            <p class="kiosk-distance">${distance} km away</p>
            <button class="order-kiosk-btn" data-kiosk-id="${kiosk.id}">Order Water</button>
        `;
        
        container.appendChild(card);
    });
    
    // Add event listeners to order buttons
    document.querySelectorAll('.order-kiosk-btn').forEach(button => {
        button.addEventListener('click', function() {
            const kioskId = this.getAttribute('data-kiosk-id');
            openNewOrderModal(kioskId);
        });
    });
}

function loadUserOrders() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const orders = JSON.parse(localStorage.getItem('acuasafe-orders')) || [];
    const kiosks = JSON.parse(localStorage.getItem('acuasafe-kiosks')) || [];
    
    // Filter orders for current user
    const userOrders = orders.filter(order => order.customerEmail === currentUser.email);
    const tableBody = document.getElementById('user-orders-table-body');
    tableBody.innerHTML = '';
    
    if (userOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">You have no recent orders.</td></tr>';
        return;
    }
    
    // Get last 5 orders
    const recentOrders = userOrders.slice(-5).reverse();
    
    recentOrders.forEach(order => {
        const kiosk = kiosks.find(k => k.id === order.kioskId);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${order.id.substring(0, 8)}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${kiosk ? kiosk.name : 'Unknown'}</td>
            <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
            <td><button class="view-order-btn">View</button></td>
        `;
        
        tableBody.appendChild(row);
    });
}

function openNewOrderModal(kioskId = null) {
    const modal = document.getElementById('new-order-modal');
    const form = document.getElementById('new-order-form');
    const kioskSelect = document.getElementById('order-kiosk');
    
    // Reset form
    form.reset();
    
    // Get approved kiosks
    const kiosks = JSON.parse(localStorage.getItem('acuasafe-kiosks')) || [];
    const approvedKiosks = kiosks.filter(k => k.approved);
    
    // Populate kiosk select
    kioskSelect.innerHTML = '<option value="">Select a water kiosk</option>';
    approvedKiosks.forEach(kiosk => {
        const option = document.createElement('option');
        option.value = kiosk.id;
        option.textContent = kiosk.name;
        if (kioskId && kiosk.id === kioskId) {
            option.selected = true;
        }
        kioskSelect.appendChild(option);
    });
    
    // Set current user's address as default
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.address) {
        document.getElementById('order-address').value = currentUser.address;
    }
    
    // Show modal
    modal.classList.remove('hidden');
}

function placeNewOrder() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get form values
    const kioskId = document.getElementById('order-kiosk').value;
    const bottleSize = document.getElementById('order-bottle-size').value;
    const quantity = document.getElementById('order-quantity').value;
    const address = document.getElementById('order-address').value;
    const paymentMethod = document.getElementById('order-payment').value;
    
    // Get kiosk
    const kiosks = JSON.parse(localStorage.getItem('acuasafe-kiosks')) || [];
    const kiosk = kiosks.find(k => k.id === kioskId);
    
    if (!kiosk) {
        alert('Please select a valid water kiosk');
        return;
    }
    
    // Create new order
    const newOrder = {
        id: 'order-' + Math.random().toString(36).substring(2, 15),
        customerEmail: currentUser.email,
        kioskId: kiosk.id,
        bottleSize: bottleSize + 'L',
        quantity: quantity,
        address: address,
        paymentMethod: paymentMethod,
        date: new Date().toISOString(),
        status: 'Pending',
        deliveryProgress: 0
    };
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('acuasafe-orders')) || [];
    orders.push(newOrder);
    localStorage.setItem('acuasafe-orders', JSON.stringify(orders));
    
    // Close modal
    document.getElementById('new-order-modal').classList.add('hidden');
    
    // Show success message
    alert('Order placed successfully!');
    
    // Refresh orders list
    loadUserOrders();
}
// Enhanced Sample Order Data
const sampleOrders = {
    "ORD-1001": {
        id: "ORD-1001",
        date: "2023-06-15T10:30:00",
        kiosk: "AquaPure Kiosk - Nairobi CBD",
        bottleSize: "20L",
        quantity: 2,
        amount: "KSh 600",
        paymentMethod: "M-Pesa",
        status: "processing",
        progress: 25,
        deliveryPerson: {
            name: "James Mwangi",
            phone: "+254712345678",
            vehicle: "Motorcycle - KCR 234X",
            photo: "../images/delivery/driver1.jpg",
            rating: "4.8"
        },
        deliveryAddress: "123 Business Plaza, 5th Floor, Nairobi",
        estimatedDelivery: "2023-06-16T14:00:00",
        items: [
            { name: "20L Bottled Water", quantity: 2, price: 300 }
        ],
        deliveryNotes: "Please call upon arrival",
        waterQuality: {
            ph: 7.2,
            chlorine: 2.1,
            turbidity: 1.2,
            lastTested: "2023-06-14"
        }
    },
    "ORD-1002": {
        id: "ORD-1002",
        date: "2023-06-16T09:15:00",
        kiosk: "FreshFlow Station - Westlands",
        bottleSize: "5L",
        quantity: 5,
        amount: "KSh 750",
        paymentMethod: "Credit Card",
        status: "shipped",
        progress: 50,
        deliveryPerson: {
            name: "Susan Wanjiku",
            phone: "+254723456789",
            vehicle: "Van - KBM 567Y",
            photo: "../images/delivery/driver2.jpg",
            rating: "4.9"
        },
        deliveryAddress: "456 Riverside Drive, Apartment 12, Nairobi",
        estimatedDelivery: "2023-06-17T10:30:00",
        items: [
            { name: "5L Bottled Water", quantity: 5, price: 150 }
        ],
        deliveryNotes: "Gate code: 1234",
        waterQuality: {
            ph: 6.8,
            chlorine: 1.8,
            turbidity: 2.5,
            lastTested: "2023-06-15"
        }
    },
    "ORD-1003": {
        id: "ORD-1003",
        date: "2023-06-17T14:45:00",
        kiosk: "CleanH2O Point - Kilimani",
        bottleSize: "10L",
        quantity: 3,
        amount: "KSh 900",
        paymentMethod: "M-Pesa",
        status: "nearby",
        progress: 75,
        deliveryPerson: {
            name: "Peter Kamau",
            phone: "+254734567890",
            vehicle: "Motorcycle - KDF 890Z",
            photo: "../images/delivery/driver3.jpg",
            rating: "4.7"
        },
        deliveryAddress: "789 Garden Estate, House 24, Nairobi",
        estimatedDelivery: "2023-06-17T16:45:00",
        items: [
            { name: "10L Bottled Water", quantity: 3, price: 300 }
        ],
        deliveryNotes: "Leave with security if not home",
        waterQuality: {
            ph: 8.2,
            chlorine: 0.5,
            turbidity: 0.8,
            lastTested: "2023-06-16"
        }
    },
    "ORD-1004": {
        id: "ORD-1004",
        date: "2023-06-18T11:20:00",
        kiosk: "PureDrop Center - Karen",
        bottleSize: "20L",
        quantity: 1,
        amount: "KSh 300",
        paymentMethod: "Cash on Delivery",
        status: "delivered",
        progress: 100,
        deliveryPerson: {
            name: "Grace Atieno",
            phone: "+254745678901",
            vehicle: "Motorcycle - KGH 123A",
            photo: "../images/delivery/driver4.jpg",
            rating: "5.0"
        },
        deliveryAddress: "321 Forest Road, Karen, Nairobi",
        deliveredAt: "2023-06-18T14:30:00",
        items: [
            { name: "20L Bottled Water", quantity: 1, price: 300 }
        ],
        deliveryNotes: "Delivered to reception",
        waterQuality: {
            ph: 7.0,
            chlorine: 2.3,
            turbidity: 1.0,
            lastTested: "2023-06-17"
        }
    },
    "ORD-1005": {
        id: "ORD-1005",
        date: "2023-06-19T08:45:00",
        kiosk: "BlueWave Kiosk - Thika",
        bottleSize: "5L",
        quantity: 4,
        amount: "KSh 600",
        paymentMethod: "M-Pesa",
        status: "processing",
        progress: 25,
        deliveryPerson: {
            name: "David Omondi",
            phone: "+254756789012",
            vehicle: "Bicycle - THK 456B",
            photo: "../images/delivery/driver5.jpg",
            rating: "4.5"
        },
        deliveryAddress: "555 Industrial Area, Thika",
        estimatedDelivery: "2023-06-20T09:00:00",
        items: [
            { name: "5L Bottled Water", quantity: 4, price: 150 }
        ],
        deliveryNotes: "Call before delivery",
        waterQuality: {
            ph: 7.5,
            chlorine: 1.5,
            turbidity: 1.8,
            lastTested: "2023-06-18"
        }
    }
};

// DOM Elements
const orderIdInput = document.getElementById('order-id');
const searchBtn = document.getElementById('search-order-btn');
const orderDetails = document.getElementById('order-details');
const noOrderFound = document.getElementById('no-order-found');
const tryAgainBtn = document.getElementById('try-again-btn');
const contactBtn = document.getElementById('contact-delivery-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupEventListeners();
    checkUrlForOrderId();
});

function loadUserData() {
    // In a real app, this would come from session storage or an API
    const currentUser = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+254700123456",
        address: "123 Business Plaza, 5th Floor, Nairobi"
    };
    
    document.getElementById('user-name').textContent = currentUser.name;
    document.querySelector('.avatar').textContent = currentUser.name.charAt(0).toUpperCase();
}

function setupEventListeners() {
    searchBtn.addEventListener('click', searchOrder);
    orderIdInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchOrder();
    });
    tryAgainBtn.addEventListener('click', resetSearch);
    contactBtn.addEventListener('click', contactDeliveryPerson);
    document.getElementById('logout').addEventListener('click', logoutUser);
}

function checkUrlForOrderId() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    if (orderId) {
        orderIdInput.value = orderId;
        searchOrder();
    }
}

function searchOrder() {
    const orderId = orderIdInput.value.trim().toUpperCase();
    
    if (!orderId) {
        showAlert("Please enter an order ID", "warning");
        return;
    }
    
    // Hide both result containers initially
    orderDetails.classList.add('hidden');
    noOrderFound.classList.add('hidden');
    
    // Show loading state
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled = true;
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        if (sampleOrders[orderId]) {
            displayOrderDetails(sampleOrders[orderId]);
        } else {
            noOrderFound.classList.remove('hidden');
        }
        
        // Reset search button
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Track Order';
        searchBtn.disabled = false;
    }, 800);
}

function displayOrderDetails(order) {
    // Update order information
    document.getElementById('track-order-id').textContent = order.id;
    document.getElementById('track-order-date').textContent = formatDateTime(order.date);
    document.getElementById('track-order-kiosk').textContent = order.kiosk;
    document.getElementById('track-order-size').textContent = order.bottleSize;
    document.getElementById('track-order-quantity').textContent = order.quantity;
    document.getElementById('track-order-amount').textContent = order.amount;
    document.getElementById('track-order-payment').textContent = order.paymentMethod;
    
    // Update status
    const statusElement = document.getElementById('track-order-status');
    statusElement.textContent = order.status;
    statusElement.className = 'info-value status';
    statusElement.classList.add(`status-${order.status}`);
    
    // Update progress
    updateProgressBar(order.progress);
    updateProgressSteps(order.progress);
    
    // Update delivery info
    const deliveryImg = document.querySelector('.delivery-person img');
    deliveryImg.src = order.deliveryPerson.photo;
    deliveryImg.alt = order.deliveryPerson.name;
    
    document.getElementById('delivery-person-name').textContent = 
        `${order.deliveryPerson.name} (${order.deliveryPerson.rating} ★)`;
    document.getElementById('delivery-person-phone').innerHTML = 
        `<i class="fas fa-phone"></i> ${order.deliveryPerson.phone}`;
    document.getElementById('delivery-person-vehicle').innerHTML = 
        `<i class="fas fa-truck"></i> ${order.deliveryPerson.vehicle}`;
    
    // Update delivery time estimate
    const timeElement = document.getElementById('delivery-time-estimate');
    if (order.status === 'delivered') {
        timeElement.innerHTML = `<i class="fas fa-check-circle"></i> Delivered on ${formatDateTime(order.deliveredAt)}`;
    } else {
        timeElement.innerHTML = `<i class="fas fa-clock"></i> Estimated delivery: ${formatDateTime(order.estimatedDelivery)}`;
    }
    
    // Update delivery location
    document.getElementById('delivery-location-text').textContent = order.deliveryAddress;
    
    // Update order items
    const itemsList = document.getElementById('order-items-list');
    itemsList.innerHTML = '';
    
    order.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>KSh ${item.price}</td>
            <td>KSh ${item.quantity * item.price}</td>
        `;
        itemsList.appendChild(row);
    });
    
    // Show order details
    orderDetails.classList.remove('hidden');
    
    // Scroll to order details
    orderDetails.scrollIntoView({ behavior: 'smooth' });
}

function updateProgressBar(progress) {
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function updateProgressSteps(progress) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach(step => {
        const stepValue = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        
        if (stepValue < progress) {
            step.classList.add('completed');
        } else if (stepValue === progress) {
            step.classList.add('active');
        }
    });
}

function formatDateTime(dateTimeString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
}

function resetSearch() {
    orderIdInput.value = '';
    noOrderFound.classList.add('hidden');
    orderIdInput.focus();
}

function contactDeliveryPerson() {
    const phoneNumber = document.getElementById('delivery-person-phone').textContent.replace(/\D/g, '');
    if (confirm(`Call delivery person at ${phoneNumber}?`)) {
        window.open(`tel:${phoneNumber}`);
    }
}

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        // In a real app, this would clear session data
        window.location.href = '../auth/login.html';
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const searchOrderDiv = document.querySelector('.search-order');
    searchOrderDiv.insertBefore(alertDiv, searchOrderDiv.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
// Dummy Order Data - Matches admin.js data structure
const dummyOrders = [
    {
        id: "ORD-2023-1001",
        date: "2023-06-15T10:30:00",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254700123456"
        },
        kiosk: {
            id: "kiosk1",
            name: "AquaPure Kiosk - Nairobi CBD"
        },
        items: [
            { name: "20L Bottled Water", quantity: 2, price: 300 }
        ],
        totalAmount: 600,
        paymentMethod: "M-Pesa",
        status: "completed",
        deliveryAddress: "123 Business Plaza, 5th Floor, Nairobi",
        notes: "Leave with reception if not home"
    },
    {
        id: "ORD-2023-1002",
        date: "2023-06-16T14:45:00",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254700123456"
        },
        kiosk: {
            id: "kiosk2",
            name: "FreshFlow Station - Westlands"
        },
        items: [
            { name: "5L Bottled Water", quantity: 5, price: 150 }
        ],
        totalAmount: 750,
        paymentMethod: "Credit Card",
        status: "completed",
        deliveryAddress: "456 Riverside Drive, Apartment 12, Nairobi",
        notes: "Gate code: 1234"
    },
    {
        id: "ORD-2023-1003",
        date: "2023-06-17T09:15:00",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254700123456"
        },
        kiosk: {
            id: "kiosk3",
            name: "CleanH2O Point - Kilimani"
        },
        items: [
            { name: "10L Bottled Water", quantity: 3, price: 300 }
        ],
        totalAmount: 900,
        paymentMethod: "M-Pesa",
        status: "processing",
        deliveryAddress: "789 Garden Estate, House 24, Nairobi",
        notes: "Call before delivery"
    },
    {
        id: "ORD-2023-1004",
        date: "2023-06-18T16:20:00",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254700123456"
        },
        kiosk: {
            id: "kiosk4",
            name: "PureDrop Center - Karen"
        },
        items: [
            { name: "20L Bottled Water", quantity: 1, price: 300 },
            { name: "5L Bottled Water", quantity: 2, price: 150 }
        ],
        totalAmount: 600,
        paymentMethod: "Cash on Delivery",
        status: "cancelled",
        deliveryAddress: "321 Forest Road, Karen, Nairobi",
        notes: "Customer cancelled order"
    },
    {
        id: "ORD-2023-1005",
        date: "2023-06-19T11:30:00",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254700123456"
        },
        kiosk: {
            id: "kiosk1",
            name: "AquaPure Kiosk - Nairobi CBD"
        },
        items: [
            { name: "10L Bottled Water", quantity: 4, price: 300 }
        ],
        totalAmount: 1200,
        paymentMethod: "M-Pesa",
        status: "completed",
        deliveryAddress: "123 Business Plaza, 5th Floor, Nairobi",
        notes: "Delivered to security desk"
    },
    {
        id: "ORD-2023-1006",
        date: "2023-06-20T13:45:00",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254700123456"
        },
        kiosk: {
            id: "kiosk5",
            name: "BlueWave Kiosk - Thika"
        },
        items: [
            { name: "5L Bottled Water", quantity: 6, price: 150 }
        ],
        totalAmount: 900,
        paymentMethod: "Credit Card",
        status: "processing",
        deliveryAddress: "555 Industrial Area, Thika",
        notes: "Office hours only"
    }
];

// Pagination variables
let currentPage = 1;
const ordersPerPage = 5;
let filteredOrders = [...dummyOrders];

document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Initialize the order history table
    renderOrderHistory();
    
    // Set up event listeners
    setupEventListeners();
});

function loadUserData() {
    // In a real app, this would come from session storage
    const currentUser = {
        name: "John Doe",
        email: "john@example.com"
    };
    
    document.getElementById('user-name').textContent = currentUser.name;
    document.querySelector('.avatar').textContent = currentUser.name.charAt(0).toUpperCase();
}

function setupEventListeners() {
    // Filter event listeners
    document.getElementById('filter-status').addEventListener('change', applyFilters);
    document.getElementById('filter-date').addEventListener('change', applyFilters);
    
    // Pagination event listeners
    document.getElementById('prev-page').addEventListener('click', goToPrevPage);
    document.getElementById('next-page').addEventListener('click', goToNextPage);
    
    // Modal event listeners
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('track-this-order').addEventListener('click', trackCurrentOrder);
    document.getElementById('logout').addEventListener('click', logoutUser);
}

function renderOrderHistory() {
    const tbody = document.getElementById('order-history-table-body');
    tbody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const ordersToShow = filteredOrders.slice(startIndex, endIndex);
    
    if (ordersToShow.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 30px;">
                No orders found matching your criteria
            </td>
        `;
        tbody.appendChild(tr);
        return;
    }
    
    ordersToShow.forEach(order => {
        const tr = document.createElement('tr');
        
        // Format date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create items summary
        const itemsSummary = order.items.map(item => 
            `${item.quantity}x ${item.name}`
        ).join(', ');
        
        // Determine status class
        let statusClass = '';
        if (order.status === 'completed') statusClass = 'status-completed';
        else if (order.status === 'processing') statusClass = 'status-processing';
        else if (order.status === 'cancelled') statusClass = 'status-cancelled';
        
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${formattedDate}</td>
            <td>${order.kiosk.name}</td>
            <td>${itemsSummary}</td>
            <td>KSh ${order.totalAmount}</td>
            <td><span class="status-badge ${statusClass}">${order.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary view-order" data-id="${order.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${order.status === 'processing' ? `
                    <button class="btn btn-danger cancel-order" data-id="${order.id}">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Update pagination controls
    updatePaginationControls();
    
    // Add event listeners to action buttons
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', () => viewOrderDetails(btn.dataset.id));
    });
    
    document.querySelectorAll('.cancel-order').forEach(btn => {
        btn.addEventListener('click', () => cancelOrder(btn.dataset.id));
    });
}

function applyFilters() {
    const statusFilter = document.getElementById('filter-status').value;
    const dateFilter = document.getElementById('filter-date').value;
    
    filteredOrders = dummyOrders.filter(order => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) {
            return false;
        }
        
        // Date filter
        const orderDate = new Date(order.date);
        const today = new Date();
        
        if (dateFilter === 'month') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            return orderDate >= firstDayOfMonth;
        } else if (dateFilter === 'week') {
            const firstDayOfWeek = new Date(today);
            firstDayOfWeek.setDate(today.getDate() - today.getDay());
            return orderDate >= firstDayOfWeek;
        } else if (dateFilter === 'today') {
            return orderDate.toDateString() === today.toDateString();
        }
        
        return true;
    });
    
    // Reset to first page when filters change
    currentPage = 1;
    renderOrderHistory();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderOrderHistory();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderOrderHistory();
    }
}

function viewOrderDetails(orderId) {
    const order = dummyOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modalContent = document.getElementById('order-details-content');
    
    // Format date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create items table
    let itemsTable = '';
    order.items.forEach(item => {
        itemsTable += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>KSh ${item.price}</td>
                <td>KSh ${item.quantity * item.price}</td>
            </tr>
        `;
    });
    
    modalContent.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Order ID:</div>
            <div class="detail-value">${order.id}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Date:</div>
            <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Kiosk:</div>
            <div class="detail-value">${order.kiosk.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Delivery Address:</div>
            <div class="detail-value">${order.deliveryAddress}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Payment Method:</div>
            <div class="detail-value">${order.paymentMethod}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Status:</div>
            <div class="detail-value"><span class="status-badge ${order.status === 'completed' ? 'status-completed' : 
                order.status === 'processing' ? 'status-processing' : 'status-cancelled'}">${order.status}</span></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Notes:</div>
            <div class="detail-value">${order.notes || 'None'}</div>
        </div>
        
        <h4>Order Items</h4>
        <table class="order-items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsTable}
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="3" style="text-align: right;">Total Amount:</th>
                    <th>KSh ${order.totalAmount}</th>
                </tr>
            </tfoot>
        </table>
    `;
    
    // Store current order ID for tracking
    document.getElementById('track-this-order').dataset.id = order.id;
    
    // Show modal
    document.getElementById('order-details-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('order-details-modal').classList.add('hidden');
}

function trackCurrentOrder() {
    const orderId = document.getElementById('track-this-order').dataset.id;
    closeModal();
    window.location.href = `track-order.html?orderId=${orderId}`;
}

function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        // In a real app, this would be an API call
        const orderIndex = dummyOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            dummyOrders[orderIndex].status = 'cancelled';
            renderOrderHistory();
            alert('Order has been cancelled');
        }
    }
}

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        // In a real app, this would clear session data
        window.location.href = '../auth/login.html';
    }
}

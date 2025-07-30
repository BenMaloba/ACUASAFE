document.addEventListener('DOMContentLoaded', function() {
    // Load admin data
    loadAdminData();
    
    // Load dashboard stats
    loadDashboardStats();
    
    // Load recent orders
    loadRecentOrders();
    
    // Handle logout
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('currentUser');
        window.location.href = '../auth/login.html';
    });
});

function loadAdminData() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('admin-name').textContent = currentUser.name;
        document.querySelector('.avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    } else {
        window.location.href = '../auth/login.html';
    }
}

function loadDashboardStats() {
    // In a real app, these would come from an API
    const kiosks = JSON.parse(localStorage.getItem('acuasafe-kiosks')) || [];
    const users = JSON.parse(localStorage.getItem('acuasafe-users')) || [];
    const orders = JSON.parse(localStorage.getItem('acuasafe-orders')) || [];
    
    // Calculate stats
    const totalKiosks = kiosks.length;
    const pendingApprovals = kiosks.filter(k => !k.approved).length;
    const totalOrders = orders.length;
    const qualityTests = 15; // Hardcoded for demo
    
    // Update UI
    document.getElementById('total-kiosks').textContent = totalKiosks;
    document.getElementById('pending-approvals').textContent = pendingApprovals;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('quality-tests').textContent = qualityTests;
}

function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('acuasafe-orders')) || [];
    const users = JSON.parse(localStorage.getItem('acuasafe-users')) || [];
    const kiosks = JSON.parse(localStorage.getItem('acuasafe-kiosks')) || [];
    
    // Get last 5 orders
    const recentOrders = orders.slice(-5).reverse();
    
    const tableBody = document.getElementById('orders-table-body');
    tableBody.innerHTML = '';
    
    recentOrders.forEach(order => {
        const customer = users.find(u => u.email === order.customerEmail);
        const kiosk = kiosks.find(k => k.id === order.kioskId);
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${order.id.substring(0, 8)}</td>
            <td>${customer ? customer.name : 'Unknown'}</td>
            <td>${kiosk ? kiosk.name : 'Unknown'}</td>
            <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>
                <button class="btn btn-primary">View</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}
// Sample dummy users data
const dummyUsers = [
    {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        address: "123 Water St, Nairobi",
        password: "password123",
        userType: "customer",
        status: "active"
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "9876543210",
        address: "456 River Rd, Mombasa",
        password: "password123",
        userType: "customer",
        status: "active"
    },
    {
        name: "Kiosk Manager",
        email: "manager@kiosk.com",
        phone: "5551234567",
        address: "789 Lake Ave, Kisumu",
        password: "manager123",
        userType: "kiosk-admin",
        status: "active",
        kiosk: "Kiosk A"
    },
    {
        name: "Inactive User",
        email: "inactive@example.com",
        phone: "1112223333",
        address: "321 Ocean Blvd, Nakuru",
        password: "password123",
        userType: "customer",
        status: "inactive"
    },
    {
        name: "Suspended Admin",
        email: "suspended@admin.com",
        phone: "4445556666",
        address: "654 Bay View, Eldoret",
        password: "admin123",
        userType: "kiosk-admin",
        status: "suspended",
        kiosk: "Kiosk B"
    }
];

// Function to populate users table
function populateUsersTable() {
    const usersTableBody = document.getElementById('users-table-body');
    usersTableBody.innerHTML = '';

    dummyUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        let statusClass = '';
        if (user.status === 'active') statusClass = 'status-active';
        else if (user.status === 'inactive') statusClass = 'status-inactive';
        else if (user.status === 'suspended') statusClass = 'status-suspended';
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.userType.replace('-', ' ').toUpperCase()}</td>
            <td><span class="status-badge ${statusClass}">${user.status.toUpperCase()}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    populateUsersTable();
    
    // Add event listeners for modal
    const addUserBtn = document.getElementById('add-user-btn');
    const addUserModal = document.getElementById('add-user-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            addUserModal.classList.add('show');
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addUserModal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addUserModal) {
            addUserModal.classList.remove('show');
        }
    });
});
// Sample dummy reports data
const dummyReports = [
    {
        id: 'REP-2023-001',
        kiosk: 'Kiosk A',
        kioskId: 'kiosk1',
        testDate: '2023-06-15',
        phLevel: 7.2,
        chlorineLevel: 2.1,
        turbidity: 1.2,
        temperature: 25.5,
        notes: 'Water quality excellent, within all safe parameters',
        status: 'approved',
        testedBy: 'John Doe',
        approvedBy: 'Admin User',
        approvedAt: '2023-06-16'
    },
    {
        id: 'REP-2023-002',
        kiosk: 'Kiosk B',
        kioskId: 'kiosk2',
        testDate: '2023-06-18',
        phLevel: 6.8,
        chlorineLevel: 1.8,
        turbidity: 2.5,
        temperature: 26.0,
        notes: 'Slightly high turbidity, recommend additional filtration',
        status: 'approved',
        testedBy: 'Jane Smith',
        approvedBy: 'Admin User',
        approvedAt: '2023-06-19'
    },
    {
        id: 'REP-2023-003',
        kiosk: 'Kiosk C',
        kioskId: 'kiosk3',
        testDate: '2023-06-20',
        phLevel: 8.2,
        chlorineLevel: 0.5,
        turbidity: 0.8,
        temperature: 24.8,
        notes: 'Low chlorine levels detected, system adjusted',
        status: 'pending',
        testedBy: 'Mike Johnson',
        approvedBy: '',
        approvedAt: ''
    },
    {
        id: 'REP-2023-004',
        kiosk: 'Kiosk D',
        kioskId: 'kiosk4',
        testDate: '2023-06-22',
        phLevel: 5.9,
        chlorineLevel: 4.5,
        turbidity: 3.1,
        temperature: 27.2,
        notes: 'pH too low and chlorine too high. System shutdown for maintenance.',
        status: 'rejected',
        testedBy: 'Sarah Williams',
        approvedBy: 'Admin User',
        approvedAt: '2023-06-23'
    },
    {
        id: 'REP-2023-005',
        kiosk: 'Kiosk A',
        kioskId: 'kiosk1',
        testDate: '2023-06-25',
        phLevel: 7.0,
        chlorineLevel: 2.3,
        turbidity: 1.0,
        temperature: 25.0,
        notes: 'All parameters normal after maintenance',
        status: 'approved',
        testedBy: 'John Doe',
        approvedBy: 'Admin User',
        approvedAt: '2023-06-26'
    }
];

// Sample dummy kiosks for dropdown
const dummyKiosk = [
    { id: 'kiosk1', name: 'Kiosk A' },
    { id: 'kiosk2', name: 'Kiosk B' },
    { id: 'kiosk3', name: 'Kiosk C' },
    { id: 'kiosk4', name: 'Kiosk D' }
];

// Function to populate reports table
function populateReportsTable(reports = dummyReports) {
    const reportsTableBody = document.getElementById('reports-table-body');
    reportsTableBody.innerHTML = '';

    reports.forEach(report => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        let statusClass = '';
        if (report.status === 'approved') statusClass = 'status-approved';
        else if (report.status === 'pending') statusClass = 'status-pending';
        else if (report.status === 'rejected') statusClass = 'status-rejected';
        
        // Format date
        const testDate = new Date(report.testDate).toLocaleDateString();
        
        row.innerHTML = `
            <td>${report.id}</td>
            <td>${report.kiosk}</td>
            <td>${testDate}</td>
            <td>${report.phLevel.toFixed(1)}</td>
            <td>${report.chlorineLevel.toFixed(1)} ppm</td>
            <td><span class="status-badge ${statusClass}">${report.status.toUpperCase()}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary view-report" data-id="${report.id}" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-primary edit-report" data-id="${report.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger delete-report" data-id="${report.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        reportsTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.view-report').forEach(btn => {
        btn.addEventListener('click', () => viewReportDetails(btn.dataset.id));
    });
    
    document.querySelectorAll('.edit-report').forEach(btn => {
        btn.addEventListener('click', () => editReport(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-report').forEach(btn => {
        btn.addEventListener('click', () => deleteReport(btn.dataset.id));
    });
}

// Function to view report details
function viewReportDetails(reportId) {
    const report = dummyReports.find(r => r.id === reportId);
    if (!report) return;
    
    const detailsModal = document.getElementById('report-details-modal');
    const detailsContent = document.getElementById('report-details-content');
    
    // Format dates
    const testDate = new Date(report.testDate).toLocaleDateString();
    const approvedDate = report.approvedAt ? new Date(report.approvedAt).toLocaleDateString() : 'N/A';
    
    detailsContent.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Report ID:</div>
            <div class="detail-value">${report.id}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Kiosk:</div>
            <div class="detail-value">${report.kiosk}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Test Date:</div>
            <div class="detail-value">${testDate}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Tested By:</div>
            <div class="detail-value">${report.testedBy}</div>
        </div>
        <h3>Test Results</h3>
        <div class="detail-row">
            <div class="detail-label">pH Level:</div>
            <div class="detail-value">${report.phLevel.toFixed(1)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Chlorine:</div>
            <div class="detail-value">${report.chlorineLevel.toFixed(1)} ppm</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Turbidity:</div>
            <div class="detail-value">${report.turbidity ? report.turbidity.toFixed(1) + ' NTU' : 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Temperature:</div>
            <div class="detail-value">${report.temperature ? report.temperature.toFixed(1) + '°C' : 'N/A'}</div>
        </div>
        <h3>Approval Status</h3>
        <div class="detail-row">
            <div class="detail-label">Status:</div>
            <div class="detail-value"><span class="status-badge ${report.status === 'approved' ? 'status-approved' : report.status === 'pending' ? 'status-pending' : 'status-rejected'}">${report.status.toUpperCase()}</span></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Approved By:</div>
            <div class="detail-value">${report.approvedBy || 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Approved At:</div>
            <div class="detail-value">${approvedDate}</div>
        </div>
        <h3>Notes</h3>
        <div class="detail-row">
            <div class="detail-value">${report.notes || 'No notes available'}</div>
        </div>
    `;
    
    // Show/hide action buttons based on status
    document.getElementById('approve-report').style.display = report.status === 'pending' ? 'inline-flex' : 'none';
    document.getElementById('reject-report').style.display = report.status === 'pending' ? 'inline-flex' : 'none';
    
    // Add event listeners to action buttons
    document.getElementById('approve-report').onclick = () => {
        alert(`Report ${report.id} approved!`);
        detailsModal.classList.remove('show');
    };
    
    document.getElementById('reject-report').onclick = () => {
        alert(`Report ${report.id} rejected!`);
        detailsModal.classList.remove('show');
    };
    
    document.getElementById('close-details').onclick = () => {
        detailsModal.classList.remove('show');
    };
    
    detailsModal.classList.add('show');
}

// Function to populate kiosk dropdowns
function populateKioskDropdowns() {
    const reportKioskSelect = document.getElementById('report-kiosk');
    const filterKioskSelect = document.getElementById('filter-kiosk');
    
    // Clear existing options (keeping first default option)
    while (reportKioskSelect.options.length > 1) reportKioskSelect.remove(1);
    while (filterKioskSelect.options.length > 1) filterKioskSelect.remove(1);
    
    // Add kiosk options
    dummyKiosks.forEach(kiosk => {
        const option1 = document.createElement('option');
        option1.value = kiosk.id;
        option1.textContent = kiosk.name;
        reportKioskSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = kiosk.id;
        option2.textContent = kiosk.name;
        filterKioskSelect.appendChild(option2);
    });
}

// Function to handle form submission
function handleReportFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const kioskId = document.getElementById('report-kiosk').value;
    const kiosk = dummyKiosks.find(k => k.id === kioskId)?.name || 'Unknown Kiosk';
    const testDate = document.getElementById('report-date').value;
    const phLevel = parseFloat(document.getElementById('report-ph').value);
    const chlorineLevel = parseFloat(document.getElementById('report-chlorine').value);
    const turbidity = document.getElementById('report-turbidity').value ? parseFloat(document.getElementById('report-turbidity').value) : null;
    const temperature = document.getElementById('report-temperature').value ? parseFloat(document.getElementById('report-temperature').value) : null;
    const notes = document.getElementById('report-notes').value;
    
    // Create new report (in a real app, this would be saved to a database)
    const newReport = {
        id: `REP-${new Date().getFullYear()}-${(dummyReports.length + 1).toString().padStart(3, '0')}`,
        kiosk,
        kioskId,
        testDate,
        phLevel,
        chlorineLevel,
        turbidity,
        temperature,
        notes,
        status: 'pending',
        testedBy: 'Current User', // In a real app, this would be the logged-in user
        approvedBy: '',
        approvedAt: ''
    };
    
    // Add to dummy data (in a real app, this would be an API call)
    dummyReports.push(newReport);
    
    // Refresh table
    populateReportsTable();
    
    // Close modal
    document.getElementById('add-report-modal').classList.remove('show');
    
    // Reset form
    e.target.reset();
    
    // Show success message
    alert(`Report ${newReport.id} created successfully!`);
}

// Function to update pH and chlorine indicators
function updateQualityIndicators() {
    const phInput = document.getElementById('report-ph');
    const chlorineInput = document.getElementById('report-chlorine');
    const phIndicator = document.getElementById('ph-indicator');
    const chlorineIndicator = document.getElementById('chlorine-indicator');
    
    if (phInput.value) {
        const ph = parseFloat(phInput.value);
        if (ph < 6.5 || ph > 8.5) {
            phIndicator.style.backgroundColor = '#f44336'; // Red for out of range
        } else {
            phIndicator.style.backgroundColor = '#4CAF50'; // Green for good
        }
    }
    
    if (chlorineInput.value) {
        const chlorine = parseFloat(chlorineInput.value);
        if (chlorine < 0.2 || chlorine > 4.0) {
            chlorineIndicator.style.backgroundColor = '#f44336'; // Red for out of range
        } else {
            chlorineIndicator.style.backgroundColor = '#4CAF50'; // Green for good
        }
    }
}

// Initialize reports page
function initReportsPage() {
    populateReportsTable();
    populateKioskDropdowns();
    
    // Add event listeners
    document.getElementById('add-report-btn').addEventListener('click', () => {
        document.getElementById('add-report-modal').classList.add('show');
        // Set default date to today
        document.getElementById('report-date').valueAsDate = new Date();
    });
    
    document.getElementById('cancel-report').addEventListener('click', () => {
        document.getElementById('add-report-modal').classList.remove('show');
    });
    
    document.getElementById('add-report-form').addEventListener('submit', handleReportFormSubmit);
    
    // Add event listeners for quality indicators
    document.getElementById('report-ph').addEventListener('input', updateQualityIndicators);
    document.getElementById('report-chlorine').addEventListener('input', updateQualityIndicators);
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Close modals when clicking close button
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('show');
        });
    });
    
    // Filter functionality
    document.getElementById('filter-kiosk').addEventListener('change', applyFilters);
    document.getElementById('filter-status').addEventListener('change', applyFilters);
}

// Function to apply filters
function applyFilters() {
    const kioskFilter = document.getElementById('filter-kiosk').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    let filteredReports = dummyReports;
    
    if (kioskFilter) {
        filteredReports = filteredReports.filter(report => report.kioskId === kioskFilter);
    }
    
    if (statusFilter) {
        filteredReports = filteredReports.filter(report => report.status === statusFilter);
    }
    
    populateReportsTable(filteredReports);
}

// Call this function when the reports page loads
if (document.querySelector('.reports')) {
    initReportsPage();
}
// Sample dummy kiosks data
const dummyKiosks = [
    {
        id: 'kiosk1',
        name: 'AquaPure Kiosk',
        address: '123 Water Street, Nairobi',
        location: {
            lat: -1.2921,
            lng: 36.8219
        },
        license: 'WKA-2023-001',
        admin: {
            id: 'user1',
            name: 'John KioskAdmin'
        },
        status: 'approved',
        registrationDate: '2023-01-15',
        approvedDate: '2023-01-16',
        approvedBy: 'Admin User'
    },
    {
        id: 'kiosk2',
        name: 'FreshFlow Station',
        address: '456 River Road, Mombasa',
        location: {
            lat: -4.0435,
            lng: 39.6682
        },
        license: 'WKA-2023-002',
        admin: {
            id: 'user2',
            name: 'Jane WaterManager'
        },
        status: 'approved',
        registrationDate: '2023-02-10',
        approvedDate: '2023-02-12',
        approvedBy: 'Admin User'
    },
    {
        id: 'kiosk3',
        name: 'CleanH2O Point',
        address: '789 Lake View, Kisumu',
        location: {
            lat: -0.1022,
            lng: 34.7617
        },
        license: 'WKA-2023-003',
        admin: {
            id: 'user3',
            name: 'Mike WaterTech'
        },
        status: 'pending',
        registrationDate: '2023-03-05',
        approvedDate: '',
        approvedBy: ''
    },
    {
        id: 'kiosk4',
        name: 'PureDrop Center',
        address: '321 Ocean Avenue, Nakuru',
        location: {
            lat: -0.3031,
            lng: 36.0800
        },
        license: 'WKA-2023-004',
        admin: {
            id: 'user4',
            name: 'Sarah AquaAdmin'
        },
        status: 'approved',
        registrationDate: '2023-03-20',
        approvedDate: '2023-03-21',
        approvedBy: 'Admin User'
    },
    {
        id: 'kiosk5',
        name: 'BlueWave Kiosk',
        address: '654 Bay Street, Eldoret',
        location: {
            lat: 0.5143,
            lng: 35.2698
        },
        license: 'WKA-2023-005',
        admin: {
            id: 'user5',
            name: 'David WaterPro'
        },
        status: 'rejected',
        registrationDate: '2023-04-01',
        approvedDate: '2023-04-03',
        approvedBy: 'Admin User',
        rejectionReason: 'Incomplete documentation'
    },
    {
        id: 'kiosk6',
        name: 'CrystalSpring Outlet',
        address: '987 Well Lane, Thika',
        location: {
            lat: -1.0333,
            lng: 37.0833
        },
        license: 'WKA-2023-006',
        admin: {
            id: 'user6',
            name: 'Grace AquaCare'
        },
        status: 'pending',
        registrationDate: '2023-04-15',
        approvedDate: '',
        approvedBy: ''
    }
];

// Sample admins for dropdown
const dummyAdmins = [
    { id: 'user1', name: 'John KioskAdmin', email: 'john@aquapure.com' },
    { id: 'user2', name: 'Jane WaterManager', email: 'jane@freshflow.com' },
    { id: 'user3', name: 'Mike WaterTech', email: 'mike@cleanh2o.com' },
    { id: 'user4', name: 'Sarah AquaAdmin', email: 'sarah@puredrop.com' },
    { id: 'user5', name: 'David WaterPro', email: 'david@bluewave.com' },
    { id: 'user6', name: 'Grace AquaCare', email: 'grace@crystalspring.com' }
];

// Function to populate kiosks table
function populateKiosksTable(kiosks = dummyKiosks) {
    const kiosksTableBody = document.getElementById('kiosks-table-body');
    kiosksTableBody.innerHTML = '';

    // Update stats
    updateKioskStats(kiosks);

    kiosks.forEach(kiosk => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        let statusClass = '';
        if (kiosk.status === 'approved') statusClass = 'status-approved';
        else if (kiosk.status === 'pending') statusClass = 'status-pending';
        else if (kiosk.status === 'rejected') statusClass = 'status-rejected';
        
        row.innerHTML = `
            <td>${kiosk.name}</td>
            <td>${kiosk.address}</td>
            <td>${kiosk.license}</td>
            <td>${kiosk.admin.name}</td>
            <td><span class="status-badge ${statusClass}">${kiosk.status.toUpperCase()}</span></td>
            <td>
                <div class="action-buttons">
                    ${kiosk.status === 'pending' ? `
                    <button class="btn btn-success approve-kiosk" data-id="${kiosk.id}" title="Approve">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-danger reject-kiosk" data-id="${kiosk.id}" title="Reject">
                        <i class="fas fa-times"></i>
                    </button>
                    ` : ''}
                    <button class="btn btn-secondary view-kiosk" data-id="${kiosk.id}" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-primary edit-kiosk" data-id="${kiosk.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        
        kiosksTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.approve-kiosk').forEach(btn => {
        btn.addEventListener('click', () => showApprovalModal(btn.dataset.id, 'approve'));
    });
    
    document.querySelectorAll('.reject-kiosk').forEach(btn => {
        btn.addEventListener('click', () => showApprovalModal(btn.dataset.id, 'reject'));
    });
    
    document.querySelectorAll('.view-kiosk').forEach(btn => {
        btn.addEventListener('click', () => viewKioskDetails(btn.dataset.id));
    });
    
    document.querySelectorAll('.edit-kiosk').forEach(btn => {
        btn.addEventListener('click', () => editKiosk(btn.dataset.id));
    });
}

// Function to update kiosk statistics
function updateKioskStats(kiosks) {
    const approved = kiosks.filter(k => k.status === 'approved').length;
    const pending = kiosks.filter(k => k.status === 'pending').length;
    const rejected = kiosks.filter(k => k.status === 'rejected').length;
    
    document.getElementById('approved-kiosks').textContent = approved;
    document.getElementById('pending-kiosks').textContent = pending;
    document.getElementById('rejected-kiosks').textContent = rejected;
}

// Function to show approval modal
function showApprovalModal(kioskId, action) {
    const kiosk = dummyKiosks.find(k => k.id === kioskId);
    if (!kiosk) return;
    
    const modal = document.getElementById('approve-kiosk-modal');
    const content = document.getElementById('kiosk-details-content');
    
    // Format dates
    const regDate = new Date(kiosk.registrationDate).toLocaleDateString();
    const approvedDate = kiosk.approvedDate ? new Date(kiosk.approvedDate).toLocaleDateString() : 'Not approved yet';
    
    content.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Kiosk ID:</div>
            <div class="detail-value">${kiosk.id}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Kiosk Name:</div>
            <div class="detail-value">${kiosk.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Address:</div>
            <div class="detail-value">${kiosk.address}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">License:</div>
            <div class="detail-value">${kiosk.license}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Admin:</div>
            <div class="detail-value">${kiosk.admin.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Registered:</div>
            <div class="detail-value">${regDate}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Status:</div>
            <div class="detail-value"><span class="status-badge ${kiosk.status === 'approved' ? 'status-approved' : kiosk.status === 'pending' ? 'status-pending' : 'status-rejected'}">${kiosk.status.toUpperCase()}</span></div>
        </div>
        <div class="map-preview">
            <i class="fas fa-map-marked-alt"></i> Map Preview (${kiosk.location.lat}, ${kiosk.location.lng})
        </div>
    `;
    
    // Set up approval/rejection buttons
    document.getElementById('approve-kiosk-btn').onclick = () => {
        approveRejectKiosk(kioskId, 'approve');
        modal.classList.remove('show');
    };
    
    document.getElementById('reject-kiosk-btn').onclick = () => {
        const reason = prompt('Please enter reason for rejection:');
        if (reason) {
            approveRejectKiosk(kioskId, 'reject', reason);
            modal.classList.remove('show');
        }
    };
    
    document.getElementById('close-approval-modal').onclick = () => {
        modal.classList.remove('show');
    };
    
    modal.classList.add('show');
}

// Function to approve/reject kiosk
function approveRejectKiosk(kioskId, action, reason = '') {
    const kiosk = dummyKiosks.find(k => k.id === kioskId);
    if (!kiosk) return;
    
    if (action === 'approve') {
        kiosk.status = 'approved';
        kiosk.approvedDate = new Date().toISOString().split('T')[0];
        kiosk.approvedBy = 'Current Admin'; // In real app, use logged-in admin
        alert(`Kiosk ${kiosk.name} has been approved!`);
    } else {
        kiosk.status = 'rejected';
        kiosk.approvedDate = new Date().toISOString().split('T')[0];
        kiosk.approvedBy = 'Current Admin'; // In real app, use logged-in admin
        kiosk.rejectionReason = reason;
        alert(`Kiosk ${kiosk.name} has been rejected. Reason: ${reason}`);
    }
    
    // Refresh table
    populateKiosksTable();
}

// Function to view kiosk details
function viewKioskDetails(kioskId) {
    const kiosk = dummyKiosks.find(k => k.id === kioskId);
    if (!kiosk) return;
    
    // In a real app, you might open a detailed view modal
    alert(`Viewing details for kiosk: ${kiosk.name}\nAddress: ${kiosk.address}\nStatus: ${kiosk.status}`);
}

// Function to edit kiosk
function editKiosk(kioskId) {
    const kiosk = dummyKiosks.find(k => k.id === kioskId);
    if (!kiosk) return;
    
    // In a real app, you would open an edit form with the kiosk data
    alert(`Editing kiosk: ${kiosk.name}`);
}

// Function to populate admin dropdown
function populateAdminDropdown() {
    const adminSelect = document.getElementById('modal-kiosk-admin');
    
    // Clear existing options (keeping first default option)
    while (adminSelect.options.length > 1) adminSelect.remove(1);
    
    // Add admin options
    dummyAdmins.forEach(admin => {
        const option = document.createElement('option');
        option.value = admin.id;
        option.textContent = `${admin.name} (${admin.email})`;
        adminSelect.appendChild(option);
    });
}

// Function to handle form submission
function handleKioskFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('modal-kiosk-name').value;
    const address = document.getElementById('modal-kiosk-address').value;
    const latitude = parseFloat(document.getElementById('modal-kiosk-latitude').value);
    const longitude = parseFloat(document.getElementById('modal-kiosk-longitude').value);
    const license = document.getElementById('modal-kiosk-license').value;
    const adminId = document.getElementById('modal-kiosk-admin').value;
    
    // Find admin
    const admin = dummyAdmins.find(a => a.id === adminId);
    if (!admin) {
        alert('Please select a valid admin');
        return;
    }
    
    // Create new kiosk (in a real app, this would be saved to a database)
    const newKiosk = {
        id: `kiosk${dummyKiosks.length + 1}`,
        name,
        address,
        location: {
            lat: latitude,
            lng: longitude
        },
        license,
        admin: {
            id: admin.id,
            name: admin.name
        },
        status: 'pending',
        registrationDate: new Date().toISOString().split('T')[0],
        approvedDate: '',
        approvedBy: ''
    };
    
    // Add to dummy data (in a real app, this would be an API call)
    dummyKiosks.push(newKiosk);
    
    // Refresh table
    populateKiosksTable();
    
    // Close modal
    document.getElementById('add-kiosk-modal').classList.remove('show');
    
    // Reset form
    e.target.reset();
    
    // Show success message
    alert(`Kiosk ${name} registered successfully! Status: Pending Approval`);
}

// Function to apply filters
function applyKioskFilters() {
    const statusFilter = document.getElementById('filter-status').value;
    
    let filteredKiosks = dummyKiosks;
    
    if (statusFilter !== 'all') {
        filteredKiosks = filteredKiosks.filter(kiosk => kiosk.status === statusFilter);
    }
    
    populateKiosksTable(filteredKiosks);
}

// Initialize kiosk management page
function initKioskManagement() {
    populateKiosksTable();
    populateAdminDropdown();
    
    // Add event listeners
    document.getElementById('add-kiosk-btn').addEventListener('click', () => {
        document.getElementById('add-kiosk-modal').classList.add('show');
    });
    
    document.getElementById('cancel-kiosk').addEventListener('click', () => {
        document.getElementById('add-kiosk-modal').classList.remove('show');
    });
    
    document.getElementById('add-kiosk-form').addEventListener('submit', handleKioskFormSubmit);
    
    // Filter functionality
    document.getElementById('filter-status').addEventListener('change', applyKioskFilters);
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Close modals when clicking close button
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('show');
        });
    });
}

// Call this function when the kiosk management page loads
if (document.querySelector('.kiosk-management')) {
    initKioskManagement();
}
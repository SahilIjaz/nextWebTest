
// ===== AUTHENTICATION SYSTEM =====
// Professional-grade session & role-based access control

class AuthManager {
    constructor() {
        this.sessionKey = 'btms_user_session';
        this.init();
    }

    init() {
        // Check if user is already logged in
        const user = this.getUser();
        if (user) {
            this.hideAuthOverlay();
            this.setupRoleBasedUI(user);
            this.updateUserDisplay(user);
        } else {
            this.showAuthOverlay();
        }
    }

    getUser() {
        const session = sessionStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    setUser(userData) {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(userData));
    }

    clearSession() {
        sessionStorage.removeItem(this.sessionKey);
    }

    hideAuthOverlay() {
        const overlay = document.getElementById('auth-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.getElementById('sidebar').style.display = 'flex';
        document.getElementById('main').style.display = 'block';
    }

    showAuthOverlay() {
        const overlay = document.getElementById('auth-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
        document.getElementById('sidebar').style.display = 'none';
        document.getElementById('main').style.display = 'none';
    }

    setupRoleBasedUI(user) {
        // Hide role switch buttons - lock to the user's role
        const roleSwitch = document.getElementById('sidebar-role-switch');
        if (roleSwitch) {
            roleSwitch.style.display = 'none';
        }

        // Set the appropriate role interface
        if (user.role === 'admin') {
            this.setAdminInterface();
        } else {
            this.setStudentInterface();
        }
    }

    setStudentInterface() {
        // Show student nav, hide admin nav
        document.getElementById('nav-student').style.display = 'block';
        document.getElementById('nav-admin').style.display = 'none';
        document.getElementById('user-card-student').style.display = 'flex';
        document.getElementById('user-card-admin').style.display = 'none';

        // Show student dashboard
        currentRole = 'student';
        showPage('dashboard');
    }

    setAdminInterface() {
        // Show admin nav, hide student nav
        document.getElementById('nav-student').style.display = 'none';
        document.getElementById('nav-admin').style.display = 'block';
        document.getElementById('user-card-student').style.display = 'none';
        document.getElementById('user-card-admin').style.display = 'flex';

        // Show admin dashboard
        currentRole = 'admin';
        showPage('admin-dashboard');
    }

    updateUserDisplay(user) {
        const displayName = document.getElementById('user-display-name');
        if (displayName) {
            displayName.textContent = user.firstName + ' ' + user.lastName;
        }

        // Update appropriate user card avatar
        if (user.role === 'admin') {
            const adminAvatar = document.querySelector('#user-card-admin .user-avatar');
            if (adminAvatar) {
                const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
                adminAvatar.textContent = initials;
            }
        } else {
            const studentAvatar = document.querySelector('#user-card-student .user-avatar');
            if (studentAvatar) {
                const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
                studentAvatar.textContent = initials;
            }
        }
    }
}

// Initialize auth system
const authManager = new AuthManager();

// ===== AUTHENTICATION HANDLERS =====

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Reset error messages
    clearAuthErrors();

    // Validation
    if (!email) {
        showAuthError('login-email', 'Email is required');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthError('login-email', 'Please enter a valid email');
        return;
    }

    if (!password) {
        showAuthError('login-password', 'Password is required');
        return;
    }

    if (password.length < 8) {
        showAuthError('login-password', 'Password must be at least 8 characters');
        return;
    }

    performLogin(email, password);
}

function handleSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('signup-firstname').value.trim();
    const lastName = document.getElementById('signup-lastname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const studentId = document.getElementById('signup-studentid').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const accountType = document.querySelector('input[name="account-type"]:checked').value;
    const termsAccepted = document.getElementById('signup-terms').checked;

    // Reset error messages
    clearAuthErrors();

    // Validation
    if (!firstName) {
        showAuthError('signup-firstname', 'First name is required');
        return;
    }

    if (!lastName) {
        showAuthError('signup-lastname', 'Last name is required');
        return;
    }

    if (!email) {
        showAuthError('signup-email', 'Email is required');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthError('signup-email', 'Please enter a valid email');
        return;
    }

    if (accountType === 'student') {
        if (!studentId) {
            showAuthError('signup-studentid', 'Student ID is required');
            return;
        }

        if (!isValidStudentId(studentId)) {
            showAuthError('signup-studentid', 'Invalid student ID format (expected: XX-XXXXXX-XXX)');
            return;
        }
    }

    if (!phone) {
        showAuthError('signup-phone', 'Phone number is required');
        return;
    }

    if (!isValidPhone(phone)) {
        showAuthError('signup-phone', 'Please enter a valid phone number');
        return;
    }

    if (!password) {
        showAuthError('signup-password', 'Password is required');
        return;
    }

    if (!isStrongPassword(password)) {
        showAuthError('signup-password', 'Password must contain uppercase, lowercase, number, and special character');
        return;
    }

    if (password !== confirmPassword) {
        showAuthError('signup-confirm', 'Passwords do not match');
        return;
    }

    if (!termsAccepted) {
        showToast('⚠️ Please accept the Terms of Service');
        return;
    }

    performSignup({
        firstName,
        lastName,
        email,
        studentId: accountType === 'student' ? studentId : undefined,
        phone,
        password,
        role: accountType
    });
}

async function performLogin(email, password) {
    setButtonLoading('login-submit-btn', 'Signing in...');

    const result = await btmsApi.login(email, password);

    if (result.success && result.data.user) {
        const user = result.data.user;
        authManager.setUser(user);
        authManager.hideAuthOverlay();
        authManager.setupRoleBasedUI(user);
        authManager.updateUserDisplay(user);

        document.getElementById('login-form').reset();
        resetButtonLoading('login-submit-btn');

        showToast('✅ Welcome back, ' + user.firstName + '!');
    } else {
        resetButtonLoading('login-submit-btn');
        showToast('❌ Login failed: ' + (result.error || result.data?.error || 'Unknown error'));
        if (result.data?.error) {
            showAuthError('login-email', result.data.error);
        }
    }
}

async function performSignup(data) {
    setButtonLoading('signup-submit-btn', 'Creating account...');

    const result = await btmsApi.register(data);

    if (result.success && result.data.user) {
        const user = result.data.user;
        authManager.setUser(user);
        authManager.hideAuthOverlay();
        authManager.setupRoleBasedUI(user);
        authManager.updateUserDisplay(user);

        document.getElementById('signup-form').reset();
        resetButtonLoading('signup-submit-btn');

        showToast('🎉 Account created! Welcome to BTMS, ' + data.firstName + '!');
    } else {
        resetButtonLoading('signup-submit-btn');
        showToast('❌ Signup failed: ' + (result.error || result.data?.error || 'Unknown error'));
        if (result.data?.error) {
            showAuthError('signup-email', result.data.error);
        }
    }
}

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        await btmsApi.logout();
        authManager.clearSession();
        authManager.showAuthOverlay();

        document.getElementById('login-form').reset();
        document.getElementById('signup-form').reset();

        switchAuthForm('login');

        showToast('👋 Logged out successfully');
    }
}


function switchAuthForm(formType) {
    document.getElementById('auth-login').classList.remove('active');
    document.getElementById('auth-signup').classList.remove('active');

    if (formType === 'login') {
        document.getElementById('auth-login').classList.add('active');
    } else {
        document.getElementById('auth-signup').classList.add('active');
    }

    clearAuthErrors();
}

function togglePasswordVisibility(e, inputId) {
    const input = document.getElementById(inputId);
    const toggle = e.currentTarget;

    if (input.type === 'password') {
        input.type = 'text';
        toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
        input.type = 'password';
        toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
}

// ===== BUTTON LOADING STATE =====

function setButtonLoading(btnId, loadingText) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.classList.add('loading');
    btn.disabled = true;
    const loader = btn.querySelector('.btn-loader');
    if (loader && loadingText) {
        loader.style.display = 'flex';
        const textSpan = document.createElement('span');
        textSpan.textContent = loadingText;
        loader.appendChild(textSpan);
    }
}

function resetButtonLoading(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.classList.remove('loading');
    btn.disabled = false;
    const loader = btn.querySelector('.btn-loader');
    if (loader) {
        loader.style.display = 'none';
        // Remove any appended text spans
        const extraSpans = loader.querySelectorAll('span');
        extraSpans.forEach(s => s.remove());
    }
}

// ===== VALIDATION FUNCTIONS =====

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^(\+92|0)\d{10}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function isValidStudentId(id) {
    const re = /^\d{2}-\d{6}-\d{3}$/;
    return re.test(id);
}

function isStrongPassword(password) {
    if (password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
}

// ===== ERROR HANDLING =====

function showAuthError(elementId, message) {
    const errorEl = document.getElementById(elementId + '-error');
    if (errorEl) {
        errorEl.textContent = message;
    }

    const inputEl = document.getElementById(elementId);
    if (inputEl) {
        inputEl.style.borderColor = 'var(--red)';
    }
}

function clearAuthErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
    });

    document.querySelectorAll('.form-input, .form-select').forEach(el => {
        el.style.borderColor = '';
    });
}

// ===== PASSWORD STRENGTH INDICATOR =====

document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('signup-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const strength = getPasswordStrength(this.value);
            const strengthEl = document.getElementById('password-strength');
            const strengthText = document.getElementById('password-strength-text');

            // Always apply the class (including weak)
            strengthEl.className = 'password-strength';
            if (this.value.length > 0) {
                strengthEl.classList.add(strength);
            }

            // Update strength text label
            if (strengthText) {
                strengthText.className = 'password-strength-text';
                if (this.value.length > 0) {
                    strengthText.classList.add(strength);
                    const labels = { weak: 'Weak', medium: 'Medium', strong: 'Strong' };
                    strengthText.textContent = labels[strength] || '';
                } else {
                    strengthText.textContent = '';
                }
            }
        });
    }

    // Handle account type toggle for Student ID field visibility
    const accountTypeRadios = document.querySelectorAll('input[name="account-type"]');
    const studentIdGroup = document.getElementById('studentid-group');

    accountTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (studentIdGroup) {
                if (this.value === 'student') {
                    studentIdGroup.style.display = 'block';
                    document.getElementById('signup-studentid').required = true;
                } else {
                    studentIdGroup.style.display = 'none';
                    document.getElementById('signup-studentid').required = false;
                    document.getElementById('signup-studentid').value = '';
                }
            }
        });
    });
});

// ===== TOAST NOTIFICATION SYSTEM =====
let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== MOBILE SIDEBAR SYSTEM =====

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger-btn');
    if (!sidebar) return;

    sidebar.classList.add('open');
    if (hamburger) hamburger.classList.add('open');
    if (overlay) {
        overlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger-btn');
    if (!sidebar) return;

    sidebar.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    if (overlay) {
        overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function isMobileView() {
    return window.innerWidth <= 1024;
}

// ===== TOUCH SWIPE GESTURE FOR SIDEBAR =====

let touchStartX = 0;
let touchStartY = 0;
let touchCurrentX = 0;
let isSwiping = false;

document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
}, { passive: true });

document.addEventListener('touchmove', function (e) {
    if (!isSwiping) return;
    touchCurrentX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', function (e) {
    if (!isSwiping || !isMobileView()) {
        isSwiping = false;
        return;
    }

    const deltaX = touchCurrentX - touchStartX;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);

    // Only trigger if horizontal swipe is dominant (not vertical scroll)
    if (Math.abs(deltaX) > 60 && deltaY < 80) {
        const sidebar = document.getElementById('sidebar');
        const isOpen = sidebar && sidebar.classList.contains('open');

        // Swipe right to open (only from left edge)
        if (deltaX > 0 && touchStartX < 40 && !isOpen) {
            openSidebar();
        }

        // Swipe left to close
        if (deltaX < 0 && isOpen) {
            closeSidebar();
        }
    }

    isSwiping = false;
    touchCurrentX = 0;
}, { passive: true });

// ===== WINDOW RESIZE HANDLER =====

let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        if (!isMobileView()) {
            // Reset sidebar state on desktop
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 150);
});

// ===== NAVIGATION =====

let currentPage = 'dashboard';
let currentRole = 'student';

const pageTitles = {
    'dashboard': 'Student Dashboard',
    'routes': 'Bus Routes',
    'schedule': 'Bus Schedule',
    'fares': 'Fare Structure',
    'register': 'Transport Registration',
    'payment': 'Payment Status',
    'notifications': 'Notifications',
    'profile': 'My Profile',
    'admin-dashboard': 'Admin Dashboard',
    'admin-buses': 'Manage Buses',
    'admin-routes': 'Manage Routes',
    'admin-fares': 'Fare Management',
    'admin-students': 'Registered Students',
    'admin-payments': 'Payment Tracking',
    'admin-reports': 'Reports & Analytics',
    'admin-settings': 'Settings',
};

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const page = document.getElementById('page-' + id);
    if (page) page.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes("'" + id + "'")) {
            item.classList.add('active');
        }
    });

    document.getElementById('page-title').textContent = pageTitles[id] || id;
    currentPage = id;

    // Close notif panel
    document.getElementById('notif-panel').classList.remove('open');

    // Auto-close sidebar on mobile after navigation
    if (isMobileView()) {
        closeSidebar();
    }

    // Smooth scroll to top
    const mainEl = document.getElementById('main');
    if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (role === 'student') {
        document.getElementById('nav-student').style.display = 'block';
        document.getElementById('nav-admin').style.display = 'none';
        document.getElementById('user-card-student').style.display = 'flex';
        document.getElementById('user-card-admin').style.display = 'none';
        showPage('dashboard');
    } else {
        document.getElementById('nav-student').style.display = 'none';
        document.getElementById('nav-admin').style.display = 'block';
        document.getElementById('user-card-student').style.display = 'none';
        document.getElementById('user-card-admin').style.display = 'flex';
        showPage('admin-dashboard');
    }
}

// ===== TABS =====
function switchTab(btn, contentId, tabGroupId) {
    const tabGroup = document.getElementById(tabGroupId);
    tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const group = btn.closest('.page');
    const tabs = ['sched-morn', 'sched-eve'];
    tabs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const content = document.getElementById(contentId);
    if (content) content.style.display = 'block';
}

// ===== MODALS =====
function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    // Only restore overflow if sidebar isn't open
    if (!document.getElementById('sidebar')?.classList.contains('open')) {
        document.body.style.overflow = '';
    }
}

function closeModalOutside(e, id) {
    if (e.target === document.getElementById(id)) closeModal(id);
}

// ===== NOTIFICATIONS =====
function toggleNotif() {
    document.getElementById('notif-panel').classList.toggle('open');
}

document.addEventListener('click', function (e) {
    const panel = document.getElementById('notif-panel');
    if (!e.target.closest('.topbar-icon-btn') && panel.classList.contains('open')) {
        panel.classList.remove('open');
    }
});

// ===== ROUTE FILTER CHIPS =====
function filterRoutes(el, filter) {
    document.querySelectorAll('#route-chips .chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    showToast('Filtering routes: ' + filter);
}

// Keyboard shortcut: Escape closes modals & sidebar
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
        document.getElementById('notif-panel').classList.remove('open');
        if (isMobileView()) {
            closeSidebar();
        }
        document.body.style.overflow = '';
    }
});

// ===== PROFESSIONAL TIER 1 ENHANCEMENTS =====

// 1. Live Digital Clock
function updateClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    const now = new Date();
    
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    const timeString = `${hours}:${minutes} ${ampm}`;
    
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);

    clockEl.innerHTML = `
        <div class="clock-time">${timeString}</div>
        <div class="clock-date">${dateString}</div>
    `;
}

// 2. Animated Counter Stats
function animateCounters() {
    const counters = document.querySelectorAll('.page.active .stat-value[data-target]');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const divisor = parseFloat(counter.getAttribute('data-divisor')) || 1;
        const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
        const useComma = counter.getAttribute('data-format') === 'comma';
        
        counter.classList.add('counting');
        
        const duration = 1500; // ms
        const start = performance.now();
        
        // Easing function: easeOutExpo
        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            let progress = elapsed / duration;
            if (progress > 1) progress = 1;
            
            const currentVal = target * easeOutExpo(progress);
            let displayVal = currentVal / divisor;
            
            if (useComma) {
                displayVal = Math.floor(displayVal).toLocaleString('en-US');
            } else {
                displayVal = displayVal.toFixed(decimals);
            }
            
            counter.innerText = `${prefix}${displayVal}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.classList.remove('counting');
                // Final exact value formatting
                let finalVal = target / divisor;
                if (useComma) {
                    finalVal = Math.floor(finalVal).toLocaleString('en-US');
                } else {
                    finalVal = finalVal.toFixed(decimals);
                }
                counter.innerText = `${prefix}${finalVal}${suffix}`;
            }
        }
        
        requestAnimationFrame(update);
    });
}

// 3. Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    // Init Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Start Clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initial Counter Animation
    setTimeout(animateCounters, 300);
});

// Hook into existing showPage to re-trigger animations
const originalShowPage = showPage;
showPage = function(id) {
    originalShowPage(id);
    animateCounters();
};

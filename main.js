document.addEventListener('DOMContentLoaded', () => {
    // تفعيل قائمة الهواتف الذكية (Hamburger Menu)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

// دوال إرسال النماذج والتحقق
function handleMembership(e) {
    e.preventDefault();
    alert('تم إرسال طلب انخراطكم بنجاح إلى إدارة الجمعية! سنتواصل معكم قريباً.');
    e.target.reset();
    window.location.href = 'index.html';
}

function handleRegister(e) {
    e.preventDefault();
    alert('تم إنشاء الحساب المهني بنجاح! يمكنك الآن تسجيل الدخول للاستفادة من الخدمات.');
    e.target.reset();
    window.location.href = 'index.html';
}

// دالة تسجيل الدخول الآمن للإدارة
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    // بيانات الاعتماد الافتراضية الآمنة للإدارة
    if (user === 'admin_namaa' && pass === 'Olive2026@Attaouia') {
        sessionStorage.setItem('isLoggedIn', 'true');
        alert('مرحباً بك، تم التحقق من الهوية بنجاح. جاري توجيهك للوحة التحكم...');
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('خطأ في اسم المستخدم أو كلمة المرور الخاصة بالمشرف!');
    }
}

// حماية صفحة لوحة التحكم
function checkAdminAuth() {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        alert('عذراً، هذه الصفحة محمية ولا يمكن الوصول إليها إلا بعد تسجيل الدخول الآمن.');
        window.location.href = 'admin-login.html';
    }
}

function adminLogout() {
    sessionStorage.removeItem('isLoggedIn');
    alert('تم تسجيل الخروج بنجاح.');
    window.location.href = 'index.html';
}

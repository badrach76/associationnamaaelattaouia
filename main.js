document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // تهيئة البيانات الافتراضية إذا لم تكن موجودة
    if (!localStorage.getItem('namaa_requests')) {
        const initialRequests = [
            { id: 1, name: "محمد الراجي", mill: "معصرة الفلاح الخيرية", phone: "0661000000", address: "العطاوية المركز", type: "عصرية", license: "مرخص", status: "مقبول", user: "m_raji", pass: "raji2026" },
            { id: 2, name: "بوشعيب بنعمر", mill: "وحدة الزيتون المبارك", phone: "0662111222", address: "دوار أولاد عياد", type: "تقليدية", license: "في طور الإنجاز", status: "معالجة", user: "b_benomar", pass: "omar2026" },
            { id: 3, name: "حماني العمراني", mill: "معصرة العطاوية الكبرى", phone: "0670333444", address: "حي النهضة", type: "عصرية", license: "مرخص", status: "مقبول", user: "h_omrani", pass: "net2026" }
        ];
        localStorage.setItem('namaa_requests', JSON.stringify(initialRequests));
    }

    if (!localStorage.getItem('namaa_activities')) {
        const initialActivities = [
            { title: "ورشة تكوينية حول معالجة مياه المرجان", date: "2026-05-12", type: "منجز", desc: "لقاء تواصلي وتكويني مع أصحاب المعاصر لتقنيات تدبير المخلفات البيئية." },
            { title: "المعرض الجهوي لزيت الزيتون بقلعة السراغنة", date: "2026-11-20", type: "مستقبلي", desc: "المشاركة الجماعية لوحدات العطاوية لعرض وتثمين المنتوج المحلي." }
        ];
        localStorage.setItem('namaa_activities', JSON.stringify(initialActivities));
    }

    if (!localStorage.getItem('namaa_trainings')) {
        const initialTrainings = [
            { title: "دورة معايير السلامة الصحية والتعليب", date: "2026-06-05", trainer: "د. عبد الله الصقلي", target: "أرباب المعاصر والتقنيون" },
            { title: "الإدارة الضريبية والمحاسباتية للوحدات الموسمية", date: "2026-06-25", trainer: "خبير محاسباتي", target: "مسؤولو التسيير المالي" }
        ];
        localStorage.setItem('namaa_trainings', JSON.stringify(initialTrainings));
    }

    // عرض البيانات حسب الصفحة النشطة
    if (document.getElementById('admin-requests-table')) {
        renderAdminDashboard();
    }
    if (document.getElementById('public-activities-grid')) {
        renderPublicActivities();
    }
    if (document.getElementById('public-trainings-grid')) {
        renderPublicTrainings();
    }
    if (document.getElementById('user-dashboard-info')) {
        renderUserDashboard();
    }
});

// نموذج الانخراط
function handleMembership(e) {
    e.preventDefault();
    const name = document.getElementById('m-name').value;
    const mill = document.getElementById('m-mill').value;
    const phone = document.getElementById('m-phone').value;
    const address = document.getElementById('m-address').value;
    const type = document.getElementById('m-type').value;
    const license = document.getElementById('m-license').value;

    const requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    
    // توليد اسم المستخدم ورقم سري افتراضي
    const username = 'user_' + Math.floor(Math.random() * 9000 + 1000);
    const password = 'pass' + Math.floor(Math.random() * 9000 + 1000);

    const newReq = {
        id: Date.now(),
        name, mill, phone, address, type, license,
        status: 'معالجة',
        user: username,
        pass: password
    };

    requests.push(newReq);
    localStorage.setItem('namaa_requests', JSON.stringify(requests));

    alert('تم إرسال طلب انخراطكم بنجاح وهو الآن في طور المعالجة من طرف الإدارة.');
    e.target.reset();
    window.location.href = 'index.html';
}

// لوحة تحكم الإدارة وتغيير الحالات وتوليد رسائل الواتساب
function renderAdminDashboard() {
    const tableBody = document.getElementById('admin-requests-table');
    const requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    
    let html = '';
    requests.forEach(req => {
        let badgeClass = req.status === 'مقبول' ? 'badge-success' : (req.status === 'مرفوض' ? 'badge-danger' : 'badge-warning');
        
        let whatsappAction = req.status === 'مقبول' ? 
            `<a href="https://wa.me/${req.phone}?text=السلام%20عليكم%20السيد(ة)%20${req.name}،%20يسعدنا إبلاغكم بقبول طلب انخراطكم في جمعية نماء العطاوية. اسم المستخدم الخاص بكم هو: ${req.user} وكلمة المرور هي: ${req.pass}. يمكنكم الولوج للمنصة عبر رابط الحساب." target="_blank" style="background:#25d366; color:white; padding:5px 10px; border-radius:5px; text-decoration:none; font-size:0.8rem; display:inline-block; margin-top:5px;"><i class="fa-brands fa-whatsapp"></i> إرسال بيانات الدخول</a>` 
            : '';

        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 15px;">${req.name}</td>
                <td style="padding: 12px 15px;">${req.mill}</td>
                <td style="padding: 12px 15px; direction: ltr;">${req.phone}</td>
                <td style="padding: 12px 15px;">${req.type}</td>
                <td style="padding: 12px 15px;"><span style="background:#f4f4f4; padding:3px 8px; border-radius:4px; font-weight:700;">${req.license}</span></td>
                <td style="padding: 12px 15px;"><span class="badge ${badgeClass}">${req.status}</span></td>
                <td style="padding: 12px 15px;">
                    <select onchange="updateRequestStatus(${req.id}, this.value)" style="padding:5px; border-radius:5px; border:1px solid #ccc;">
                        <option value="معالجة" ${req.status==='معالجة'?'selected':''}>في طور المعالجة</option>
                        <option value="مقبول" ${req.status==='مقبول'?'selected':''}>قبول الطلب</option>
                        <option value="مرفوض" ${req.status==='مرفوض'?'selected':''}>رفض الطلب</option>
                    </select>
                    ${whatsappAction}
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function updateRequestStatus(id, newStatus) {
    let requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    requests = requests.map(r => {
        if (r.id === id) r.status = newStatus;
        return r;
    });
    localStorage.setItem('namaa_requests', JSON.stringify(requests));
    renderAdminDashboard();
    alert('تم تحديث حالة الطلب بنجاح.');
}

// إضافة نشاط جديد من طرف الإدارة
function handleAddActivity(e) {
    e.preventDefault();
    const title = document.getElementById('act-title').value;
    const date = document.getElementById('act-date').value;
    const type = document.getElementById('act-type').value;
    const desc = document.getElementById('act-desc').value;

    const activities = JSON.parse(localStorage.getItem('namaa_activities')) || [];
    activities.push({ title, date, type, desc });
    localStorage.setItem('namaa_activities', JSON.stringify(activities));

    alert('تم نشر النشاط بنجاح وأصبح متاحاً للعموم.');
    e.target.reset();
    location.reload();
}

// عرض الأنشطة للعموم
function renderPublicActivities() {
    const grid = document.getElementById('public-activities-grid');
    const activities = JSON.parse(localStorage.getItem('namaa_activities')) || [];
    let html = '';
    activities.forEach(act => {
        let badgeBg = act.type === 'منجز' ? 'var(--light-green)' : 'var(--accent-gold)';
        html += `
            <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.05); border-top:4px solid var(--primary-green);">
                <span style="background:${badgeBg}; color:white; padding:3px 10px; border-radius:15px; font-size:0.75rem; font-weight:700;">${act.type}</span>
                <h4 style="color:var(--primary-green); margin:15px 0 10px;">${act.title}</h4>
                <p style="font-size:0.85rem; color:#777; margin-bottom:10px;"><i class="fa-solid fa-calendar"></i> ${act.date}</p>
                <p style="color:#555; font-size:0.95rem;">${act.desc}</p>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// عرض التكوينات
function renderPublicTrainings() {
    const grid = document.getElementById('public-trainings-grid');
    const trainings = JSON.parse(localStorage.getItem('namaa_trainings')) || [];
    let html = '';
    trainings.forEach(tr => {
        html += `
            <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.05); border-top:4px solid var(--accent-gold);">
                <h4 style="color:var(--primary-green); margin-bottom:10px;"><i class="fa-solid fa-graduation-cap" style="color:var(--accent-gold);"></i> ${tr.title}</h4>
                <p style="font-size:0.9rem; color:#555; margin-bottom:8px;"><strong>المؤطر:</strong> ${tr.trainer}</p>
                <p style="font-size:0.9rem; color:#555; margin-bottom:8px;"><strong>الفئة المستهدفة:</strong> ${tr.target}</p>
                <p style="font-size:0.85rem; color:#777;"><i class="fa-solid fa-clock"></i> موعد الدورة: ${tr.date}</p>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// تسجيل دخول المشرف الآمن
function handleAdminLogin(e) {
    e.preventDefault();
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    if (u === 'admin_namaa' && p === 'Olive2026@Attaouia') {
        sessionStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('خطأ في اسم المستخدم أو كلمة المرور للمشرف!');
    }
}

// تسجيل دخول المنخرط
function handleUserLogin(e) {
    e.preventDefault();
    const u = document.getElementById('user-username').value;
    const p = document.getElementById('user-pass').value;

    const requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    const member = requests.find(r => r.user === u && r.pass === p && r.status === 'مقبول');

    if (member) {
        sessionStorage.setItem('currentMember', JSON.stringify(member));
        window.location.href = 'user-dashboard.html';
    } else {
        alert('بيانات الدخول غير صحيحة أو أن طلب انخراطكم لم يتم قبوله بعد من طرف الإدارة.');
    }
}

function renderUserDashboard() {
    const memberData = JSON.parse(sessionStorage.getItem('currentMember'));
    if (!memberData) {
        window.location.href = 'register.html';
        return;
    }
    document.getElementById('u-name-display').innerText = memberData.name;
    document.getElementById('u-mill-display').innerText = memberData.mill;
    document.getElementById('u-phone-display').innerText = memberData.phone;
    document.getElementById('u-type-display').innerText = memberData.type;
    document.getElementById('u-license-display').innerText = memberData.license;
}

function handleUpdateCredentials(e) {
    e.preventDefault();
    let member = JSON.parse(sessionStorage.getItem('currentMember'));
    const newUser = document.getElementById('new-user').value;
    const newPass = document.getElementById('new-pass').value;

    member.user = newUser;
    member.pass = newPass;
    sessionStorage.setItem('currentMember', JSON.stringify(member));

    let requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    requests = requests.map(r => r.phone === member.phone ? member : r);
    localStorage.setItem('namaa_requests', JSON.stringify(requests));

    alert('تم تحديث بيانات حسابك بنجاح.');
    e.target.reset();
}

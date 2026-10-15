document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // تهيئة البيانات مع التمييز بين المنخرطين القدامى والجدد وواجبات الانخراط المالية
    if (!localStorage.getItem('namaa_requests')) {
        localStorage.setItem('namaa_requests', JSON.stringify([
            { id: 1, name: "الحاج أحمد العمراني", mill: "معصرة النماء التقليدية", phone: "0661873214", address: "العطاوية المركز", type: "تقليدية", license: "مرخص", memberType: "قديم", annualFee: "مؤدى", contributions: "منخرط مؤسس", status: "مقبول", user: "ahmad_old", pass: "old2026", messages: [] },
            { id: 2, name: "محمد الراجي", mill: "معصرة الفلاح الحديثة", phone: "0661000000", address: "دوار الشوائفة", type: "عصرية", license: "في طور الإنجاز", memberType: "جديد", annualFee: "غير مؤدى", contributions: "لا توجد", status: "معالجة", user: "m_raji", pass: "raji2026", messages: [] }
        ]));
    }

    if (!localStorage.getItem('namaa_activities')) {
        localStorage.setItem('namaa_activities', JSON.stringify([
            { title: "ورشة تكوينية كبرى حول معالجة مياه المرجان", date: "2026-05-12", type: "منجز", desc: "لقاء تواصلي وتكويني مع أصحاب المعاصر لتقنيات تدبير المخلفات البيئية.", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80", video: "", link: "#" }
        ]));
    }

    if (!localStorage.getItem('namaa_trainings')) {
        localStorage.setItem('namaa_trainings', JSON.stringify([
            { title: "دورة معايير السلامة الصحية والتعليب (ONSSA)", date: "2026-06-05", trainer: "د. عبد الله الصقلي", target: "أرباب المعاصر والتقنيون", content: "محتوى حصري للمنخرطين: دليل مفصل حول شروط الاعتماد الصحي.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80", video: "", link: "#" }
        ]));
    }

    if (document.getElementById('admin-requests-table')) renderAdminDashboard();
    if (document.getElementById('public-activities-grid')) renderPublicActivities();
    if (document.getElementById('public-trainings-grid')) renderPublicTrainings();
    if (document.getElementById('member-trainings-grid')) renderMemberTrainings();
    if (document.getElementById('user-dashboard-info')) renderUserDashboard();
});

// طلب الانخراط (منخرط جديد)
function handleMembership(e) {
    e.preventDefault();
    const name = document.getElementById('m-name').value;
    const mill = document.getElementById('m-mill').value;
    const phone = document.getElementById('m-phone').value;
    const address = document.getElementById('m-address').value;
    const type = document.getElementById('m-type').value;
    const license = document.getElementById('m-license').value;

    const requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    const username = 'user_' + Math.floor(Math.random() * 9000 + 1000);
    const password = 'pass' + Math.floor(Math.random() * 9000 + 1000);

    requests.push({
        id: Date.now(),
        name, mill, phone, address, type, license,
        memberType: "جديد",
        annualFee: "غير مؤدى",
        contributions: "قيد التسوية",
        status: 'معالجة',
        user: username,
        pass: password,
        messages: []
    });
    localStorage.setItem('namaa_requests', JSON.stringify(requests));

    alert('تم إرسال طلب انخراطكم بنجاح وهو الآن في طور المعالجة.');
    e.target.reset();
    window.location.href = 'index.html';
}

// إضافة منخرط قديم مباشرة من طرف الإدارة
function handleAddOldMember(e) {
    e.preventDefault();
    const name = document.getElementById('old-name').value;
    const mill = document.getElementById('old-mill').value;
    const phone = document.getElementById('old-phone').value;
    const type = document.getElementById('old-type').value;
    const annualFee = document.getElementById('old-fee').value;

    const requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    const username = 'old_' + Math.floor(Math.random() * 9000 + 1000);
    const password = 'pass' + Math.floor(Math.random() * 9000 + 1000);

    requests.push({
        id: Date.now(),
        name, mill, phone,
        address: "العطاوية (منخرط قديم)",
        type, license: "مرخص",
        memberType: "قديم",
        annualFee,
        contributions: "منخرط معتمد مسبقاً",
        status: 'مقبول',
        user: username,
        pass: password,
        messages: []
    });
    localStorage.setItem('namaa_requests', JSON.stringify(requests));

    alert('تم تسشجيل المنخرط القديم وتفعيل حسابه بنجاح.');
    e.target.reset();
    renderAdminDashboard();
}

// عرض لوحة الإدارة مع التحكم في الواجبات والحالات
function renderAdminDashboard() {
    const tableBody = document.getElementById('admin-requests-table');
    const requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    let html = '';
    requests.forEach(req => {
        let badgeClass = req.status === 'مقبول' ? 'badge-success' : (req.status === 'مرفوض' ? 'badge-danger' : 'badge-warning');
        let typeBadge = req.memberType === 'قديم' ? '<span style="background:#e3f2fd; color:#1565c0; padding:2px 8px; border-radius:10px; font-size:0.75rem; font-weight:bold;">قديم</span>' : '<span style="background:#fff3e0; color:#ef6c00; padding:2px 8px; border-radius:10px; font-size:0.75rem; font-weight:bold;">جديد</span>';
        let feeBadge = req.annualFee === 'مؤدى' ? 'fin-paid' : 'fin-unpaid';

        let whatsappAction = req.status === 'مقبول' ? `<a href="https://wa.me/${req.phone}?text=السلام%20عليكم%20${req.name}،%20تم تفعيل حسابكم في جمعية نماء العطاوية. اسم المستخدم: ${req.user} | كلمة المرور: ${req.pass}" target="_blank" style="background:#25d366; color:white; padding:4px 8px; border-radius:5px; text-decoration:none; font-size:0.75rem; display:inline-block; margin-top:3px;"><i class="fa-brands fa-whatsapp"></i> إرسال البيانات</a>` : '';

        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${typeBadge} <br><strong>${req.name}</strong></td>
                <td style="padding: 10px;">${req.mill}</td>
                <td style="padding: 10px; direction: ltr;">${req.phone}</td>
                <td style="padding: 10px;">${req.type} (${req.license})</td>
                <td style="padding: 10px;">
                    <select onchange="updateMemberFee(${req.id}, this.value)" style="padding:3px; font-size:0.85rem;">
                        <option value="مؤدى" ${req.annualFee==='مؤدى'?'selected':''}>مؤدى</option>
                        <option value="غير مؤدى" ${req.annualFee==='غير مؤدى'?'selected':''}>غير مؤدى</option>
                    </select>
                </td>
                <td style="padding: 10px;"><span class="badge ${badgeClass}">${req.status}</span></td>
                <td style="padding: 10px;">
                    <select onchange="updateRequestStatus(${req.id}, this.value)" style="padding:3px; font-size:0.85rem;">
                        <option value="معالجة" ${req.status==='معالجة'?'selected':''}>معالجة</option>
                        <option value="مقبول" ${req.status==='مقبول'?'selected':''}>قبول</option>
                        <option value="مرفوض" ${req.status==='مرفوض'?'selected':''}>رفض</option>
                    </select>
                    ${whatsappAction}
                </td>
            </tr>`;
    });
    tableBody.innerHTML = html;
}

function updateRequestStatus(id, newStatus) {
    let requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    requests = requests.map(r => { if (r.id === id) r.status = newStatus; return r; });
    localStorage.setItem('namaa_requests', JSON.stringify(requests));
    renderAdminDashboard();
}

function updateMemberFee(id, feeStatus) {
    let requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    requests = requests.map(r => { if (r.id === id) r.annualFee = feeStatus; return r; });
    localStorage.setItem('namaa_requests', JSON.stringify(requests));
    renderAdminDashboard();
}

// إرسال رسالة جماعية لمجموعة الواتساب المهنية
function handleSendGroupWhatsApp(e) {
    e.preventDefault();
    const msg = document.getElementById('group-wa-msg').value;
    const groupLink = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(groupLink, '_blank');
    alert('جاري توجيهك لإرسال الإشعار لمجموعة الواتساب المهنية.');
    e.target.reset();
}

// إرسال استفسار من المنخرط إلى الإدارة
function handleMemberInquiry(e) {
    e.preventDefault();
    let member = JSON.parse(sessionStorage.getItem('currentMember'));
    const text = document.getElementById('inquiry-text').value;

    let requests = JSON.parse(localStorage.getItem('namaa_requests')) || [];
    requests = requests.map(r => {
        if (r.phone === member.phone) {
            if (!r.messages) r.messages = [];
            r.messages.push({ date: new Date().toLocaleDateString('ar-MA'), text });
            member = r;
        }
        return r;
    });

    localStorage.setItem('namaa_requests', JSON.stringify(requests));
    sessionStorage.setItem('currentMember', JSON.stringify(member));
    alert('تم إرسال استفسارك بنجاح إلى الإدارة.');
    e.target.reset();
    renderUserDashboard();
}

// إدارة الأنشطة والتكوينات
function handleAddActivity(e) {
    e.preventDefault();
    const title = document.getElementById('act-title').value;
    const date = document.getElementById('act-date').value;
    const type = document.getElementById('act-type').value;
    const desc = document.getElementById('act-desc').value;
    const image = document.getElementById('act-image').value || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80';
    const video = document.getElementById('act-video').value;
    const link = document.getElementById('act-link').value;

    const activities = JSON.parse(localStorage.getItem('namaa_activities')) || [];
    activities.push({ title, date, type, desc, image, video, link });
    localStorage.setItem('namaa_activities', JSON.stringify(activities));
    alert('تم نشر النشاط بنجاح.');
    e.target.reset();
    location.reload();
}

function handleAddTraining(e) {
    e.preventDefault();
    const title = document.getElementById('tr-title').value;
    const date = document.getElementById('tr-date').value;
    const trainer = document.getElementById('tr-trainer').value;
    const target = document.getElementById('tr-target').value;
    const content = document.getElementById('tr-content').value;
    const image = document.getElementById('tr-image').value || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    const video = document.getElementById('tr-video').value;
    const link = document.getElementById('tr-link').value;

    const trainings = JSON.parse(localStorage.getItem('namaa_trainings')) || [];
    trainings.push({ title, date, trainer, target, content, image, video, link });
    localStorage.setItem('namaa_trainings', JSON.stringify(trainings));
    alert('تم نشر التكوين بنجاح.');
    e.target.reset();
    location.reload();
}

function renderPublicActivities() {
    const grid = document.getElementById('public-activities-grid');
    const activities = JSON.parse(localStorage.getItem('namaa_activities')) || [];
    let html = '';
    activities.forEach(act => {
        let badgeBg = act.type === 'منجز' ? 'var(--light-green)' : 'var(--accent-gold)';
        let videoBox = act.video ? `<div style="margin-top:10px;"><iframe width="100%" height="200" src="${act.video}" frameborder="0" allowfullscreen style="border-radius:8px;"></iframe></div>` : '';
        let linkBox = act.link && act.link !== '#' ? `<div style="margin-top:10px;"><a href="${act.link}" target="_blank" style="color:var(--accent-gold); font-weight:700;"><i class="fa-solid fa-link"></i> رابط إضافي</a></div>` : '';

        html += `
            <div style="background:white; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.08); overflow:hidden; border-top:4px solid var(--primary-green);">
                <img src="${act.image}" alt="${act.title}" style="width:100%; height:200px; object-fit:cover;">
                <div style="padding:20px;">
                    <span style="background:${badgeBg}; color:white; padding:3px 10px; border-radius:15px; font-size:0.75rem; font-weight:700;">${act.type}</span>
                    <h4 style="color:var(--primary-green); margin:12px 0 8px; font-size:1.2rem;">${act.title}</h4>
                    <p style="font-size:0.85rem; color:#777; margin-bottom:10px;"><i class="fa-solid fa-calendar"></i> ${act.date}</p>
                    <p style="color:#555; font-size:0.95rem; margin-bottom:10px;">${act.desc}</p>
                    ${videoBox}
                    ${linkBox}
                </div>
            </div>`;
    });
    grid.innerHTML = html;
}

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
                <p style="font-size:0.85rem; color:#777; margin-bottom:15px;"><i class="fa-solid fa-clock"></i> موعد الدورة: ${tr.date}</p>
                <div style="background:var(--light-gold); padding:10px; border-radius:8px; font-size:0.85rem; text-align:center; color:var(--primary-green);">
                    <i class="fa-solid fa-lock"></i> المحتوى الحصري متاح للمنخرطين عبر <a href="register.html" style="color:var(--primary-green); font-weight:bold; text-decoration:underline;">فضاء المنخرط</a>
                </div>
            </div>`;
    });
    grid.innerHTML = html;
}

function renderMemberTrainings() {
    const grid = document.getElementById('member-trainings-grid');
    const trainings = JSON.parse(localStorage.getItem('namaa_trainings')) || [];
    let html = '';
    trainings.forEach(tr => {
        let videoBox = tr.video ? `<div style="margin-top:15px;"><iframe width="100%" height="220" src="${tr.video}" frameborder="0" allowfullscreen style="border-radius:8px;"></iframe></div>` : '';
        let imgBox = tr.image ? `<img src="${tr.image}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px;">` : '';

        html += `
            <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.08); border-top:4px solid var(--light-green);">
                ${imgBox}
                <h4 style="color:var(--primary-green); margin-bottom:10px;">${tr.title}</h4>
                <p style="font-size:0.85rem; color:#777; margin-bottom:8px;"><i class="fa-solid fa-user-tie"></i> المؤطر: ${tr.trainer} | <i class="fa-solid fa-calendar"></i> ${tr.date}</p>
                <p style="color:#444; font-size:0.95rem; margin-bottom:15px; background:var(--bg-light); padding:12px; border-radius:8px;">${tr.content}</p>
                ${videoBox}
            </div>`;
    });
    grid.innerHTML = html;
}

function handleAdminLogin(e) {
    e.preventDefault();
    if (document.getElementById('admin-user').value === 'admin_namaa' && document.getElementById('admin-pass').value === 'Olive2026@Attaouia') {
        sessionStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin-dashboard.html';
    } else { alert('بيانات المشرف غير صحيحة!'); }
}

function handleUserLogin(e) {
    e.preventDefault();
    const u = document.getElementById('user-username').value;
    const p = document.getElementById('user-pass').value;
    const member = (JSON.parse(localStorage.getItem('namaa_requests')) || []).find(r => r.user === u && r.pass === p && r.status === 'مقبول');
    if (member) {
        sessionStorage.setItem('currentMember', JSON.stringify(member));
        window.location.href = 'user-dashboard.html';
    } else { alert('بيانات الدخول غير صحيحة أو الطلب لم يُقبل بعد.'); }
}

function renderUserDashboard() {
    const member = JSON.parse(sessionStorage.getItem('currentMember'));
    if (!member) { window.location.href = 'register.html'; return; }
    document.getElementById('u-name-display').innerText = member.name;
    document.getElementById('u-mill-display').innerText = member.mill;
    document.getElementById('u-phone-display').innerText = member.phone;
    document.getElementById('u-type-display').innerText = member.type;
    document.getElementById('u-license-display').innerText = member.license;
    
    // عرض حالة واجب الانخراط السنوي
    const feeElem = document.getElementById('u-fee-status');
    if (feeElem) {
        feeElem.innerHTML = member.annualFee === 'مؤدى' ? 
            '<span class="financial-badge fin-paid">مؤدى (خالص)</span>' : 
            '<span class="financial-badge fin-unpaid">غير مؤدى (في انتظار الأداء)</span>';
    }

    // عرض صندوق الردود والاستفسارات الموجهة للإدارة
    const chatContainer = document.getElementById('member-inquiries-box');
    if (chatContainer && member.messages) {
        let msgHtml = '';
        if (member.messages.length === 0) {
            msgHtml = '<p style="color:#777; font-size:0.9rem;">لا توجد استفسارات سابقة.</p>';
        } else {
            member.messages.forEach(m => {
                msgHtml += `<div class="chat-message"><small style="color:#999; display:block;">${m.date}</small> ${m.text}</div>`;
            });
        }
        chatContainer.innerHTML = msgHtml;
    }
}

function handleUpdateCredentials(e) {
    e.preventDefault();
    let member = JSON.parse(sessionStorage.getItem('currentMember'));
    member.user = document.getElementById('new-user').value;
    member.pass = document.getElementById('new-pass').value;
    sessionStorage.setItem('currentMember', JSON.stringify(member));
    let requests = (JSON.parse(localStorage.getItem('namaa_requests')) || []).map(r => r.phone === member.phone ? member : r);
    localStorage.setItem('namaa_requests', JSON.stringify(requests));
    alert('تم تحديث بيانات الحساب بنجاح.');
    e.target.reset();
}

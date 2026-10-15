document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    if (document.getElementById('admin-members-table')) loadAdminData();
    if (document.getElementById('public-activities-grid')) loadPublicActivities();
    if (document.getElementById('public-trainings-grid')) loadPublicTrainings();
    if (document.getElementById('member-trainings-grid')) loadMemberTrainings();
    if (document.getElementById('user-dashboard-info')) loadUserDashboard();
});

// 1. طلب انخراط جديد (جديد)
async function handleMembership(e) {
    e.preventDefault();
    const name = document.getElementById('m-name').value;
    const mill = document.getElementById('m-mill').value;
    const phone = document.getElementById('m-phone').value;
    const address = document.getElementById('m-address').value;
    const type = document.getElementById('m-type').value;
    const license = document.getElementById('m-license').value;
    const username = 'user_' + Math.floor(Math.random() * 9000 + 1000);
    const password = 'pass' + Math.floor(Math.random() * 9000 + 1000);

    const { error } = await supabase.from('members').insert([{
        name, mill, phone, address, type, license,
        member_type: 'جديد', annual_fee: 'غير مؤدى', status: 'معالجة',
        username, password
    }]);

    if (error) { alert('حدث خطأ أثناء إرسال الطلب: ' + error.message); } 
    else {
        alert('تم إرسال طلب انخراطكم بنجاح وهو قيد المعالجة.');
        e.target.reset();
        window.location.href = 'index.html';
    }
}

// 2. تسجيل منخرط قديم من طرف الإدارة
async function handleAddOldMember(e) {
    e.preventDefault();
    const name = document.getElementById('old-name').value;
    const mill = document.getElementById('old-mill').value;
    const phone = document.getElementById('old-phone').value;
    const type = document.getElementById('old-type').value;
    const annual_fee = document.getElementById('old-fee').value;
    const username = 'old_' + Math.floor(Math.random() * 9000 + 1000);
    const password = 'pass' + Math.floor(Math.random() * 9000 + 1000);

    const { error } = await supabase.from('members').insert([{
        name, mill, phone, address: 'العطاوية (قديم)', type, license: 'مرخص',
        member_type: 'قديم', annual_fee, status: 'مقبول', username, password
    }]);

    if (error) { alert('خطأ: ' + error.message); }
    else {
        alert('تم تسجيل المنخرط القديم بنجاح.');
        e.target.reset();
        loadAdminData();
    }
}

// تحميل وتسيير بيانات الإدارة (حذف وتعديل المنخرطين، الأنشطة، التكوينات)
async function loadAdminData() {
    // جلب المنخرطين
    const { data: members, error } = await supabase.from('members').select('*').order('id', { ascending: false });
    if (!error && document.getElementById('admin-members-table')) {
        let html = '';
        members.forEach(m => {
            let badgeClass = m.status === 'مقبول' ? 'badge-success' : (m.status === 'مرفوض' ? 'badge-danger' : 'badge-warning');
            let typeBadge = m.member_type === 'قديم' ? '<span style="background:#e3f2fd; color:#1565c0; padding:2px 6px; border-radius:8px; font-size:0.7rem;">قديم</span>' : '<span style="background:#fff3e0; color:#ef6c00; padding:2px 6px; border-radius:8px; font-size:0.7rem;">جديد</span>';
            let waBtn = m.status === 'مقبول' ? `<a href="https://wa.me/${m.phone}?text=مرحباً%20${m.name}،%20تم تفعيل حسابكم بجمعية نماء العطاوية. المستخدم: ${m.username} | الرمز: ${m.password}" target="_blank" style="background:#25d366; color:white; padding:3px 6px; border-radius:4px; text-decoration:none; font-size:0.75rem; display:inline-block; margin-top:3px;"><i class="fa-brands fa-whatsapp"></i> إرسال عبر واتساب</a>` : '';

            html += `
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:10px;">${typeBadge} <strong>${m.name}</strong></td>
                    <td style="padding:10px;">${m.mill}</td>
                    <td style="padding:10px; direction:ltr;">${m.phone}</td>
                    <td style="padding:10px;">
                        <select onchange="updateMemberField(${m.id}, 'annual_fee', this.value)" style="padding:3px;">
                            <option value="مؤدى" ${m.annual_fee==='مؤدى'?'selected':''}>مؤدى</option>
                            <option value="غير مؤدى" ${m.annual_fee==='غير مؤدى'?'selected':''}>غير مؤدى</option>
                        </select>
                    </td>
                    <td style="padding:10px;"><span class="badge ${badgeClass}">${m.status}</span></td>
                    <td style="padding:10px;">
                        <select onchange="updateMemberField(${m.id}, 'status', this.value)" style="padding:3px;">
                            <option value="معالجة" ${m.status==='معالجة'?'selected':''}>معالجة</option>
                            <option value="مقبول" ${m.status==='مقبول'?'selected':''}>قبول</option>
                            <option value="مرفوض" ${m.status==='مرفوض'?'selected':''}>رفض</option>
                        </select>
                        ${waBtn}
                    </td>
                    <td style="padding:10px;">
                        <button class="btn-danger" onclick="deleteRecord('members', ${m.id})"><i class="fa-solid fa-trash"></i> حذف</button>
                    </td>
                </tr>`;
        });
        document.getElementById('admin-members-table').innerHTML = html;
    }

    // جلب الأنشطة للتعديل أو الحذف
    const { data: acts } = await supabase.from('activities').select('*').order('id', { ascending: false });
    if (acts && document.getElementById('admin-activities-table')) {
        let actHtml = '';
        acts.forEach(a => {
            actHtml += `
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:10px;">${a.title}</td>
                    <td style="padding:10px;">${a.date}</td>
                    <td style="padding:10px;">${a.type}</td>
                    <td style="padding:10px;">
                        <button class="btn-danger" onclick="deleteRecord('activities', ${a.id})"><i class="fa-solid fa-trash"></i> حذف</button>
                    </td>
                </tr>`;
        });
        document.getElementById('admin-activities-table').innerHTML = actHtml;
    }

    // جلب التكوينات للحذف
    const { data: trs } = await supabase.from('trainings').select('*').order('id', { ascending: false });
    if (trs && document.getElementById('admin-trainings-table')) {
        let trHtml = '';
        trs.forEach(t => {
            trHtml += `
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:10px;">${t.title}</td>
                    <td style="padding:10px;">${t.trainer}</td>
                    <td style="padding:10px;">${t.date}</td>
                    <td style="padding:10px;">
                        <button class="btn-danger" onclick="deleteRecord('trainings', ${t.id})"><i class="fa-solid fa-trash"></i> حذف</button>
                    </td>
                </tr>`;
        });
        document.getElementById('admin-trainings-table').innerHTML = trHtml;
    }
}

// دالة عامة لتحديث الحقول في Supabase
async function updateMemberField(id, field, val) {
    const { error } = await supabase.from('members').update({ [field]: val }).eq('id', id);
    if (error) alert('خطأ في التحديث: ' + error.message);
    else loadAdminData();
}

// دالة عامة لحذف سجل من أي جدول
async function deleteRecord(table, id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر نهائياً؟')) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert('خطأ في الحذف: ' + error.message);
        else {
            alert('تم الحذف بنجاح.');
            loadAdminData();
        }
    }
}

// نشر نشاط جديد
async function handleAddActivity(e) {
    e.preventDefault();
    const title = document.getElementById('act-title').value;
    const date = document.getElementById('act-date').value;
    const type = document.getElementById('act-type').value;
    const description = document.getElementById('act-desc').value;
    const image_url = document.getElementById('act-image').value || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80';
    const video_url = document.getElementById('act-video').value;
    const link_url = document.getElementById('act-link').value;

    const { error } = await supabase.from('activities').insert([{ title, date, type, description, image_url, video_url, link_url }]);
    if (error) alert('خطأ: ' + error.message);
    else { alert('تم نشر النشاط بنجاح.'); e.target.reset(); loadAdminData(); }
}

// نشر تكوين حصري جديد
async function handleAddTraining(e) {
    e.preventDefault();
    const title = document.getElementById('tr-title').value;
    const date = document.getElementById('tr-date').value;
    const trainer = document.getElementById('tr-trainer').value;
    const target = document.getElementById('tr-target').value;
    const content = document.getElementById('tr-content').value;
    const image_url = document.getElementById('tr-image').value || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    const video_url = document.getElementById('tr-video').value;

    const { error } = await supabase.from('trainings').insert([{ title, date, trainer, target, content, image_url, video_url }]);
    if (error) alert('خطأ: ' + error.message);
    else { alert('تم نشر التكوين بنجاح.'); e.target.reset(); loadAdminData(); }
}

// عرض الأنشطة للعموم
async function loadPublicActivities() {
    const grid = document.getElementById('public-activities-grid');
    const { data: acts } = await supabase.from('activities').select('*').order('id', { ascending: false });
    if (!acts) return;
    let html = '';
    acts.forEach(act => {
        let badgeBg = act.type === 'منجز' ? 'var(--light-green)' : 'var(--accent-gold)';
        let videoBox = act.video_url ? `<div style="margin-top:10px;"><iframe width="100%" height="200" src="${act.video_url}" frameborder="0" allowfullscreen style="border-radius:8px;"></iframe></div>` : '';
        let linkBox = act.link_url && act.link_url !== '#' ? `<div style="margin-top:10px;"><a href="${act.link_url}" target="_blank" style="color:var(--accent-gold); font-weight:700;"><i class="fa-solid fa-link"></i> رابط تفصيلي</a></div>` : '';

        html += `
            <div style="background:white; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.08); overflow:hidden; border-top:4px solid var(--primary-green);">
                <img src="${act.image_url}" alt="${act.title}" style="width:100%; height:200px; object-fit:cover;">
                <div style="padding:20px;">
                    <span style="background:${badgeBg}; color:white; padding:3px 10px; border-radius:15px; font-size:0.75rem; font-weight:700;">${act.type}</span>
                    <h4 style="color:var(--primary-green); margin:12px 0 8px; font-size:1.2rem;">${act.title}</h4>
                    <p style="font-size:0.85rem; color:#777; margin-bottom:10px;"><i class="fa-solid fa-calendar"></i> ${act.date}</p>
                    <p style="color:#555; font-size:0.95rem; margin-bottom:10px;">${act.description}</p>
                    ${videoBox} ${linkBox}
                </div>
            </div>`;
    });
    grid.innerHTML = html;
}

// عرض التكوينات العامة
async function loadPublicTrainings() {
    const grid = document.getElementById('public-trainings-grid');
    const { data: trs } = await supabase.from('trainings').select('*').order('id', { ascending: false });
    if (!trs) return;
    let html = '';
    trs.forEach(tr => {
        html += `
            <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.05); border-top:4px solid var(--accent-gold);">
                <h4 style="color:var(--primary-green); margin-bottom:10px;"><i class="fa-solid fa-graduation-cap" style="color:var(--accent-gold);"></i> ${tr.title}</h4>
                <p style="font-size:0.9rem; color:#555; margin-bottom:8px;"><strong>المؤطر:</strong> ${tr.trainer}</p>
                <p style="font-size:0.9rem; color:#555; margin-bottom:8px;"><strong>الفئة:</strong> ${tr.target}</p>
                <p style="font-size:0.85rem; color:#777; margin-bottom:15px;"><i class="fa-solid fa-clock"></i> ${tr.date}</p>
                <div style="background:var(--light-gold); padding:10px; border-radius:8px; font-size:0.85rem; text-align:center; color:var(--primary-green);">
                    <i class="fa-solid fa-lock"></i> المحتوى الحصري متاح للمنخرطين عبر <a href="register.html" style="color:var(--primary-green); font-weight:bold;">فضاء المنخرط</a>
                </div>
            </div>`;
    });
    grid.innerHTML = html;
}

// عرض التكوينات الحصرية للمنخرط
async function loadMemberTrainings() {
    const grid = document.getElementById('member-trainings-grid');
    const { data: trs } = await supabase.from('trainings').select('*').order('id', { ascending: false });
    if (!trs) return;
    let html = '';
    trs.forEach(tr => {
        let videoBox = tr.video_url ? `<div style="margin-top:15px;"><iframe width="100%" height="220" src="${tr.video_url}" frameborder="0" allowfullscreen style="border-radius:8px;"></iframe></div>` : '';
        let imgBox = tr.image_url ? `<img src="${tr.image_url}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px;">` : '';

        html += `
            <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.08); border-top:4px solid var(--light-green);">
                ${imgBox}
                <h4 style="color:var(--primary-green); margin-bottom:10px;">${tr.title}</h4>
                <p style="font-size:0.85rem; color:#777; margin-bottom:8px;"><i class="fa-solid fa-user-tie"></i> المؤطر: ${tr.trainer} | ${tr.date}</p>
                <p style="color:#444; font-size:0.95rem; margin-bottom:15px; background:var(--bg-light); padding:12px; border-radius:8px;">${tr.content}</p>
                ${videoBox}
            </div>`;
    });
    grid.innerHTML = html;
}

// تسجيل دخول المشرف والمنخرط
function handleAdminLogin(e) {
    e.preventDefault();
    if (document.getElementById('admin-user').value === 'admin_namaa' && document.getElementById('admin-pass').value === 'Olive2026@Attaouia') {
        sessionStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin-dashboard.html';
    } else { alert('بيانات المشرف غير صحيحة!'); }
}

async function handleUserLogin(e) {
    e.preventDefault();
    const u = document.getElementById('user-username').value;
    const p = document.getElementById('user-pass').value;

    const { data: members, error } = await supabase.from('members').select('*').eq('username', u).eq('password', p).eq('status', 'مقبول');
    if (!error && members && members.length > 0) {
        sessionStorage.setItem('currentMember', JSON.stringify(members[0]));
        window.location.href = 'user-dashboard.html';
    } else { alert('بيانات الدخول غير صحيحة أو الطلب لم يُقبل بعد.'); }
}

async function loadUserDashboard() {
    const member = JSON.parse(sessionStorage.getItem('currentMember'));
    if (!member) { window.location.href = 'register.html'; return; }
    
    document.getElementById('u-name-display').innerText = member.name;
    document.getElementById('u-mill-display').innerText = member.mill;
    document.getElementById('u-phone-display').innerText = member.phone;
    document.getElementById('u-type-display').innerText = member.type;
    document.getElementById('u-license-display').innerText = member.license;

    const feeElem = document.getElementById('u-fee-status');
    if (feeElem) {
        feeElem.innerHTML = member.annual_fee === 'مؤدى' ? 
            '<span class="badge badge-success">مؤدى (خالص)</span>' : 
            '<span class="badge badge-danger">غير مؤدى</span>';
    }

    // جلب استفسارات المنخرط
    const { data: inquiries } = await supabase.from('inquiries').select('*').eq('member_phone', member.phone);
    const chatContainer = document.getElementById('member-inquiries-box');
    if (chatContainer && inquiries) {
        let msgHtml = inquiries.length === 0 ? '<p style="color:#777; font-size:0.9rem;">لا توجد استفسارات سابقة.</p>' : '';
        inquiries.forEach(m => {
            msgHtml += `<div style="background:white; padding:8px 12px; border-radius:6px; margin-bottom:8px; box-shadow:0 1px 3px rgba(0,0,0,0.05);"><small style="color:#999; display:block;">${new Date(m.created_at).toLocaleDateString()}</small>${m.message}</div>`;
        });
        chatContainer.innerHTML = msgHtml;
    }
}

// إرسال استفسار للإدارة
async function handleMemberInquiry(e) {
    e.preventDefault();
    const member = JSON.parse(sessionStorage.getItem('currentMember'));
    const message = document.getElementById('inquiry-text').value;

    const { error } = await supabase.from('inquiries').insert([{ member_phone: member.phone, message }]);
    if (error) alert('خطأ في الإرسال: ' + error.message);
    else { alert('تم إرسال استفسارك بنجاح.'); e.target.reset(); loadUserDashboard(); }
}

// استبدل الروابط والمفاتيح الخاصة بمشروعك في Supabase
const SUPABASE_URL = 'https://yogeqsykljpuipanybei.supbase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_46eo92Prv6Ks0eYscB3OjA_DjlNAKBl';

// تهيئة عميل Supabase (تأكد من تضمين سكريبت مكتبة Supabase في ملفات HTML)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

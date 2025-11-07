// src/data/questions.js
const questions = [
    {
        id: 'q_experience',
        type: 'rating',
        title: 'میزان رضایت کلی شما از تجربه کاربری چقدر است؟',
        help: 'از ۱ (خیلی بد) تا ۵ (عالی) امتیاز دهید.'
    },
    {
        id: 'q_favorite',
        type: 'single',
        title: 'کدام بخش برای شما مفیدتر بود؟',
        options: [
            { value: 'speed', label: 'سرعت و کارایی' },
            { value: 'ui', label: 'رابط کاربری' },
            { value: 'content', label: 'محتوا' },
            { value: 'support', label: 'پشتیبانی' },
        ],
    },
    {
        id: 'q_features',
        type: 'multi',
        title: 'چه قابلیت‌هایی را بیشتر می‌پسندید؟ (چند انتخاب)',
        options: [
            { value: 'dark', label: 'حالت تیره' },
            { value: 'perf', label: 'بهینه‌سازی سرعت' },
            { value: 'notif', label: 'اعلان‌ها' },
            { value: 'backup', label: 'پشتیبان‌گیری' },
        ],
    },
    {
        id: 'q_text',
        type: 'text',
        title: 'پیشنهاد یا انتقاد خود را بنویسید',
        placeholder: 'نظرتان را اینجا وارد کنید...'
    }
];


export default questions;
document.addEventListener('DOMContentLoaded', function () {
    const phrases = [
        ", не порахувати!",
        ", хто куди, а я - в Карпати!",
        ", треба наливати!",
        ", але нам насрати?",
        ", треба виправляти!",
        ", як не заридати?",
        ", всіх не подолати!"
    ];

    const titleEl = document.querySelector('.pagetitle');
    titleEl.textContent += phrases[Math.floor(Math.random() * phrases.length)];
});
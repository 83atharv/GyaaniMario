const popupBox = document.getElementById('popup-box');
const levels = document.querySelectorAll('.level');

levels.forEach(level => {
    level.addEventListener('mouseenter', (e) => {
        const info = level.getAttribute('data-info');
        popupBox.textContent = info;
        popupBox.style.display = 'block';
        popupBox.style.left = `${e.pageX + 10}px`;
        popupBox.style.top = `${e.pageY + 10}px`;
    });

    level.addEventListener('mousemove', (e) => {
        popupBox.style.left = `${e.pageX + 10}px`;
        popupBox.style.top = `${e.pageY + 10}px`;
    });

    level.addEventListener('mouseleave', () => {
        popupBox.style.display = 'none';
    });
});

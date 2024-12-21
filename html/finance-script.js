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


// Check if dark mode preference is saved in localStorage
window.addEventListener('load', function () {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});

// Toggle dark mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    if (isDarkMode) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

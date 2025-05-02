// custom.js
document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.top-header');
    var lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.transform = 'translateX(-50%) translateY(-100%)';
            header.style.opacity = '0';
        } else {
            // Scrolling up
            header.style.transform = 'translateX(-50%) translateY(0)';
            header.style.opacity = '1';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }, false);
});

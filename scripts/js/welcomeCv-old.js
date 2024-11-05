document.querySelectorAll('.btn-view-cv').forEach(button => {
    button.addEventListener('click', () => {
        alert('سيتم عرض السيرة الذاتية هنا');
    });
});
let swiper = new Swiper('.slide-content', {
    slidesPerView: 3,
    spaceBetween: 25,
    centerSlide: 'true',
    fade: 'true',
    gragCursor: 'true',
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    loop: true,
    grabCursor: true,
    breakpoints: {
        100: {
            slidesPerView: 1,

        },
        570: {
            slidesPerView: 2,

        },
        970: {
            slidesPerView: 3,

        }

    }
});
const navbar = document.querySelector('.navbar');

function handleScroll() {
    if (window.scrollY > 0) {
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
    }
}

window.addEventListener('scroll', handleScroll);

// Elements
const steps = document.querySelectorAll('.step');
const mainImage = document.getElementById('main-image');

let currentIndex = 0;
let slideshowInterval;

// Images Array
const images = [
    "../static/images/data.jpg",  // Image 1
    "../static/images/cv-temp2.jpg",  // Image 2
    "../static/images/cv-temp2.jpg"   // Image 3
];

function updateImage(index) {
    mainImage.classList.remove('active');  // Hide current image
    setTimeout(() => {
        mainImage.src = images[index];     // Update the image source
        mainImage.classList.add('active'); // Show the new image with animation
    }, 500);
}

steps.forEach((step, index) => {
    step.addEventListener('click', () => {
        updateImage(index);
    });
});
function startSlideshow() {
    slideshowInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length; // Move to the next image
        updateImage(currentIndex);
    }, 10000);
}
// Show the first image immediately when the page loads
window.addEventListener('DOMContentLoaded', () => {
    updateImage(0); // Display the first image
    setTimeout(startSlideshow, 300); // Start slideshow after 3 seconds delay
});
function stopSlideshow() {
    clearInterval(slideshowInterval);
}

startSlideshow();

steps.forEach((step, index) => {
    step.addEventListener('click', () => {
        stopSlideshow();
        updateImage(index);
        currentIndex = index;
        setTimeout(startSlideshow, 5000);
    });
});
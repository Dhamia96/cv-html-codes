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
let isImageLoading = false; // Track if image is currently loading

// Pass image URLs from Blade to JavaScript
const images = [
    imagePaths.data,
    imagePaths.cvTemp2,
    imagePaths.cvTemp3
];

function updateImage(index) {
    if (isImageLoading) return; // Prevent image update if one is already in progress

    isImageLoading = true; // Set loading state
    mainImage.classList.remove('active');  // Hide current image

    const newImage = new Image(); // Create a new Image object
    newImage.src = images[index]; // Set the source

    newImage.onload = () => { // On successful load
        mainImage.src = newImage.src; // Update the main image
        mainImage.classList.add('active'); // Show the new image
        isImageLoading = false; // Reset loading state
    };

    newImage.onerror = () => { // Handle load error
        console.error(`Failed to load image: ${newImage.src}`);
        isImageLoading = false; // Reset loading state
        // Optionally, set a default image or retry loading
    };
}

steps.forEach((step, index) => {
    step.addEventListener('click', () => {
        console.log("Step clicked:", index); // Log the clicked step index
        updateImage(index);
    });
});

function startSlideshow() {
    slideshowInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length; // Move to the next image
        updateImage(currentIndex);
    }, 10000); // Adjusted interval for slideshow
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

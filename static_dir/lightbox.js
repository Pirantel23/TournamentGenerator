
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const openButton = document.getElementById('open-lightbox-button');
    const lightboxButton = document.getElementsByClassName('lightbox-button');
    const overlay = document.getElementById('overlay');

    console.log(lightbox, openButton, lightboxButton, overlay)

    openButton.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        overlay.style.display = 'block';
    });

    for (const lightboxButtonElement of lightboxButton) {
        lightboxButtonElement.addEventListener('click', () => {
            lightbox.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
});

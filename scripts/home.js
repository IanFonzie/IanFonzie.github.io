document.addEventListener('DOMContentLoaded', () => {
  let timer;
  let currentSlide = 0;
  displaySlide(currentSlide);
  const directionalButtons = document.querySelectorAll('.prev, .next');
  
  for (let button of directionalButtons) {
    button.addEventListener('click', event => {
      clearTimeout(timer);
      const direction = Number(event.target.dataset.direction);
      displaySlide(currentSlide + direction);
    });
  }

  function displaySlide(targetSlide) {
    const slides = document.getElementsByClassName("feature-slide");
    const numSlides = slides.length
    // Ensure target slide is non-negative.
    targetSlide = ((targetSlide % numSlides) + numSlides) % numSlides;
    currentSlide = targetSlide;
    for (let i = 0; i < slides.length; i += 1) {
        slides[i].style.display = "none";
    }

    slides[currentSlide].style.display = "block";
    timer = setTimeout(displaySlide, 10000, targetSlide + 1);
  }
});
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    function showSlide(index) {
      const track = document.getElementById('carouselTrack');
      track.style.transform = `translateX(-${index * 100}%)`;
      
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
    }

    function moveCarousel(direction) {
      currentSlideIndex += direction;
      
      if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
      } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
      }
      
      showSlide(currentSlideIndex);
    }

    function currentSlide(index) {
      currentSlideIndex = index - 1;
      showSlide(currentSlideIndex);
    }

    // Auto-play do carrossel
    setInterval(() => {
      moveCarousel(1);
    }, 5000); 
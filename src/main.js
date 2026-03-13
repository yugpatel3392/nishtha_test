import './style.css';

const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

// State for cursor positions
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let ringX = mouseX;
let ringY = mouseY;

// We offset by half the dimensions so cursor coordinates remain centered
const dotSize = 8;
const ringSize = 40; // Initial

// Update mouse position on move
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animation loop
const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

const animate = () => {
  // Dot follows exactly
  cursorDot.style.transform = `translate(${mouseX - dotSize / 2}px, ${mouseY - dotSize / 2}px)`;

  // Ring follows with easing to create the trailing effect
  ringX = lerp(ringX, mouseX, 0.15);
  ringY = lerp(ringY, mouseY, 0.15);

  // Notice we use the hardcoded sizing mostly, but we actually should 
  // account for the dynamically changing size of the ring by using its
  // bounded react via CSS, wait we center it using CSS or JS
  // Actually we center via Javascript right here. To center we need its dimensions.
  const ringRect = cursorRing.getBoundingClientRect();
  cursorRing.style.transform = `translate(${ringX - ringRect.width / 2}px, ${ringY - ringRect.height / 2}px)`;

  requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

// Add hover effects for interactive elements
const magnetics = document.querySelectorAll('.magnetic');

magnetics.forEach((elem) => {
  elem.addEventListener('mouseenter', () => {
    cursorRing.classList.add('hovered');
    cursorDot.classList.add('hovered');
  });

  elem.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('hovered');
    cursorDot.classList.remove('hovered');

    // reset magnetic translation on element
    elem.style.transform = `translate(0px, 0px)`;
  });

  // Optional: Magnetic effect to elements
  elem.addEventListener('mousemove', (e) => {
    const rect = elem.getBoundingClientRect();
    const elemCenterX = rect.left + rect.width / 2;
    const elemCenterY = rect.top + rect.height / 2;

    const distanceX = e.clientX - elemCenterX;
    const distanceY = e.clientY - elemCenterY;

    // Magnetic pull strength (lower is stronger visually)
    const pullX = distanceX * 0.2;
    const pullY = distanceY * 0.2;

    elem.style.transform = `translate(${pullX}px, ${pullY}px)`;
  });
});

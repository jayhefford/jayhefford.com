// Gallery carousel: opens over the homepage when the Gallery button is clicked.
// Buttons, arrow keys and swiping move between images. Esc, the × button,
// or clicking the blurred area outside the image closes it.

const openBtn = document.getElementById("open-gallery");
const gallery = document.getElementById("gallery");
const track = gallery.querySelector(".carousel-track");
const slides = Array.from(gallery.querySelectorAll(".slide"));
const closeBtn = gallery.querySelector(".carousel-close");
const prevBtn = gallery.querySelector(".carousel-prev");
const nextBtn = gallery.querySelector(".carousel-next");
const caption = document.getElementById("carousel-caption");
const count = document.getElementById("carousel-count");

let current = 0;

function show(index) {
  // Wrap around at both ends of the gallery.
  current = (index + slides.length) % slides.length;
  // Each slide is 100% wide, so moving the track by -100% per slide
  // brings slide number `current` into view.
  track.style.transform = `translateX(${-100 * current}%)`;
  caption.textContent = slides[current].querySelector("img").alt;
  count.textContent = `${current + 1} / ${slides.length}`;
}

openBtn.addEventListener("click", () => {
  show(current);
  gallery.showModal(); // <dialog> handles Esc and keeps focus inside
  document.body.style.overflow = "hidden"; // stop the page scrolling behind
});

gallery.addEventListener("close", () => {
  document.body.style.overflow = "";
});

closeBtn.addEventListener("click", () => gallery.close());
prevBtn.addEventListener("click", () => show(current - 1));
nextBtn.addEventListener("click", () => show(current + 1));

// Clicking the blurred area (not an image or a button) closes the carousel.
gallery.addEventListener("click", (event) => {
  const onImage = event.target.tagName === "IMG";
  const onButton = event.target.closest("button");
  if (!onImage && !onButton && !swiped) gallery.close();
});

// Arrow keys move between images while the carousel is open.
document.addEventListener("keydown", (event) => {
  if (!gallery.open) return;
  if (event.key === "ArrowLeft") show(current - 1);
  if (event.key === "ArrowRight") show(current + 1);
});

// Swiping left or right on a touch screen (or dragging with a mouse).
let startX = null;
let swiped = false;

track.addEventListener("pointerdown", (event) => {
  startX = event.clientX;
  swiped = false;
});

track.addEventListener("pointerup", (event) => {
  if (startX === null) return;
  const distance = event.clientX - startX;
  startX = null;
  if (Math.abs(distance) > 50) {
    swiped = true; // so the click that follows does not close the carousel
    show(distance < 0 ? current + 1 : current - 1);
  }
});

// About box: grows out from the About button in the top right.
// Clicking About again, pressing Esc, or clicking anywhere else closes it.
const aboutBtn = document.getElementById("about-toggle");
const aboutBox = document.getElementById("about-bubble");

function openAbout() {
  aboutBox.hidden = false;
  // Wait one frame so the browser draws the small, see-through starting
  // state first; otherwise the growing animation would be skipped.
  requestAnimationFrame(() => aboutBox.classList.add("open"));
  aboutBtn.setAttribute("aria-expanded", "true");
}

function closeAbout() {
  aboutBox.classList.remove("open");
  aboutBtn.setAttribute("aria-expanded", "false");
  // Hide it completely once the shrinking animation has finished.
  setTimeout(() => {
    if (!aboutBox.classList.contains("open")) aboutBox.hidden = true;
  }, 350);
}

aboutBtn.addEventListener("click", () => {
  if (aboutBox.classList.contains("open")) closeAbout();
  else openAbout();
});

document.addEventListener("click", (event) => {
  const insideAbout = event.target.closest(".about");
  if (!insideAbout && aboutBox.classList.contains("open")) closeAbout();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && aboutBox.classList.contains("open")) {
    closeAbout();
    aboutBtn.focus();
  }
});

// Keep the footer year current.
document.getElementById("year").textContent = new Date().getFullYear();

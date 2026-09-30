// Lightbox: opens a clicked gallery image at large size.
// Without JavaScript, clicking a piece still opens the full image in the browser.

const pieces = Array.from(document.querySelectorAll(".piece"));
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lb-image");
const lbCaption = document.getElementById("lb-caption");
const closeBtn = lightbox.querySelector(".lb-close");
const prevBtn = lightbox.querySelector(".lb-prev");
const nextBtn = lightbox.querySelector(".lb-next");

let current = 0;

function show(index) {
  // Wrap around at both ends of the gallery.
  current = (index + pieces.length) % pieces.length;
  const piece = pieces[current];
  const thumb = piece.querySelector("img");
  lbImage.src = piece.getAttribute("href");
  lbImage.alt = thumb.alt;
  lbCaption.textContent = thumb.alt;
}

function open(index) {
  show(index);
  lightbox.showModal(); // the <dialog> element handles Esc and focus for us
}

pieces.forEach((piece, index) => {
  piece.addEventListener("click", (event) => {
    event.preventDefault(); // stop the browser from navigating to the image file
    open(index);
  });
});

closeBtn.addEventListener("click", () => lightbox.close());
prevBtn.addEventListener("click", () => show(current - 1));
nextBtn.addEventListener("click", () => show(current + 1));

// Clicking the dark area outside the image closes the lightbox.
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.tagName === "FIGURE") {
    lightbox.close();
  }
});

// Arrow keys move between images while the lightbox is open.
document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") show(current - 1);
  if (event.key === "ArrowRight") show(current + 1);
});

// Keep the footer year current.
document.getElementById("year").textContent = new Date().getFullYear();

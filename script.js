const frameCount = 240; // total frames
const canvas = document.getElementById("frameCanvas");
const context = canvas.getContext("2d");

// Resize canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Helper to generate frame path
const currentFrame = (index) => {
  const num = String(index).padStart(3, "0");
  return `frames/ezgif-frame-${num}.png`;
};

// Preload images
const images = [];
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Draw first frame when loaded
images[0].onload = () => {
  context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
};

// Scroll animation
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScroll;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  requestAnimationFrame(() => {
    const img = images[frameIndex];
    if (img.complete) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  });
});

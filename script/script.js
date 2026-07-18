gsap.registerPlugin(ScrollTrigger);

/* ---------------- LENIS SMOOTH SCROLL ---------------- */
const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ---------------- CUSTOM CURSOR ---------------- */
const cursorGlow = document.getElementById("cursorGlow");
const cursorDot = document.getElementById("cursorDot");
let mouseX = window.innerWidth / 2,
  mouseY = window.innerHeight / 2;
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.05 });
  spawnStar(mouseX, mouseY);
});
gsap.ticker.add(() => {
  gsap.to(cursorGlow, {
    x: mouseX,
    y: mouseY,
    duration: 0.3,
    ease: "power2.out",
  });
});

let lastStar = 0;
function spawnStar(x, y) {
  const now = performance.now();
  if (now - lastStar < 40) return;
  lastStar = now;
  const s = document.createElement("div");
  s.className = "star-trail";
  s.textContent = "✦";
  s.style.left = x + "px";
  s.style.top = y + "px";
  document.body.appendChild(s);
  gsap.to(s, {
    y: "+=24",
    x: "+=" + (Math.random() * 20 - 10),
    opacity: 0,
    scale: 0.3,
    duration: 0.9,
    ease: "power1.out",
    onComplete: () => s.remove(),
  });
}

/* ---------------- DAY / NIGHT TOGGLE ---------------- */
const heroStars = document.getElementById("heroStars");
for (let i = 0; i < 90; i++) {
  const s = document.createElement("span");
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 70 + "%";
  s.style.opacity = Math.random() * 0.6 + 0.3;
  s.style.width = s.style.height = (Math.random() < 0.15 ? 2 : 1) + "px";
  heroStars.appendChild(s);
  gsap.to(s, {
    opacity: 0.1,
    duration: 1 + Math.random() * 2.5,
    repeat: -1,
    yoyo: true,
    delay: Math.random() * 3,
  });
}
const modeToggle = document.getElementById("modeToggle");
const modeLabel = document.getElementById("modeLabel");
let isNight = false;
modeToggle.addEventListener("click", () => {
  isNight = !isNight;
  document.body.classList.toggle("night", isNight);
  modeLabel.textContent = isNight ? "Day" : "Night";
  gsap.to("#toggleSun", {
    scale: isNight ? 0 : 1,
    opacity: isNight ? 0 : 1,
    duration: 0.5,
    ease: "back.out(2)",
    transformOrigin: "12px 12px",
  });
  gsap.to("#toggleMoon", {
    scale: isNight ? 1 : 0,
    opacity: isNight ? 1 : 0,
    duration: 0.5,
    ease: "back.out(2)",
    transformOrigin: "12px 12px",
  });
  const r = modeToggle.getBoundingClientRect();
  burstConfettiSafe(r.left + r.width / 2, r.top + r.height / 2, 10);
});
function burstConfettiSafe(x, y, n) {
  if (typeof burstConfetti === "function") burstConfetti(x, y, n);
}

/* ---------------- LOADER ---------------- */
const loaderStars = document.getElementById("loaderStars");
for (let i = 0; i < 40; i++) {
  const st = document.createElement("div");
  st.style.position = "absolute";
  st.style.width = "2px";
  st.style.height = "2px";
  st.style.borderRadius = "50%";
  st.style.background = "#f2d98b";
  st.style.left = Math.random() * 100 + "%";
  st.style.top = Math.random() * 100 + "%";
  st.style.opacity = Math.random() * 0.8 + 0.2;
  loaderStars.appendChild(st);
  gsap.to(st, {
    opacity: 0.1,
    duration: 1 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    delay: Math.random() * 2,
  });
}

const loadTl = gsap.timeline({ delay: 0.3 });
loadTl
  .to(
    "#loaderScripture",
    { opacity: 1, duration: 1.1, ease: "power2.out" },
    0.9,
  )
  .to("#loaderScripture", { opacity: 1, duration: 1 }, "+=1")
  .to(
    "#loader",
    {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        document.getElementById("loader").style.display = "none";
        startHero();
      },
    },
    "+=.3",
  )
  .to("#loader", { pointerEvents: "none" }, "<");

/* ---------------- HERO ---------------- */
function startHero() {
  document.body.style.overflow = "auto";
  const t1 = new SplitType("#titleLine1", { types: "chars" });
  gsap.set(t1.chars, { opacity: 0, y: 60, rotateX: -60 });
  gsap.to(t1.chars, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 1,
    ease: "back.out(1.7)",
    stagger: 0.035,
  });
  gsap.fromTo(
    "#titleLine2",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, delay: 0.6, ease: "power3.out" },
  );
  gsap.fromTo(
    ".hero-sub",
    { opacity: 0 },
    { opacity: 1, duration: 1, delay: 1.3 },
  );
  gsap.fromTo(
    ".scroll-cue",
    { opacity: 0 },
    { opacity: 1, duration: 1, delay: 1.6 },
  );
}
document.body.style.overflow = "hidden";

/* breathing hero + sun follow mouse subtly */
gsap.to("#hero-content, .hero-content", {
  y: -14,
  duration: 4,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1,
});
window.addEventListener("mousemove", (e) => {
  const nx = e.clientX / window.innerWidth - 0.5;
  const ny = e.clientY / window.innerHeight - 0.5;
  gsap.to("#sun", {
    x: nx * 30,
    y: ny * 20,
    duration: 1.2,
    ease: "power2.out",
  });
});

/* HERO PARTICLES + CLOUDS via canvas */
const heroCanvas = document.getElementById("hero-canvas");
const hctx = heroCanvas.getContext("2d");
function resizeHero() {
  heroCanvas.width = window.innerWidth;
  heroCanvas.height = window.innerHeight;
}
resizeHero();
window.addEventListener("resize", resizeHero);
const heroParticles = Array.from({ length: 70 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.8 + 0.4,
  s: Math.random() * 0.4 + 0.1,
  o: Math.random() * 0.6 + 0.2,
}));
const clouds = Array.from({ length: 6 }, (_, i) => ({
  x: Math.random() * window.innerWidth,
  y: 60 + Math.random() * 160,
  w: 180 + Math.random() * 160,
  s: 0.12 + Math.random() * 0.15,
}));
function drawHero() {
  hctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  clouds.forEach((c) => {
    c.x += c.s;
    if (c.x - c.w > heroCanvas.width) c.x = -c.w;
    const grad = hctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w);
    grad.addColorStop(0, "rgba(255,250,240,0.18)");
    grad.addColorStop(1, "rgba(255,250,240,0)");
    hctx.fillStyle = grad;
    hctx.beginPath();
    hctx.ellipse(c.x, c.y, c.w, c.w * 0.4, 0, 0, Math.PI * 2);
    hctx.fill();
  });
  heroParticles.forEach((p) => {
    p.y -= p.s;
    if (p.y < -10) p.y = heroCanvas.height + 10;
    hctx.beginPath();
    hctx.fillStyle = `rgba(242,217,139,${p.o})`;
    hctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    hctx.fill();
  });
  requestAnimationFrame(drawHero);
}
drawHero();

/* ---------------- SCROLL REVEALS ---------------- */
document.querySelectorAll("[data-reveal]").forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    },
  );
});

/* portrait section parallax scale */
gsap.fromTo(
  ".portrait-frame",
  { scale: 0.85, opacity: 0 },
  {
    scale: 1,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: { trigger: "#portrait", start: "top 70%" },
  },
);

/* eyes follow cursor */
const pupils = document.querySelectorAll(".eye-pupil");
window.addEventListener("mousemove", (e) => {
  const svg = document.getElementById("portraitSvg");
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  pupils.forEach((p) => {
    const cx = rect.left + rect.width * (p.getAttribute("cx") / 400);
    const cy = rect.top + rect.height * (p.getAttribute("cy") / 460);
    const dx = e.clientX - cx,
      dy = e.clientY - cy;
    const dist = Math.min(2.4, Math.hypot(dx, dy) / 60);
    const ang = Math.atan2(dy, dx);
    p.setAttribute(
      "transform",
      `translate(${Math.cos(ang) * dist},${Math.sin(ang) * dist})`,
    );
  });
});
/* blink */
function blink() {
  gsap
    .timeline()
    .to(["#lidL", "#lidR"], {
      attr: { height: 24 },
      duration: 0.08,
      ease: "power1.in",
    })
    .to(["#lidL", "#lidR"], {
      attr: { height: 0 },
      duration: 0.12,
      ease: "power1.out",
    });
  gsap.delayedCall(2.5 + Math.random() * 3, blink);
}
gsap.delayedCall(2, blink);
/* smile pulse + head tilt idle */
gsap.to("#portraitSvg", {
  rotate: 1.4,
  duration: 3,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1,
  transformOrigin: "50% 90%",
});
gsap
  .timeline({ repeat: -1, repeatDelay: 5 })
  .to("#mouth", {
    attr: {
      d: "M164 247 Q200 240 236 247 Q216 268 200 268 Q184 268 164 247 Z",
    },
    duration: 0.6,
    ease: "power2.out",
  })
  .to("#mouth", {
    attr: {
      d: "M168 248 Q200 244 232 248 Q214 264 200 264 Q186 264 168 248 Z",
    },
    duration: 0.8,
    ease: "power2.inOut",
  });

/* ---------------- HAND SCENE ---------------- */
gsap.fromTo(
  "#divineHand",
  { y: -220, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "#hand-scene",
      start: "top bottom",
      end: "top 20%",
      scrub: 1,
    },
  },
);
gsap.to(".rays", {
  rotate: 360,
  duration: 60,
  ease: "none",
  repeat: -1,
  transformOrigin: "50% 0%",
});
gsap.utils.toArray(".bird").forEach((b, i) => {
  gsap.to(b, {
    x: "+=250",
    duration: 8 + i * 2,
    repeat: -1,
    ease: "sine.inOut",
    delay: i * 1.5,
  });
});

/* ---------------- MEMORY FRAMES 3D TILT ---------------- */
document.querySelectorAll(".frame").forEach((frame) => {
  frame.addEventListener("mousemove", (e) => {
    const r = frame.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(frame, {
      rotateY: px * 16,
      rotateX: -py * 16,
      duration: 0.4,
      ease: "power2.out",
    });
  });
  frame.addEventListener("mouseleave", () => {
    gsap.to(frame, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  });
});

/* ---------------- BALLOONS ---------------- */
const balloonSection = document.getElementById("balloons");
const balloonColors = [
  "#e8834b",
  "#d4af37",
  "#1b2a6b",
  "#c2477a",
  "#22307a",
  "#f2d98b",
];
function spawnBalloon() {
  const b = document.createElement("div");
  b.className = "balloon";
  const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  b.style.background = `radial-gradient(circle at 35% 30%, ${color}dd, ${color})`;
  b.style.borderTopColor = color;
  const size = 50 + Math.random() * 40;
  b.style.width = size + "px";
  b.style.height = size * 1.25 + "px";
  b.style.left = Math.random() * 90 + "5%";
  balloonSection.appendChild(b);
  const tl = gsap.timeline({
    onComplete: () => {
      b.remove();
    },
  });
  tl.to(b, {
    y: -(window.innerHeight + 300),
    x: `+=${Math.random() * 80 - 40}`,
    duration: 9 + Math.random() * 4,
    ease: "none",
  });
  gsap.to(b, {
    rotate: Math.random() * 10 - 5,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  b.addEventListener("click", () => {
    tl.kill();
    popBalloon(b);
  });
}
function popBalloon(b) {
  const rect = b.getBoundingClientRect();
  gsap.to(b, {
    scale: 1.3,
    opacity: 0,
    duration: 0.15,
    onComplete: () => b.remove(),
  });
  burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
}
function burstConfetti(x, y, count) {
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    c.style.left = x + "px";
    c.style.top = y + "px";
    c.style.background =
      balloonColors[Math.floor(Math.random() * balloonColors.length)];
    document.body.appendChild(c);
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 120;
    gsap.to(c, {
      x: Math.cos(ang) * dist,
      y: Math.sin(ang) * dist + 80,
      rotate: Math.random() * 360,
      opacity: 0,
      duration: 1 + Math.random() * 0.6,
      ease: "power2.out",
      onComplete: () => c.remove(),
    });
  }
}
let balloonInterval;
ScrollTrigger.create({
  trigger: "#balloons",
  start: "top 70%",
  end: "bottom top",
  onEnter: () => {
    if (!balloonInterval) balloonInterval = setInterval(spawnBalloon, 550);
  },
  onLeave: () => {
    clearInterval(balloonInterval);
    balloonInterval = null;
  },
  onEnterBack: () => {
    if (!balloonInterval) balloonInterval = setInterval(spawnBalloon, 550);
  },
  onLeaveBack: () => {
    clearInterval(balloonInterval);
    balloonInterval = null;
  },
});

/* ---------------- CAKE / ENDING ---------------- */
gsap.to(".flame", {
  scaleY: 1.15,
  transformOrigin: "50% 100%",
  duration: 0.4,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
  stagger: 0.1,
});
let cakeBlown = false;
const cakeWrap = document.getElementById("cakeWrap");
const fireCanvas = document.getElementById("fireworks-canvas");
const fctx = fireCanvas.getContext("2d");
function resizeFire() {
  fireCanvas.width = window.innerWidth;
  fireCanvas.height = window.innerHeight;
}
resizeFire();
window.addEventListener("resize", resizeFire);

cakeWrap.addEventListener("click", () => {
  if (cakeBlown) return;
  cakeBlown = true;
  document.getElementById("cakeHint").style.opacity = 0;
  gsap.to(".flame", {
    opacity: 0,
    scaleY: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: "power2.in",
  });
  const r = cakeWrap.getBoundingClientRect();
  burstConfetti(r.left + r.width / 2, r.top + r.height / 3, 40);
  launchFireworks();
  gsap.to("#endingFinal", {
    opacity: 1,
    duration: 1.2,
    delay: 0.6,
    ease: "power2.out",
    pointerEvents: "auto",
  });
  gsap.to(cakeWrap, { opacity: 0, y: -30, duration: 1, delay: 0.8 });
});

const fireworks = [];
function launchFireworks() {
  let count = 0;
  const interval = setInterval(() => {
    createFirework(
      Math.random() * fireCanvas.width,
      fireCanvas.height * (0.2 + Math.random() * 0.4),
    );
    count++;
    if (count > 6) clearInterval(interval);
  }, 380);
}
function createFirework(x, y) {
  const colors = ["#f2d98b", "#e8834b", "#ffffff", "#d4af37", "#c2477a"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 50; i++) {
    const ang = Math.PI * 2 * (i / 50);
    const speed = 2 + Math.random() * 3;
    fireworks.push({
      x,
      y,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      life: 1,
      color,
    });
  }
}
function animFireworks() {
  fctx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const p = fireworks[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
    p.life -= 0.012;
    if (p.life <= 0) {
      fireworks.splice(i, 1);
      continue;
    }
    fctx.globalAlpha = Math.max(p.life, 0);
    fctx.fillStyle = p.color;
    fctx.beginPath();
    fctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
    fctx.fill();
  }
  fctx.globalAlpha = 1;
  requestAnimationFrame(animFireworks);
}
animFireworks();

/* ambient starfield in ending using three.js */
(function () {
  const container = document.getElementById("ending");
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.zIndex = "0";
  container.insertBefore(renderer.domElement, container.firstChild);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 60;
  const geo = new THREE.BufferGeometry();
  const count = 400;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xf2d98b,
    size: 0.7,
    transparent: true,
    opacity: 0.7,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  function animate() {
    points.rotation.y += 0.0006;
    points.rotation.x += 0.0002;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
})();

/* refresh ScrollTrigger after load */
window.addEventListener("load", () => ScrollTrigger.refresh());

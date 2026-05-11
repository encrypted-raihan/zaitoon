/* ═══════════════════════════════════════════
   ZAITOON RESTAURANT — SCRIPT
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ════════════════════════════════
     LOADER
  ════════════════════════════════ */
  const loader = document.getElementById("loader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("done");
    }, 1800);
  });

  /* ════════════════════════════════
     CUSTOM CURSOR
  ════════════════════════════════ */
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top  = mouseY + "px";
    });

    (function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + "px";
      follower.style.top  = followerY + "px";
      requestAnimationFrame(animateFollower);
    })();
  }

  /* ════════════════════════════════
     NAVBAR SCROLL + SHRINK
  ════════════════════════════════ */
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, { passive: true });

  /* ════════════════════════════════
     MOBILE MENU
  ════════════════════════════════ */
  const burger     = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  window.closeMobile = function () {
    mobileMenu.classList.remove("open");
    burger.classList.remove("open");
    document.body.style.overflow = "";
  };

  /* ════════════════════════════════
     MENU FILTER TABS
  ════════════════════════════════ */
  const tabs     = document.querySelectorAll(".tab");
  const menuList = document.getElementById("menuList");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Active state
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const cat = tab.dataset.cat;
      const items = menuList.querySelectorAll(".menu-item");

      items.forEach((item) => {
        if (cat === "all" || item.dataset.cat === cat) {
          item.classList.remove("hidden");
          // Re-trigger reveal animation
          item.style.opacity = "0";
          item.style.transform = "translateY(20px)";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = "opacity .4s ease, transform .4s ease";
              item.style.opacity = "1";
              item.style.transform = "none";
            });
          });
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  /* ════════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
  ════════════════════════════════ */
  const revealElements = document.querySelectorAll("[data-scroll-reveal]");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
          setTimeout(() => {
            entry.target.classList.add("revealed");
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ════════════════════════════════
     PARALLAX — STORY IMAGE
  ════════════════════════════════ */
  const parallaxEl = document.querySelector("[data-parallax] .story-img-inner");

  if (parallaxEl) {
    const handleParallax = () => {
      const wrap = parallaxEl.closest("[data-parallax]");
      const rect = wrap.getBoundingClientRect();
      const speed = 0.25;
      const offset = (rect.top / window.innerHeight) * speed * 100;
      parallaxEl.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleParallax, { passive: true });
    handleParallax();
  }


/* ════════════════════════════════
   CINEMATIC IMAGE SEQUENCE
════════════════════════════════ */
const canvas = document.getElementById("shawarmaCanvas");

if (canvas) {

  const ctx = canvas.getContext("2d");

  const frameCount = 240;

  const currentFrame = (index) =>
    `assets/frames/frame_${String(index).padStart(4, "0")}.jpg`;

  const images = [];

  let currentFrameIndex = 0;
  let targetFrame = 0;

  /* PRELOAD */
  for (let i = 1; i <= frameCount; i++) {

    const img = new Image();

    img.src = currentFrame(i);

    images.push(img);

  }

  /* RETINA CANVAS */
  const resizeCanvas = () => {

    const dpr = window.devicePixelRatio || 1;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    render(Math.round(currentFrameIndex));

  };

  /* DRAW FRAME */
  const render = (index) => {

    const img = images[index];

    if (!img || !img.complete) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const canvasRatio = width / height;
    const imageRatio = img.width / img.height;

    let drawWidth;
    let drawHeight;
    let x;
    let y;

    /* MOBILE */
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {

      /* SOFT COVER */
      const scale = Math.max(
        width / img.width,
        height / img.height
      ) * 0.92;

      drawWidth = img.width * scale;
      drawHeight = img.height * scale;

      x = (width - drawWidth) / 2;

      /* shift down slightly */
      y = (height - drawHeight) / 2 + 40;

    } else {

      /* DESKTOP CINEMATIC COVER */
      if (imageRatio > canvasRatio) {

        drawHeight = height;
        drawWidth = drawHeight * imageRatio;

        x = (width - drawWidth) / 2;
        y = 0;

      } else {

        drawWidth = width;
        drawHeight = drawWidth / imageRatio;

        x = 0;
        y = (height - drawHeight) / 2;

      }

    }

    /* QUALITY */
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    /* CINEMATIC FILTER */
    ctx.filter = `
      brightness(.92)
      contrast(1.08)
      saturate(1.08)
      blur(.15px)
    `;

    /* subtle frame blend */
    ctx.globalAlpha = 0.96;

    ctx.drawImage(
      img,
      x,
      y,
      drawWidth,
      drawHeight
    );

    ctx.globalAlpha = 1;
    ctx.filter = "none";

  };

  /* WAIT FOR PRELOAD */
  Promise.all(
    images.map(img =>
      new Promise(resolve => {
        img.onload = resolve;
      })
    )
  ).then(() => {

    resizeCanvas();

  });

  window.addEventListener("resize", resizeCanvas);

  /* SMOOTH INTERPOLATION */
  const animate = () => {

    currentFrameIndex +=
      (targetFrame - currentFrameIndex) * 0.1;

    render(Math.round(currentFrameIndex));

    requestAnimationFrame(animate);

  };

  animate();

  /* SCROLL CONTROL */
  const storySection =
    document.querySelector(".story-section");

  window.addEventListener("scroll", () => {

    const rect =
      storySection.getBoundingClientRect();

    const scrollable =
      window.innerHeight + rect.height;

    let progress =
      (window.innerHeight - rect.top) /
      scrollable;

    progress =
      Math.max(0, Math.min(progress, 1));

    targetFrame =
      progress * (frameCount - 1);

  }, { passive: true });

}



/* ════════════════════════════════
   CLEAN HERO PARALLAX
════════════════════════════════ */
const heroVideo = document.querySelector(".hero-video");
const heroOverlay = document.querySelector(".hero-overlay");

if (heroVideo) {

  let current = 0;
  let target = 0;
  let ticking = false;

  const animate = () => {

    current += (target - current) * 0.05;

    // Slow cinematic background movement
    heroVideo.style.transform = `
      translate3d(0, ${current * 0.12}px, 0)
      scale(1.15)
    `;

    // Optional overlay darkening
    if (heroOverlay) {
      heroOverlay.style.opacity = 0.45 + (current / 3000);
    }

    if (Math.abs(target - current) > 0.1) {
      requestAnimationFrame(animate);
    } else {
      ticking = false;
    }
  };

  window.addEventListener("scroll", () => {

    target = window.scrollY;

    if (!ticking) {
      requestAnimationFrame(animate);
      ticking = true;
    }

  }, { passive: true });

}

  /* ════════════════════════════════
     REVIEWS CAROUSEL
  ════════════════════════════════ */
  const track   = document.getElementById("reviewsTrack");
  const btnPrev = document.getElementById("revPrev");
  const btnNext = document.getElementById("revNext");

  if (track && btnPrev && btnNext) {
    const CARD_WIDTH = 380 + 24; // card + gap

    btnNext.addEventListener("click", () => {
      track.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
    });

    btnPrev.addEventListener("click", () => {
      track.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
    });

    // Auto-scroll
    let autoScroll = setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
      }
    }, 4500);

    // Pause on hover
    track.addEventListener("mouseenter", () => clearInterval(autoScroll));
    track.addEventListener("mouseleave", () => {
      autoScroll = setInterval(() => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 10) {
          track.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          track.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
        }
      }, 4500);
    });
  }

  /* ════════════════════════════════
     SMOOTH ANCHOR SCROLLING
  ════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ════════════════════════════════
     COUNTER ANIMATION (Stats)
  ════════════════════════════════ */
  function animateCounter(el, target, suffix = "", decimals = 0) {
    const duration = 1600;
    const start    = performance.now();

    const update = (time) => {
      const elapsed  = Math.min((time - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - elapsed, 3);
      const value    = (eased * target).toFixed(decimals);
      el.textContent = value + suffix;
      if (elapsed < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll(".stat-num");
  const statData = [
    { target: 4.2, suffix: "", decimals: 1 },
    { target: 1700, suffix: "+", decimals: 0 },
    { target: 200, suffix: "", decimals: 0 },
    { target: 5, suffix: "+", decimals: 0 },
  ];

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statNums.forEach((el, i) => {
            const d = statData[i];
            if (d) animateCounter(el, d.target, d.suffix, d.decimals);
          });
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  if (statNums.length) statsObserver.observe(statNums[0]);

  /* ════════════════════════════════
     FLOATING CALL BUTTON (mobile scroll)
  ════════════════════════════════ */
  const floatingCall = document.querySelector(".floating-call");

  if (floatingCall) {
    window.addEventListener("scroll", () => {
      floatingCall.style.opacity = window.scrollY > 400 ? "1" : "0";
      floatingCall.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    }, { passive: true });
    floatingCall.style.opacity = "0";
  }

  /* ════════════════════════════════
     NAV ACTIVE STATE ON SCROLL
  ════════════════════════════════ */
  const sections  = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => {
            a.style.color = a.getAttribute("href") === "#" + entry.target.id
              ? "white"
              : "";
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ════════════════════════════════
     GALLERY LIGHTBOX (simple)
  ════════════════════════════════ */
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const label = item.querySelector(".gi-label");
      if (!img) return;

      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:99999;
        background:rgba(0,0,0,.92);
        display:flex;align-items:center;justify-content:center;
        cursor:zoom-out;padding:2rem;
        animation:fadeIn .3s ease;
      `;

      const inner = document.createElement("div");
      inner.style.cssText = `position:relative;max-width:90vw;max-height:90vh;`;

      const bigImg = document.createElement("img");
      bigImg.src = img.src;
      bigImg.style.cssText = `
        max-width:100%;max-height:85vh;
        object-fit:contain;border-radius:12px;
        display:block;
      `;

      if (label) {
        const cap = document.createElement("p");
        cap.textContent = label.textContent;
        cap.style.cssText = `
          text-align:center;color:rgba(255,255,255,.6);
          margin-top:1rem;font-size:.85rem;letter-spacing:2px;
          text-transform:uppercase;
        `;
        inner.appendChild(bigImg);
        inner.appendChild(cap);
      } else {
        inner.appendChild(bigImg);
      }

      overlay.appendChild(inner);
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      overlay.addEventListener("click", () => {
        overlay.remove();
        document.body.style.overflow = "";
      });
    });
  });

  /* ════════════════════════════════
     MARQUEE PAUSE ON HOVER
  ════════════════════════════════ */
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    const marqueeWrap = marqueeTrack.parentElement;
    marqueeWrap.addEventListener("mouseenter", () => {
      marqueeTrack.style.animationPlayState = "paused";
    });
    marqueeWrap.addEventListener("mouseleave", () => {
      marqueeTrack.style.animationPlayState = "running";
    });
  }

})();





const navbar = document.getElementById("navbar");

const lightSections = document.querySelectorAll(
  ".story-section, .menu-section, .gallery-section"
);

function updateNavbarContrast() {

  let isOnLight = false;

  lightSections.forEach(section => {

    const rect = section.getBoundingClientRect();

    if (rect.top <= 120 && rect.bottom >= 120) {
      isOnLight = true;
    }

  });

  navbar.classList.toggle("light-section", isOnLight);
}

window.addEventListener("scroll", updateNavbarContrast);

updateNavbarContrast();


const spotlightCards = document.querySelectorAll(".spot-card[data-cat]");

spotlightCards.forEach((card) => {
  card.addEventListener("click", () => {
    const cat = card.dataset.cat;
    const tab = Array.from(document.querySelectorAll(".tab"))
      .find(t => t.dataset.cat === cat);

    if (tab) tab.click();

    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


document
  .querySelector(".menu-explore-trigger")
  ?.addEventListener("click", () => {

    const target = document.querySelector(".menu-tabs");

    if(target){

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

});


/* ═══════════════════════════════
   MENU REVEAL
═══════════════════════════════ */

const menuRevealBtn =
  document.querySelector(".menu-bottom-btn");

const fullMenu =
  document.getElementById("fullMenu");

if(menuRevealBtn && fullMenu){

  menuRevealBtn.addEventListener("click", () => {

    fullMenu.classList.add("show");

    menuRevealBtn.classList.add("active");

    // smooth cinematic scroll

    setTimeout(() => {

      fullMenu.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 250);

  });

}
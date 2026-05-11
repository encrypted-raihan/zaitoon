/* ═══════════════════════════════════════════
   ZAITOON RESTAURANT — SCRIPT
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ════════════════════════════════
     LOADER
  ════════════════════════════════ */
  const loader = document.getElementById("loader");

  const hideLoader = () => {
    if (loader) loader.classList.add("done");
  };

  if (loader) {
    if (document.readyState === "complete") {
      setTimeout(hideLoader, 1800);
    } else {
      window.addEventListener(
        "load",
        () => {
          setTimeout(hideLoader, 1800);
        },
        { once: true }
      );
    }
  }

  /* ════════════════════════════════
     CUSTOM CURSOR
  ════════════════════════════════ */
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  if (window.matchMedia("(hover: hover)").matches && cursor && follower) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + "px";
      follower.style.top = followerY + "px";
      requestAnimationFrame(animateFollower);
    };

    animateFollower();
  }

  /* ════════════════════════════════
     NAVBAR + SCROLL ENGINE
  ════════════════════════════════ */
  const navbar = document.getElementById("navbar");
  const heroImage = document.querySelector(".hero-image");

  let latestScroll = window.scrollY || 0;
  let ticking = false;
  let currentParallax = 0;

  const updateScene = () => {
    const scrollY = latestScroll;

    if (navbar) {
      navbar.classList.toggle("scrolled", scrollY > 40);

      const lightSectionSelectors = [".menu-section", ".reviews-section"];
      let inLightSection = false;

      for (const selector of lightSectionSelectors) {
        const el = document.querySelector(selector);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          inLightSection = true;
          break;
        }
      }

      navbar.classList.toggle("light-section", inLightSection);
    }

    if (heroImage) {
      heroImage.style.transform = `scale(1.08)`;
    }
        ticking = false;
      };

  window.addEventListener(
    "scroll",
    () => {
      latestScroll = window.scrollY || 0;

      if (!ticking) {
        requestAnimationFrame(updateScene);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateScene();

  /* ════════════════════════════════
     MOBILE MENU
  ════════════════════════════════ */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  window.closeMobile = function () {
    if (mobileMenu) mobileMenu.classList.remove("open");
    if (burger) burger.classList.remove("open");
    document.body.style.overflow = "";
  };

  /* ════════════════════════════════
     MENU FILTER TABS
  ════════════════════════════════ */
  const tabs = document.querySelectorAll(".tab");
  const menuList = document.getElementById("menuList");

  if (tabs.length && menuList) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const cat = tab.dataset.cat;
        const items = menuList.querySelectorAll(".menu-item");

        items.forEach((item) => {
          const match = cat === "all" || item.dataset.cat === cat;

          if (match) {
            item.classList.remove("hidden");

            item.style.opacity = "0";
            item.style.transform = "translateY(20px)";

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                item.style.transition =
                  "opacity .4s ease, transform .4s ease";
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
  }

  /* ════════════════════════════════
     SCROLL REVEAL
  ════════════════════════════════ */
  const revealElements = document.querySelectorAll("[data-scroll-reveal]");

  if ("IntersectionObserver" in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay
              ? parseInt(entry.target.dataset.delay, 10)
              : 0;

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
  } else {
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  /* ════════════════════════════════
     STORY CANVAS SEQUENCE
  ════════════════════════════════ */
  const canvas = document.getElementById("shawarmaCanvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const frameCount = 240;
      const currentFrame = (index) =>
        `assets/frames/frame_${String(index).padStart(4, "0")}.jpg`;

      const images = [];
      let currentFrameIndex = 0;
      let targetFrame = 0;

      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
      }

      const render = (index) => {
        const img = images[index];

        if (!img || !img.complete || !img.naturalWidth) return;

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        if (!width || !height) return;

        ctx.clearRect(0, 0, width, height);

        const canvasRatio = width / height;
        const imageRatio = img.width / img.height;

        let drawWidth;
        let drawHeight;
        let x;
        let y;

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          const scale =
            Math.max(width / img.width, height / img.height) * 0.92;

          drawWidth = img.width * scale;
          drawHeight = img.height * scale;

          x = (width - drawWidth) / 2;
          y = (height - drawHeight) / 2 + 40;
        } else {
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

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.filter = "brightness(.92) contrast(1.08) saturate(1.08)";
        ctx.globalAlpha = 0.96;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);

        ctx.globalAlpha = 1;
        ctx.filter = "none";
      };

      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        if (!width || !height) return;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        render(Math.round(currentFrameIndex));
      };

      const waitForImages = async () => {
        await Promise.all(
          images.map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete && img.naturalWidth) {
                  resolve();
                } else {
                  img.onload = resolve;
                  img.onerror = resolve;
                }
              })
          )
        );
      };

      waitForImages().then(() => {
        resizeCanvas();
      });

      window.addEventListener("resize", resizeCanvas);

      const animate = () => {
        currentFrameIndex += (targetFrame - currentFrameIndex) * 0.1;
        render(Math.round(currentFrameIndex));
        requestAnimationFrame(animate);
      };

      animate();

      const storySection = document.querySelector(".story-section");

      if (storySection) {
        window.addEventListener(
          "scroll",
          () => {
            const rect = storySection.getBoundingClientRect();
            const scrollable = window.innerHeight + rect.height;

            let progress = (window.innerHeight - rect.top) / scrollable;
            progress = Math.max(0, Math.min(progress, 1));

            targetFrame = progress * (frameCount - 1);
          },
          { passive: true }
        );
      }
    }
  }

  /* ════════════════════════════════
     REVIEWS CAROUSEL
  ════════════════════════════════ */
  const track = document.getElementById("reviewsTrack");
  const btnPrev = document.getElementById("revPrev");
  const btnNext = document.getElementById("revNext");

  if (track && btnPrev && btnNext) {
    const CARD_WIDTH = 380 + 24;

    btnNext.addEventListener("click", () => {
      track.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
    });

    btnPrev.addEventListener("click", () => {
      track.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
    });

    let autoScroll = setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;

      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
      }
    }, 4500);

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
      const href = anchor.getAttribute("href");
      const target = href ? document.querySelector(href) : null;

      if (target) {
        e.preventDefault();
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ════════════════════════════════
     COUNTER ANIMATION
  ════════════════════════════════ */
  function animateCounter(el, target, suffix = "", decimals = 0) {
    const duration = 1600;
    const start = performance.now();

    const update = (time) => {
      const elapsed = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = (eased * target).toFixed(decimals);
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

  if (statNums.length) {
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

    statsObserver.observe(statNums[0]);
  }

  /* ════════════════════════════════
     FLOATING CALL BUTTON
  ════════════════════════════════ */
  const floatingCall = document.querySelector(".floating-call");

  if (floatingCall) {
    const handleFloatingCall = () => {
      const visible = window.scrollY > 400;
      floatingCall.style.opacity = visible ? "1" : "0";
      floatingCall.style.pointerEvents = visible ? "auto" : "none";
    };

    window.addEventListener("scroll", handleFloatingCall, { passive: true });
    handleFloatingCall();
  }

  /* ════════════════════════════════
     NAV ACTIVE STATE ON SCROLL
  ════════════════════════════════ */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window && sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => {
              a.style.color =
                a.getAttribute("href") === "#" + entry.target.id
                  ? "white"
                  : "";
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ════════════════════════════════
     GALLERY LIGHTBOX
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

      inner.appendChild(bigImg);

      if (label) {
        const cap = document.createElement("p");
        cap.textContent = label.textContent;
        cap.style.cssText = `
          text-align:center;color:rgba(255,255,255,.6);
          margin-top:1rem;font-size:.85rem;letter-spacing:2px;
          text-transform:uppercase;
        `;
        inner.appendChild(cap);
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

  if (marqueeTrack && marqueeTrack.parentElement) {
    const marqueeWrap = marqueeTrack.parentElement;

    marqueeWrap.addEventListener("mouseenter", () => {
      marqueeTrack.style.animationPlayState = "paused";
    });

    marqueeWrap.addEventListener("mouseleave", () => {
      marqueeTrack.style.animationPlayState = "running";
    });
  }

  /* ════════════════════════════════
     SPOTLIGHT CARDS -> CATEGORY FILTER
  ════════════════════════════════ */
  const spotlightCards = document.querySelectorAll(".spot-card[data-cat]");

  spotlightCards.forEach((card) => {
    card.addEventListener("click", () => {
      const cat = card.dataset.cat;
      const tab = Array.from(document.querySelectorAll(".tab")).find(
        (t) => t.dataset.cat === cat
      );

      if (tab) tab.click();

      const menuSection = document.getElementById("menu");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ════════════════════════════════
     MENU EXPAND / RETRACT
  ════════════════════════════════ */
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const fullMenu = document.getElementById("fullMenu");
  const menuBtnText = document.querySelector(".menu-btn-text");
  const menuBtnCircle = document.querySelector(".menu-btn-circle");

  if (menuToggleBtn && fullMenu && menuBtnText && menuBtnCircle) {
    menuToggleBtn.addEventListener("click", () => {
      fullMenu.classList.toggle("show");

      const isOpen = fullMenu.classList.contains("show");

      menuBtnText.textContent = isOpen ? "Hide Full Menu" : "Explore Full Menu";
      menuBtnCircle.innerHTML = isOpen ? "↑" : "↓";

    if (!isOpen) {

      const menuSection =
        document.querySelector(".menu-section");

      if(menuSection){

        const top =
          menuSection.getBoundingClientRect().top +
          window.scrollY - 120;

        requestAnimationFrame(() => {

          window.scrollTo({
            top,
            behavior: "smooth"
          });

        });

      }

    }
    });
  }

  /* ════════════════════════════════
     MENU EXPLAINER BUTTON (older CTA support)
  ════════════════════════════════ */
  document.querySelector(".menu-explore-trigger")?.addEventListener("click", () => {
    const target = document.querySelector(".menu-tabs");
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
})();
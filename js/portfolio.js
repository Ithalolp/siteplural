// =============================================
// PORTFÓLIO — SCRIPT DEDICADO
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🎬 Portfólio Plural — inicializando");

  /* =========================================
     0. BOTÃO VOLTAR — REDIRECIONA PARA A HOME
     ========================================= */

  const backBtn = document.getElementById("pfBackBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      const homeUrl = backBtn.getAttribute("data-home-url") || backBtn.href;
      // Se o href estiver vazio ou inválido, força o redirecionamento
      if (!backBtn.href || backBtn.href === "#" || backBtn.href === "") {
        e.preventDefault();
        window.location.href = homeUrl || "index.html";
      }
    });
  }

  /* =========================================
     1. HERO SLIDER EM VÍDEO
     ========================================= */

  const hero = document.getElementById("pf-hero");
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll(".pf-hero-slide"));
  const indicators = Array.from(hero.querySelectorAll(".pf-hero-indicator"));
  const eyebrowEl = document.getElementById("pfHeroEyebrow");
  const titleEl = document.getElementById("pfHeroTitle");
  const playBtn = document.getElementById("pfHeroPlay");
  const soundBtn = document.getElementById("pfHeroSound");

  const slideMeta = [
    {
      eyebrow: "PLURAL CRIATIVO",
      title: "Cada frame conta<br />uma história real.",
    },
    {
      eyebrow: "PRODUÇÃO AUDIOVISUAL",
      title: "Do conceito à entrega,<br />com propósito em cada detalhe.",
    },
  ];

  const SLIDE_DURATION = 7000;
  let current = 0;
  let timer = null;

  function resetIndicator(i) {
    const ind = indicators[i];
    if (!ind) return;
    const fill = ind.querySelector(".pf-hero-indicator-fill");
    if (fill) {
      fill.style.animation = "none";
      void fill.offsetWidth;
      fill.style.animation = "";
    }
  }

  function goToSlide(index) {
    if (index === current) return;

    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    indicators.forEach((ind, i) => {
      const active = i === index;
      ind.classList.toggle("is-active", active);
      ind.setAttribute("aria-selected", active ? "true" : "false");
      resetIndicator(i);
    });

    slides.forEach((s, i) => {
      const v = s.querySelector("video");
      if (!v) return;
      if (i === index) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });

    const meta = slideMeta[index] || { eyebrow: "", title: "" };
    if (eyebrowEl) eyebrowEl.textContent = meta.eyebrow;
    if (titleEl) {
      titleEl.innerHTML = meta.title;
      titleEl.style.animation = "none";
      void titleEl.offsetWidth;
      titleEl.style.animation = "";
    }
    if (eyebrowEl) {
      eyebrowEl.style.animation = "none";
      void eyebrowEl.offsetWidth;
      eyebrowEl.style.animation = "";
    }

    current = index;
    restartTimer();
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function restartTimer() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(nextSlide, SLIDE_DURATION);
  }

  indicators.forEach((ind) => {
    ind.addEventListener("click", () => {
      const i = parseInt(ind.dataset.index, 10);
      goToSlide(i);
    });
  });

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      const activeSlide = slides[current];
      const video = activeSlide.querySelector("video source");
      const src = video ? video.src : "";
      const title =
        slideMeta[current]?.title?.replace(/<br\s*\/?>/gi, " ") || "";
      if (src) openPortfolioModal(src, title);
    });
  }

  let isMuted = true;
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      slides.forEach((s) => {
        const v = s.querySelector("video");
        if (!v) return;
        v.muted = isMuted;
      });
      soundBtn.setAttribute("aria-pressed", isMuted ? "false" : "true");
      soundBtn.innerHTML = isMuted
        ? '<i class="fas fa-volume-mute" aria-hidden="true"></i>'
        : '<i class="fas fa-volume-up" aria-hidden="true"></i>';
    });
  }

  if ("IntersectionObserver" in window) {
    const heroObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const activeVideo = slides[current]?.querySelector("video");
          if (!activeVideo) return;
          if (entry.isIntersecting) {
            activeVideo.play().catch(() => {});
          } else {
            activeVideo.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    heroObs.observe(hero);
  }

  restartTimer();

  /* =========================================
     2. SCROLL HORIZONTAL (DRAG) + TECLADO
     ========================================= */

  const rows = document.querySelectorAll("[data-scroll-row]");

  rows.forEach((row) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = false;

    row.addEventListener("mousedown", (e) => {
      isDown = true;
      moved = false;
      row.classList.add("is-dragging");
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
    });

    const stop = () => {
      isDown = false;
      row.classList.remove("is-dragging");
    };

    row.addEventListener("mouseleave", stop);
    row.addEventListener("mouseup", stop);

    row.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - row.offsetLeft;
      const walk = (x - startX) * 1.6;
      if (Math.abs(walk) > 4) moved = true;
      row.scrollLeft = scrollLeft - walk;
    });

    row.addEventListener(
      "touchstart",
      () => {
        row.classList.add("is-dragging");
      },
      { passive: true }
    );
    row.addEventListener(
      "touchend",
      () => {
        row.classList.remove("is-dragging");
      },
      { passive: true }
    );

    // Navegação por teclado dentro do carrossel
    row.addEventListener("keydown", (e) => {
      const card = e.target.closest(".pf-card");
      if (!card || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      e.preventDefault();
      const cards = Array.from(row.querySelectorAll(".pf-card"));
      const idx = cards.indexOf(card);
      const next = e.key === "ArrowRight" ? idx + 1 : idx - 1;
      if (next >= 0 && next < cards.length) {
        cards[next].focus();
        cards[next].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    });
  });

  /* =========================================
     3. MODAL DE VÍDEO
     ========================================= */

  const modal = document.getElementById("pfModal");
  const modalVideo = document.getElementById("pfModalVideo");
  const modalClose = document.getElementById("pfModalClose");
  const modalTitle = document.getElementById("pfModalTitle");
  const modalMeta = document.getElementById("pfModalMeta");

  function openPortfolioModal(src, title, meta) {
    if (!modal || !modalVideo) return;

    modalVideo.src = src;
    modalVideo.muted = false;
    modalVideo.volume = 1;
    modalVideo.load();

    if (modalTitle) modalTitle.textContent = title || "";
    if (modalMeta) modalMeta.textContent = meta || "";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const playPromise = modalVideo.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {});
    }
  }

  function closePortfolioModal() {
    if (!modal || !modalVideo) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".pf-card").forEach((card) => {
    const trigger = () => {
      const src = card.getAttribute("data-video");
      const title = card.getAttribute("data-title") || "";
      const meta = card.getAttribute("data-meta") || "";
      if (src) openPortfolioModal(src, title, meta);
    };
    card.addEventListener("click", trigger);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger();
      }
    });
  });

  if (modalClose) modalClose.addEventListener("click", closePortfolioModal);
  document
    .querySelectorAll("[data-close-modal]")
    .forEach((el) => el.addEventListener("click", closePortfolioModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
      closePortfolioModal();
    }
  });

  window.PluralPortfolio = {
    goToSlide,
    openPortfolioModal,
    closePortfolioModal,
  };
});

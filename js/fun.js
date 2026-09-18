// =============================================
// SCRIPT PROFISSIONAL - PLURAL CRIATIVO - COMPLETO
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  // =============================================
  // 1. INICIALIZAÇÃO
  // =============================================

  console.log("🔵 Plural Criativo - Site inicializado");

  // =============================================
  // 2. CONFIGURAÇÕES GLOBAIS
  // =============================================

  const config = {
    smoothScrollDuration: 800,
    revealThreshold: 0.1,
    headerTransitionThreshold: 50,
    videoModalTransition: 300,
  };

  // =============================================
  // 3. FUNÇÕES UTILITÁRIAS
  // =============================================

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // =============================================
  // 4. BOTÃO VOLTAR AO TOPO
  // =============================================

  function initBackToTop() {
    console.log("🔼 Inicializando botão Voltar ao Topo");

    const backToTopButton = document.getElementById("backToTop");

    if (!backToTopButton) {
      console.error(
        '❌ Botão "Voltar ao Topo" não encontrado! Criando manualmente...',
      );

      const button = document.createElement("button");
      button.id = "backToTop";
      button.className = "back-to-top";
      button.setAttribute("aria-label", "Voltar ao topo da página");
      button.setAttribute("title", "Voltar ao topo");
      button.innerHTML = '<i class="fas fa-chevron-up"></i>';
      document.body.appendChild(button);

      window.backToTopButton = button;
    } else {
      window.backToTopButton = backToTopButton;
      console.log('✅ Botão "Voltar ao Topo" encontrado');
    }

    const clientsSection = document.querySelector(".clients-section");

    function checkScrollPosition() {
      const scrollY = window.scrollY;
      let shouldShow = false;

      if (clientsSection) {
        const clientsRect = clientsSection.getBoundingClientRect();
        if (clientsRect.bottom < -50 || scrollY > 500) {
          shouldShow = true;
        }
      } else {
        shouldShow = scrollY > 500;
      }

      if (scrollY < 100) {
        shouldShow = false;
      }

      if (shouldShow) {
        window.backToTopButton.classList.add("visible");
      } else {
        window.backToTopButton.classList.remove("visible");
      }
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        const header = document.getElementById("mainHeader");
        if (header) header.focus();
      }, 500);
    }

    window.backToTopButton.addEventListener("click", scrollToTop);

    window.backToTopButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToTop();
      }
    });

    setTimeout(checkScrollPosition, 500);
    window.addEventListener("scroll", throttle(checkScrollPosition, 100));
    window.addEventListener("resize", checkScrollPosition);
    setTimeout(checkScrollPosition, 2000);

    console.log('✅ Botão "Voltar ao Topo" inicializado com sucesso');
  }

  // =============================================
  // 5. HEADER INTERATIVO
  // =============================================

  const header = document.getElementById("mainHeader");

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > config.headerTransitionThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    updateActiveNav();
  }

  // =============================================
  // 6. NAVEGAÇÃO SMOOTH SCROLL
  // =============================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#" || href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight - 20;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });

      closeMobileMenu();
    });
  });

  // =============================================
  // 7. MENU MOBILE
  // =============================================

  const navToggle = document.getElementById("navToggleSticky");
  const navList = document.getElementById("navListSticky");

  function toggleMobileMenu() {
    const isOpen = navList.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMobileMenu() {
    navList.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", toggleMobileMenu);

    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        !navToggle.contains(e.target) &&
        !navList.contains(e.target) &&
        navList.classList.contains("active")
      ) {
        closeMobileMenu();
      }
    });
  }

  // =============================================
  // 8. SCROLL REVEAL
  // =============================================

  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 },
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // =============================================
  // 9. PORTFOLIO INTERATIVO
  // =============================================

  function initPortfolio() {
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    portfolioItems.forEach((item) => {
      item.addEventListener("click", () => {
        const videoSrc = item.dataset.video;
        if (videoSrc) {
          openVideoModal(videoSrc);
        }
      });

      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const videoSrc = item.dataset.video;
          if (videoSrc) {
            openVideoModal(videoSrc);
          }
        }
      });
    });
  }

  // =============================================
  // 10. MODAL DE VÍDEO
  // =============================================

  const modal = document.getElementById("modal");
  const modalVideo = document.getElementById("modalVideo");
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");

  function getThemePath() {
    const themePathElement = document.querySelector('meta[name="theme-path"]');
    if (themePathElement) {
      return themePathElement.getAttribute("content");
    }
    return ".";
  }

  function openVideoModal(src) {
    if (!modal || !modalVideo) return;

    console.log("🎬 Abrindo vídeo modal:", src);

    let videoSrc = src;

    if (videoSrc && !videoSrc.startsWith("http") && !videoSrc.startsWith("/")) {
      const themePath = getThemePath();
      videoSrc = themePath + "/" + videoSrc;
    } else if (videoSrc && videoSrc.startsWith("/")) {
      videoSrc = window.location.origin + videoSrc;
    }

    modalVideo.addEventListener(
      "error",
      () => {
        console.warn("⚠️ Não foi possível carregar o vídeo:", videoSrc);
        closeVideoModal();
      },
      { once: true },
    );

    modalVideo.src = videoSrc;
    modalVideo.load();

    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "flex";

    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";

    const playPromise = modalVideo.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        modalVideo.setAttribute("controls", "true");
      });
    }

    setTimeout(() => {
      modal.focus();
    }, 100);
  }

  function closeVideoModal() {
    if (!modal || !modalVideo) return;

    console.log("❌ Fechando modal de vídeo");

    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = "";
    modalVideo.removeAttribute("controls");

    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";

    setTimeout(() => {
      if (document.activeElement === modalVideo) {
        document.body.focus();
      }
    }, 50);
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeVideoModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeVideoModal);
  }

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      modal &&
      modal.getAttribute("aria-hidden") === "false"
    ) {
      closeVideoModal();
    }
  });

  // =============================================
  // 11. FORMULÁRIO DE CONTATO (FORMSPREE)
  // =============================================

  const contactForm = document.getElementById("contactForm");
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvgebgyj";

  if (contactForm) {
    const inputs = contactForm.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.setAttribute("autocomplete", "off");
      input.setAttribute("autocorrect", "off");
      input.setAttribute("autocapitalize", "off");
      input.setAttribute("spellcheck", "false");
    });

    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => clearError(input));
    });

    const messageTextarea = contactForm.querySelector("#message");
    const charCounter = contactForm.querySelector("#charCounter");

    if (messageTextarea && charCounter) {
      messageTextarea.addEventListener("input", function () {
        const currentLength = this.value.length;
        const maxLength = 1000;
        charCounter.textContent = `${currentLength}/${maxLength}`;

        if (currentLength > maxLength) {
          this.value = this.value.substring(0, maxLength);
          charCounter.textContent = `${maxLength}/${maxLength}`;
          charCounter.style.color = "#ef4444";
        } else if (currentLength > 900) {
          charCounter.style.color = "#f59e0b";
        } else {
          charCounter.style.color = "#64748b";
        }
      });
    }

    function validateField(field) {
      const value = field.value.trim();
      const fieldName = field.getAttribute("name");

      if (field.hasAttribute("required") && !value) {
        showError(field, "Este campo é obrigatório");
        return false;
      }

      if (fieldName === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showError(field, "Por favor, insira um email válido");
          return false;
        }
      }

      return true;
    }

    function showError(field, message) {
      clearError(field);

      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      errorDiv.style.color = "#ef4444";
      errorDiv.style.fontSize = "0.875rem";
      errorDiv.style.marginTop = "0.25rem";

      field.parentNode.appendChild(errorDiv);
      field.style.borderColor = "#ef4444";
    }

    function clearError(field) {
      const errorDiv = field.parentNode.querySelector(".error-message");
      if (errorDiv) {
        errorDiv.remove();
      }
      field.style.borderColor = "";
    }

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;
      inputs.forEach((input) => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        showNotification("Por favor, corrija os erros no formulário.", "error");
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      showNotification("Enviando mensagem...", "loading");

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get("name"),
        _replyto: formData.get("email"),
        company: formData.get("company"),
        project: formData.get("project"),
        message: formData.get("message"),
        _subject: `Novo Contato Plural Criativo - ${formData.get("name")}`,
      };

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          showNotification(
            "Mensagem enviada com sucesso! Em breve entraremos em contato.",
            "success",
          );
          contactForm.reset();

          if (charCounter) {
            charCounter.textContent = "0/1000";
            charCounter.style.color = "#64748b";
          }
        } else {
          let result = {};
          try {
            result = await response.json();
          } catch (e) {
            // Ignora se não for JSON válido
          }

          const errorMessage =
            result?.error ||
            `Erro de Servidor (${response.status}). Tente novamente mais tarde.`;

          showNotification(`Falha no envio: ${errorMessage}`, "error");
        }
      } catch (error) {
        showNotification(
          "Ocorreu um erro de rede. Verifique sua conexão e tente novamente.",
          "error",
        );
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }

  // =============================================
  // 12. NOTIFICAÇÕES
  // =============================================

  function showNotification(message, type = "info") {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close" aria-label="Fechar">&times;</button>
      </div>
    `;

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background:
        type === "error"
          ? "#ef4444"
          : type === "success"
            ? "#10b981"
            : type === "loading"
              ? "#3b82f6"
              : "#1e293b",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      zIndex: "99999",
      animation: "slideIn 0.3s ease",
      maxWidth: "400px",
      fontFamily: "'Poppins', sans-serif",
      fontSize: "0.95rem",
    });

    const content = notification.querySelector(".notification-content");
    Object.assign(content.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
    });

    const closeBtn = notification.querySelector(".notification-close");
    Object.assign(closeBtn.style, {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "1.5rem",
      cursor: "pointer",
      padding: "0",
      lineHeight: "1",
      marginLeft: "0.5rem",
    });

    closeBtn.addEventListener("click", () => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    });

    document.body.appendChild(notification);

    if (type !== "loading") {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = "slideOut 0.3s ease";
          setTimeout(() => notification.remove(), 300);
        }
      }, 5000);
    }

    return notification;
  }

  // =============================================
  // 13. ANIMAÇÃO DO MARQUEE
  // =============================================

  function initMarquee() {
    const marqueeTracks = document.querySelectorAll(".marquee-track");

    marqueeTracks.forEach((track) => {
      const content = track.innerHTML;
      track.innerHTML += content;
    });
  }

  // =============================================
  // 14. LAZY LOADING
  // =============================================

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const dataSrc = img.getAttribute("data-src");

              let src = dataSrc;
              if (
                src &&
                !src.startsWith("http") &&
                !src.startsWith("/") &&
                !src.startsWith("data:")
              ) {
                const themePath = getThemePath();
                src = themePath + "/" + src;
              }

              img.src = src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);

              img.addEventListener("load", () => {
                img.classList.add("loaded");
              });
            }
          });
        },
        { rootMargin: "50px 0px", threshold: 0.1 },
      );

      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      lazyImages.forEach((img) => {
        let src = img.getAttribute("data-src");
        if (src && !src.startsWith("http") && !src.startsWith("/")) {
          const themePath = getThemePath();
          src = themePath + "/" + src;
        }
        img.src = src;
      });
    }
  }

  // =============================================
  // 15. NAVEGAÇÃO ATIVA
  // =============================================

  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-list a[href^='#']");

    let current = "";
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${current}` || (current === "" && href === "#top")) {
        link.classList.add("active");
      }
    });
  }

  // =============================================
  // 16. ANIMAÇÃO DO TÍTULO HERO
  // =============================================

  function initHeroTitleAnimation() {
    const title = document.querySelector(".hero-title.fill-words");

    if (title) {
      setTimeout(() => {
        title.classList.add("animating");
      }, 500);

      const spans = title.querySelectorAll("span");
      let completedSpans = 0;

      spans.forEach((span) => {
        span.addEventListener("animationend", function () {
          completedSpans++;
          if (completedSpans === spans.length) {
            title.classList.add("animation-complete");
            title.classList.remove("animating");
          }
        });
      });

      setTimeout(() => {
        if (!title.classList.contains("animation-complete")) {
          title.classList.add("animation-complete");
          title.classList.remove("animating");
        }
      }, 6000);
    }
  }

  // =============================================
  // 16.5. OTIMIZAÇÃO DO VÍDEO DO HERO
  // =============================================

  function initHeroVideoOptimization() {
    const heroVideo = document.querySelector(".hero-video");
    if (!heroVideo) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      heroVideo.pause();
      heroVideo.removeAttribute("autoplay");
      return;
    }

    if ("IntersectionObserver" in window) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              heroVideo.play().catch(() => {});
            } else {
              heroVideo.pause();
            }
          });
        },
        { threshold: 0.1 },
      );

      heroObserver.observe(heroVideo);
    }
  }

  // =============================================
  // 17. INICIALIZAÇÃO COMPLETA
  // =============================================

  function init() {
    console.log("🚀 Iniciando aplicação...");

    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    updateHeader();
    initScrollReveal();
    initPortfolio();
    initMarquee();
    initLazyLoading();
    updateActiveNav();
    initHeroTitleAnimation();
    initHeroVideoOptimization();
    initBackToTop();

    document.querySelectorAll("section").forEach((section) => {
      section.style.opacity = "1";
      section.style.visibility = "visible";
    });

    document.querySelectorAll(".skeleton").forEach((el) => {
      el.classList.remove("skeleton");
    });

    console.log("✅ Aplicação inicializada com sucesso!");
  }

  // =============================================
  // 18. EVENT LISTENERS GLOBAIS
  // =============================================

  window.addEventListener("scroll", throttle(updateHeader, 100));
  window.addEventListener("scroll", debounce(updateActiveNav, 50));

  window.addEventListener(
    "resize",
    debounce(() => {
      updateHeader();
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    }, 250),
  );

  window.addEventListener("load", () => {
    const heroVideo = document.querySelector(".hero-video");
    if (heroVideo) {
      heroVideo.style.opacity = "1";
    }

    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 300);
  });

  // =============================================
  // 19. INICIALIZAR TUDO
  // =============================================

  init();

  // =============================================
  // 20. DEPURAÇÃO (APENAS EM DESENVOLVIMENTO)
  // =============================================

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("plusite.test")
  ) {
    setTimeout(() => {
      console.log("=== DEBUG INFO (AMBIENTE DE DESENVOLVIMENTO) ===");

      const criticalElements = {
        "Botão Voltar ao Topo": document.getElementById("backToTop"),
        "Modal de Vídeo": document.getElementById("modal"),
        "Formulário de Contato": document.getElementById("contactForm"),
        "Menu Mobile": document.getElementById("navToggleSticky"),
        "Vídeo Hero": document.querySelector(".hero-video"),
      };

      Object.entries(criticalElements).forEach(([name, element]) => {
        console.log(
          `${name}:`,
          element ? "✅ Encontrado" : "❌ Não encontrado",
        );
      });

      document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", function () {
          console.warn(`⚠️ Imagem quebrada: ${this.src}`);
          this.style.border = "2px solid #ef4444";
        });
      });
    }, 3000);
  }

  // =============================================
  // 21. EXPORTAR FUNÇÕES PARA DEBUG
  // =============================================

  window.PluralCriativo = {
    openVideoModal,
    closeVideoModal,
    showNotification,
    updateHeader,
    updateActiveNav,
    forceShowBackToTop: () => {
      const btn = document.getElementById("backToTop");
      if (btn) {
        btn.classList.add("visible");
        btn.style.opacity = "1";
        btn.style.visibility = "visible";
        btn.style.transform = "translateY(0)";
      }
    },
    testFormSubmission: () => {
      if (contactForm) {
        const testData = {
          name: "Teste",
          email: "teste@exemplo.com",
          message: "Esta é uma mensagem de teste",
        };

        contactForm.querySelector("#name").value = testData.name;
        contactForm.querySelector("#email").value = testData.email;
        contactForm.querySelector("#message").value = testData.message;

        showNotification("Formulário preenchido para teste!", "info");
      }
    },
  };

  console.log("🎉 Script carregado completamente!");
});

// Animação de preenchimento do título (compatibilidade)
document.addEventListener("DOMContentLoaded", function () {
  const title = document.querySelector(".hero-title.fill-words");

  if (title) {
    const spans = title.querySelectorAll("span");
    spans.forEach((span) => {
      if (!span.hasAttribute("data-text")) {
        span.setAttribute("data-text", span.textContent);
      }
    });
  }
});

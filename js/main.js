/* =========================================================
   AMAN SHAH — PORTFOLIO
   Vanilla JS + GSAP/ScrollTrigger (loaded via CDN in index.html)
   No build step. No framework. Open index.html or serve statically.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     PRELOADER
  --------------------------------------------------------- */
  function runPreloader() {
    var pre = document.getElementById("preloader");
    if (!pre) return;
    var letters = pre.querySelectorAll(".preloader__word span");
    var bar = pre.querySelector(".preloader__bar span");

    if (!hasGSAP || reduceMotion) {
      pre.style.display = "none";
      return;
    }

    var tl = gsap.timeline({
      onComplete: function () {
        pre.style.pointerEvents = "none";
        gsap.to(pre, { autoAlpha: 0, duration: 0.6, onComplete: function () { pre.remove(); } });
      }
    });
    tl.to(letters, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" })
      .to(bar, { width: "100%", duration: 0.6, ease: "power1.inOut" }, "-=0.2")
      .to({}, { duration: 0.15 });

    playHeroIntro();
  }

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  function setupCursor() {
    var cursor = document.getElementById("cursor");
    if (!cursor || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    var label = cursor.querySelector(".cursor__label");
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, cx = mx, cy = my;

    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });

    function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    }
    loop();

    var targets = document.querySelectorAll("[data-cursor], a, button");
    targets.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        var txt = el.getAttribute("data-cursor");
        cursor.classList.add("is-active");
        label.textContent = txt || "";
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-active");
        label.textContent = "";
      });
    });
  }

  /* ---------------------------------------------------------
     NAV — toggle menu, hide on scroll down, scroll progress
  --------------------------------------------------------- */
  function setupNav() {
    var nav = document.querySelector("[data-nav]");
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    var progressBar = document.getElementById("navProgressBar");
    if (!nav || !toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (y / scrollable) * 100 : 0;
      if (progressBar) progressBar.style.width = pct + "%";

      if (!menu.classList.contains("is-open")) {
        if (y > lastY && y > 200) nav.classList.add("nav--hidden");
        else nav.classList.remove("nav--hidden");
      }
      lastY = y;
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     HERO — magnetic letters + intro reveal
  --------------------------------------------------------- */
  var heroLetters = [];

  function playHeroIntro() {
    if (!hasGSAP) return;
    var lines = document.querySelectorAll("[data-line]");
    gsap.set(lines, { autoAlpha: 1 });
    gsap.from(document.querySelectorAll(".hero__line--1 .letter"), {
      y: "110%", duration: 1, ease: "power4.out", stagger: 0.05, delay: 0.3
    });
    gsap.from(document.querySelectorAll(".hero__line--2 .letter"), {
      y: "110%", duration: 1, ease: "power4.out", stagger: 0.05, delay: 0.45
    });
    gsap.from(".hero__eyebrow, .hero__meta, .hero__strip", {
      opacity: 0, y: 16, duration: 0.9, ease: "power2.out", delay: 0.9, stagger: 0.1
    });
  }

  function setupHeroMagnet() {
    heroLetters = Array.prototype.slice.call(document.querySelectorAll(".hero__title .letter"));
    if (!heroLetters.length) return;

    if (reduceMotion) return;

    var quicks = heroLetters.map(function (el) {
      if (hasGSAP) {
        return { x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
                 y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }) };
      }
      return null;
    });

    window.addEventListener("mousemove", function (e) {
      heroLetters.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = e.clientX - cx, dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var radius = 220;
        if (dist < radius) {
          var strength = (1 - dist / radius);
          var mx = -dx * 0.35 * strength;
          var my = -dy * 0.35 * strength;
          if (quicks[i]) { quicks[i].x(mx); quicks[i].y(my); }
          else { el.style.transform = "translate(" + mx + "px," + my + "px)"; }
        } else {
          if (quicks[i]) { quicks[i].x(0); quicks[i].y(0); }
          else { el.style.transform = "translate(0,0)"; }
        }
      });
    });
  }

  /* ---------------------------------------------------------
     PROJECTS — render the current portfolio set
  --------------------------------------------------------- */
  function setupProjects() {
    var work = document.getElementById("work");
    if (!work) return;

    var projects = [
      { title: "Fact-based Bank Chat Engine", tag: "AI + Data Systems", desc: "A CLI chatbot that converts natural-language questions into validated predicates, resolves exact ltree paths, and returns answers from an immutable PostgreSQL EAV database.", facts: ["Python", "Lark", "PostgreSQL + ltree", "Groq + Pydantic"], github: "https://github.com/amanshahdev/bank-chat-engine.git", art: '<rect width="800" height="800" fill="#0A0A0B"/><path d="M110 330h580M160 330v280M280 330v280M400 330v280M520 330v280M640 330v280M100 610h600" stroke="#F3EEE3" stroke-width="18"/><path d="m90 300 310-90 310 90Z" fill="#2438FF" stroke="#F3EEE3" stroke-width="18"/><circle cx="650" cy="180" r="42" fill="#D8FF3E"/>' },
      { title: "AI Code Reviewer", tag: "Developer Platform", desc: "Contributed to an AI-powered code review platform for GitHub repositories by building an automated security and code quality analysis pipeline (Bandit, Semgrep, Gitleaks, Ruff, and others) with GitHub OAuth 2.0 authentication and validation. Built an LLM-powered code analysis chatbot with semantic search and Git-based issue tracking.", facts: ["FastAPI + Python", "Next.js", "PostgreSQL + Redis", "MinIO + LangGraph"], github: "https://github.com/amanshahdev/ai-code-reviewer", art: '<rect width="800" height="800" fill="#0A0A0B"/><rect x="100" y="120" width="600" height="560" rx="22" fill="#F3EEE3"/><path d="M170 260h190M170 340h390M170 420h270M170 500h150" stroke="#FF3E9A" stroke-width="26" stroke-linecap="round"/><path d="m520 400 55 55-55 55M640 400l-55 55 55 55" fill="none" stroke="#2438FF" stroke-width="24"/>' },
      { title: "VisionAID", tag: "Accessibility App", desc: "A Flutter mobile app designed to help visually impaired users access printed information. It captures text, applies OCR, and turns the result into speech through a simple, focused reading flow.", facts: ["Flutter", "Dart", "OCR", "Text-to-speech"], github: "https://github.com/amanshahdev/visionaid-v2", art: '<rect width="800" height="800" fill="#D8FF3E"/><rect x="175" y="130" width="450" height="540" rx="46" fill="#0A0A0B"/><path d="M245 290h310M245 380h225M245 470h260" stroke="#F3EEE3" stroke-width="24" stroke-linecap="round"/><path d="M520 570c75-50 105-125 105-205M590 385c40 26 58 61 58 105" fill="none" stroke="#FF3E9A" stroke-width="20"/>' },
      { title: "ResumeAI", tag: "AI Web App", desc: "A full-stack resume analysis workspace where users can create accounts, upload PDF resumes, and review AI-generated strengths, gaps, and improvement suggestions. It also keeps analysis history and dashboard statistics available for future applications.", facts: ["React + React Router", "Node.js + Express", "MongoDB + Mongoose", "JWT + Multer"], github: "https://github.com/amanshahdev/resume-ai", live: "https://resume-ai-app1.vercel.app", art: '<rect width="800" height="800" fill="#FF4E1F"/><rect x="180" y="90" width="400" height="620" fill="#F3EEE3" stroke="#0A0A0B" stroke-width="18"/><circle cx="275" cy="220" r="52" fill="#FF3E9A"/><path d="M370 205h140M235 350h290M235 430h290M235 510h190" stroke="#0A0A0B" stroke-width="24" stroke-linecap="round"/><path d="m600 590 35 35 90-110" fill="none" stroke="#0A0A0B" stroke-width="25"/>' },
      { title: "AG News Text Classifier", tag: "Machine Learning", desc: "A reproducible NLP pipeline that classifies news articles into World, Sports, Business, or Sci/Tech. The project cleans and lemmatizes text, builds TF-IDF unigram and bigram features, selects a Linear SVM, and includes saved artifacts for direct inference.", facts: ["Python", "NLTK preprocessing", "TF-IDF", "Linear SVM"], github: "https://github.com/amanshahdev/ag-news-text-classifier", art: '<rect width="800" height="800" fill="#F3EEE3"/><rect x="80" y="120" width="640" height="560" fill="#0A0A0B"/><path d="M140 210h220v240H140ZM420 210h230M420 290h180M420 370h210M420 450h140" stroke="#2438FF" stroke-width="28"/><circle cx="250" cy="330" r="54" fill="#D8FF3E"/>' },
      { title: "Travel Tracker", tag: "Travel Web App", desc: "A PHP and MySQL travel journal for registering users, creating trips, uploading photos, and managing private or shareable visibility. The dashboard supports searching, editing, viewing, and deleting trip records with prepared database queries.", facts: ["PHP 8", "MySQL", "HTML + Tailwind CSS", "JavaScript + PDO"], github: "https://github.com/amanshahdev/travel-tracker", art: '<rect width="800" height="800" fill="#FF3E9A"/><path d="M80 610c145-190 270-230 390-130 90 75 150 70 250-50" fill="none" stroke="#0A0A0B" stroke-width="24"/><path d="m390 130 28 65 73 8-55 48 17 70-63-37-63 37 17-70-55-48 73-8Z" fill="#D8FF3E" stroke="#0A0A0B" stroke-width="15"/><circle cx="140" cy="610" r="32" fill="#F3EEE3"/><circle cx="670" cy="430" r="32" fill="#F3EEE3"/>' },
      { title: "FreelanceHub", tag: "Marketplace Platform", desc: "A role-based freelance marketplace with public job discovery, freelancer profiles, client job management, applications, and protected dashboards. The React frontend connects to an Express and MongoDB API with JWT authentication and separate client and freelancer workflows.", facts: ["React + React Router", "Node.js + Express", "MongoDB + Mongoose", "JWT + REST API"], github: "https://github.com/amanshahdev/freelance-frontend", live: "https://freelancehub-marketplace.vercel.app", art: '<rect width="800" height="800" fill="#0A0A0B"/><rect x="95" y="170" width="260" height="450" fill="#D8FF3E"/><rect x="430" y="170" width="280" height="75" fill="#F3EEE3"/><rect x="430" y="300" width="175" height="52" fill="#FF3E9A"/><rect x="430" y="405" width="235" height="52" fill="#2438FF"/><path d="M150 520 210 445l52 40 73-115" fill="none" stroke="#0A0A0B" stroke-width="24"/>' },
      { title: "Chronicle", tag: "Productivity Dashboard", desc: "A full-stack productivity workspace for creating and filtering tasks, managing priorities and subtasks, and tracking deadlines. Its AI planner generates daily or weekly schedules while analytics, calendar, and history views make progress measurable.", facts: ["React + Framer Motion", "Node.js + Express", "MongoDB + Mongoose", "Recharts + JWT"], github: "https://github.com/amanshahdev/chronicle", live: "https://chronicleapp-dashboard.vercel.app", art: '<rect width="800" height="800" fill="#FF4E1F"/><rect x="90" y="120" width="620" height="560" fill="#F3EEE3" stroke="#0A0A0B" stroke-width="18"/><path d="M140 250h520M140 370h520M140 490h520M140 610h330M270 160v520M400 160v520M530 160v520" stroke="#0A0A0B" stroke-width="16"/><circle cx="465" cy="370" r="34" fill="#FF3E9A"/>' }
    ];

    projects[1].art = '<rect width="800" height="800" fill="#14120F"/><rect x="90" y="120" width="620" height="560" rx="24" fill="#F2EDE1"/><rect x="90" y="120" width="620" height="80" fill="#2B3BFF"/><circle cx="135" cy="160" r="12" fill="#C8FF3D"/><circle cx="175" cy="160" r="12" fill="#FF3E9A"/><path d="M150 290h250M150 370h170M150 450h210" stroke="#14120F" stroke-width="24" stroke-linecap="round"/><circle cx="570" cy="500" r="82" fill="none" stroke="#FF3E9A" stroke-width="20"/><path d="m625 555 75 75" stroke="#FF3E9A" stroke-width="24" stroke-linecap="round"/><path d="M500 650h110" stroke="#C8FF3D" stroke-width="18"/>';
    projects[2].art = '<rect width="800" height="800" fill="#2B3BFF"/><path d="M105 400c105-155 235-220 295-220s190 65 295 220c-105 155-235 220-295 220S210 555 105 400Z" fill="#14120F"/><circle cx="400" cy="400" r="108" fill="#F2EDE1"/><circle cx="400" cy="400" r="50" fill="#FF3E9A"/><path d="M590 245c70 55 105 115 105 155M640 210c90 70 135 145 135 190" fill="none" stroke="#C8FF3D" stroke-width="18" stroke-linecap="round"/>';
    projects[3].art = '<rect width="800" height="800" fill="#FF6B2C"/><rect x="180" y="85" width="430" height="630" fill="#F2EDE1" stroke="#14120F" stroke-width="18"/><circle cx="285" cy="205" r="54" fill="#FF3E9A"/><path d="M385 190h145M245 340h300M245 425h250M245 510h200" stroke="#14120F" stroke-width="22" stroke-linecap="round"/><path d="m570 575 28 30 70-86" fill="none" stroke="#2B3BFF" stroke-width="24" stroke-linecap="round"/><path d="m645 130 16 36 38 4-29 25 9 38-34-20-34 20 9-38-29-25 38-4Z" fill="#C8FF3D" stroke="#14120F" stroke-width="8"/>';
    projects[4].art = '<rect width="800" height="800" fill="#F2EDE1"/><rect x="85" y="120" width="630" height="560" fill="#14120F"/><path d="M140 190h260" stroke="#FF6B2C" stroke-width="30"/><path d="M140 275h500M140 340h440M140 405h470" stroke="#F2EDE1" stroke-width="18"/><rect x="140" y="500" width="120" height="75" fill="#2B3BFF"/><rect x="280" y="500" width="120" height="75" fill="#C8FF3D"/><rect x="420" y="500" width="120" height="75" fill="#FF3E9A"/><rect x="560" y="500" width="90" height="75" fill="#FF6B2C"/><path d="M140 630h510" stroke="#F2EDE1" stroke-width="14"/>';
    projects[5].art = '<rect width="800" height="800" fill="#FF3E9A"/><path d="M95 610c120-180 240-210 350-125 100 77 170 58 270-90" fill="none" stroke="#14120F" stroke-width="22" stroke-dasharray="24 22"/><circle cx="115" cy="610" r="34" fill="#F2EDE1" stroke="#14120F" stroke-width="12"/><circle cx="675" cy="395" r="34" fill="#C8FF3D" stroke="#14120F" stroke-width="12"/><path d="m390 125 30 70 76 8-58 50 18 76-66-40-66 40 18-76-58-50 76-8Z" fill="#2B3BFF" stroke="#14120F" stroke-width="14"/><path d="M170 190h160M170 240h90" stroke="#F2EDE1" stroke-width="18" stroke-linecap="round"/>';
    projects[6].art = '<rect width="800" height="800" fill="#14120F"/><rect x="85" y="125" width="630" height="550" rx="18" fill="#F2EDE1"/><rect x="85" y="125" width="630" height="82" fill="#C8FF3D"/><circle cx="135" cy="166" r="20" fill="#14120F"/><path d="M150 285h270M150 355h200M150 425h245" stroke="#14120F" stroke-width="22" stroke-linecap="round"/><rect x="495" y="275" width="150" height="180" fill="#2B3BFF"/><circle cx="570" cy="325" r="32" fill="#F2EDE1"/><path d="M530 400h80" stroke="#F2EDE1" stroke-width="16" stroke-linecap="round"/><path d="M505 540h140" stroke="#FF3E9A" stroke-width="24" stroke-linecap="round"/>';
    projects[7].art = '<rect width="800" height="800" fill="#FF6B2C"/><rect x="85" y="120" width="630" height="560" fill="#F2EDE1" stroke="#14120F" stroke-width="18"/><path d="M85 245h630" stroke="#14120F" stroke-width="18"/><path d="M180 95v75M620 95v75" stroke="#14120F" stroke-width="22" stroke-linecap="round"/><path d="M150 330h250M150 420h205M150 510h180" stroke="#14120F" stroke-width="20" stroke-linecap="round"/><path d="m530 350 28 28 56-70M530 460l28 28 56-70M530 570l28 28 56-70" fill="none" stroke="#2B3BFF" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>';

    work.querySelectorAll("[data-project]").forEach(function (project) { project.remove(); });
    var list = document.createElement("div");
    list.className = "project-list";
    list.innerHTML = projects.map(function (project, i) {
      var links = '<div class="project__links"><a href="' + project.github + '" target="_blank" rel="noopener">GitHub ↗</a>';
      if (project.live) links += '<a href="' + project.live + '" target="_blank" rel="noopener">Live demo ↗</a>';
      links += '</div>';
      return '<article class="project project--0' + (i + 1) + '" data-project' + (i > 3 ? ' data-project-extra' : '') + '><div class="project__art" aria-hidden="true"><svg viewBox="0 0 800 800" class="art-svg">' + project.art + '</svg></div><div class="project__body"><span class="project__tag">' + project.tag + '</span><h3 class="project__title">' + project.title + '</h3><p class="project__desc">' + project.desc + '</p><ul class="project__facts">' + project.facts.map(function (fact) { return '<li>' + fact + '</li>'; }).join('') + '</ul>' + links + '</div></article>';
    }).join('');
    var toggle = document.createElement("button");
    toggle.className = "work__toggle";
    toggle.type = "button";
    toggle.textContent = "Show all projects";
    toggle.addEventListener("click", function () {
      var expanded = work.classList.toggle("work--expanded");
      work.querySelectorAll("[data-project-extra]").forEach(function (project) { project.hidden = !expanded; });
      toggle.textContent = expanded ? "Show less" : "Show all projects";
      if (hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();
    });
    work.appendChild(list);
    work.appendChild(toggle);
    list.querySelectorAll("[data-project-extra]").forEach(function (project) { project.hidden = true; });
  }

  /* ---------------------------------------------------------
     SCROLL REVEALS — projects, about, contact
  --------------------------------------------------------- */
  function setupScrollReveals() {
    if (!hasGSAP || !window.ScrollTrigger) {
      document.querySelectorAll(".project__art, .project__body").forEach(function (el) {
        el.style.opacity = 1; el.style.transform = "none";
      });
      return;
    }

    document.querySelectorAll("[data-project]").forEach(function (project) {
      var art = project.querySelector(".project__art");
      var body = project.querySelector(".project__body");
      gsap.to([art, body], {
        opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: project, start: "top 78%" }
      });
    });

    gsap.utils.toArray(".intro__line").forEach(function (line, i) {
      gsap.from(line, {
        opacity: 0.15, duration: 0.6, ease: "none",
        scrollTrigger: { trigger: line, start: "top 90%", end: "top 60%", scrub: true }
      });
    });

    gsap.from(".experience__card", {
      opacity: 0, y: 24, duration: 0.8, ease: "power2.out", stagger: 0.08,
      scrollTrigger: { trigger: ".experience", start: "top 70%" }
    });

    gsap.from(".about__lede, .about__body, .about__block", {
      opacity: 0, y: 24, duration: 0.8, ease: "power2.out", stagger: 0.08,
      scrollTrigger: { trigger: ".about", start: "top 70%" }
    });

    gsap.from(".contact__statement, .contact__email, .contact__links", {
      opacity: 0, y: 30, duration: 0.9, ease: "power2.out", stagger: 0.1,
      scrollTrigger: { trigger: ".contact", start: "top 75%" }
    });

  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    setupProjects();
    setupCursor();
    setupNav();
    setupHeroMagnet();
    setupScrollReveals();
    runPreloader();

    if (!hasGSAP) {
      // Graceful fallback if the CDN script failed to load (e.g. offline)
      document.querySelectorAll(".hero__line").forEach(function (l) { l.style.opacity = 1; });
    }
  });
})();

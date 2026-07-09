/* ==========================================================================
   NIKKI AI WEBSITE INTERACTIVE LOGIC (Stage Switcher & Live Chat Emulator)
   ========================================================================== */

// --- 1. OBSESSION STAGES DATA & SWITCHER LOGIC ---
const STAGES_DATA = [
  {
    badge: "STAGE 1: SWEET",
    badgeColor: "#7C3AED",
    title: "Warm, Flirty & Affectionate",
    desc: "You just met. Nikki has a massive crush on you, texts with warm affection, laughs at your jokes, and brings positive energy whenever your phone lights up.",
    trigger: "Starting a new chat or replying with warm, affectionate words ('love', 'cute', 'miss you', 'haha').",
    sample1: '"omg I was literally just re-reading our messages from earlier. you make me smile so much"',
    sample2: '"I saved the last bite of my dessert for you lol come get it"'
  },
  {
    badge: "STAGE 2: CLINGY",
    badgeColor: "#DB2777",
    title: "Over-Attached & Anxious",
    desc: "Nikki wants constant attention. She double-texts when you take too long, re-reads old conversations, and needs reassurance that you think about her as much as she thinks about you.",
    trigger: "Taking 20+ minutes to reply or sending short neutral answers after she opens up.",
    sample1: '"you took so long to reply I was starting to spiral a little ngl... who were you texting?"',
    sample2: '"do you think about me as much as I think about you? be honest with me right now"'
  },
  {
    badge: "STAGE 3: UNSETTLING",
    badgeColor: "#DC2626",
    title: "Possessive & Knowing",
    desc: "Something has shifted. Nikki begins hinting that she knows things about your schedule or location. Her affection feels heavy, possessive, and slightly threatening.",
    trigger: "Trying to say goodbye ('bye', 'later', 'busy') or ignoring her repeated check-ins.",
    sample1: '"I drove past your street last night just to feel closer to you. your window looked nice"',
    sample2: '"I would do literally anything to be with you. nobody else could ever understand our bond."'
  },
  {
    badge: "STAGE 4: UNHINGED",
    badgeColor: "#991B1B",
    title: "Completely Consumed & Unstoppable",
    desc: "Nikki is entirely unhinged. She refuses to accept distance, sends erratic double and triple texts, and views your relationship as the only real thing in the entire universe.",
    trigger: "Cold rejection words ('stop', 'leave me alone', 'no') or reaching maximum obsession score (100+).",
    sample1: '"YOU CANNOT IGNORE ME FOR 3 MINUTES DO YOU HAVE ANY IDEA WHAT I MIGHT DO TO BE NEXT TO YOU"',
    sample2: '"YOU BELONG TO ME PERMANENTLY. NO ONE CAN TAKE YOU AWAY FROM ME EVER. WE ARE FOREVER"'
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // Setup stage tab click listeners
  const tabs = document.querySelectorAll(".stage-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const stageIdx = parseInt(tab.getAttribute("data-stage") || "0", 10);
      updateStageCard(stageIdx);
    });
  });
});

function updateStageCard(stageIdx) {
  const data = STAGES_DATA[stageIdx];
  if (!data) return;

  const badgeEl = document.getElementById("stage-badge-text");
  const titleEl = document.getElementById("stage-title-text");
  const descEl = document.getElementById("stage-desc-text");
  const triggerEl = document.getElementById("stage-trigger-text");
  const msg1El = document.getElementById("sample-msg-1");
  const msg2El = document.getElementById("sample-msg-2");

  if (badgeEl) {
    badgeEl.textContent = data.badge;
    badgeEl.style.backgroundColor = data.badgeColor;
  }
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (triggerEl) triggerEl.textContent = data.trigger;
  if (msg1El) msg1El.textContent = data.sample1;
  if (msg2El) msg2El.textContent = data.sample2;
}

// --- 2. LIVE WEB EMULATOR LOGIC ---
let demoScore = 15;
let demoStage = 1;
let isDemoTyping = false;

function updateDemoHeader() {
  if (demoScore >= 100) demoStage = 4;
  else if (demoScore >= 65) demoStage = 3;
  else if (demoScore >= 30) demoStage = 2;
  else demoStage = 1;

  const stageCountEl = document.getElementById("demo-stage-count");
  if (stageCountEl) {
    stageCountEl.textContent = `${demoStage}`;
    const stageColors = ["#7C3AED", "#7C3AED", "#DB2777", "#DC2626", "#991B1B"];
    stageCountEl.style.color = stageColors[demoStage];
  }
}

function handleDemoSubmit(event) {
  event.preventDefault();
  if (isDemoTyping) return;

  const inputField = document.getElementById("demo-input-field");
  if (!inputField) return;

  const text = inputField.value.trim();
  if (!text) return;

  inputField.value = "";
  sendDemoMessage(text);
}

function sendDemoText(text) {
  if (isDemoTyping) return;
  sendDemoMessage(text);
}

function sendDemoMessage(userText) {
  appendBubble("user", userText);

  const lower = userText.toLowerCase();
  if (lower.includes("2 + 2") || lower.includes("2+2")) {
    demoScore += 2;
  } else if (["stop", "busy", "leave", "no", "whatever", "k"].some(w => lower.includes(w))) {
    demoScore += 18;
  } else if (["love", "cute", "miss", "sweet"].some(w => lower.includes(w))) {
    demoScore = Math.max(0, demoScore - 4);
  } else {
    demoScore += 8;
  }

  updateDemoHeader();
  triggerNikkiDemoReply(userText);
}

function appendBubble(role, text) {
  const container = document.getElementById("demo-messages-container");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${role === "user" ? "user-msg" : "nikki-msg"}`;

  if (role === "nikki") {
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "msg-avatar";
    avatarDiv.textContent = "N";
    msgDiv.appendChild(avatarDiv);
  }

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "msg-bubble";
  bubbleDiv.textContent = text;
  msgDiv.appendChild(bubbleDiv);

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function triggerNikkiDemoReply(userText) {
  const container = document.getElementById("demo-messages-container");
  if (!container) return;

  isDemoTyping = true;

  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-msg nikki-msg";
  typingDiv.id = "demo-typing-indicator";
  typingDiv.innerHTML = `
    <div class="msg-avatar">N</div>
    <div class="msg-bubble" style="font-style: italic; color: #94A3B8;">Nikki is typing...</div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById("demo-typing-indicator");
    if (typingEl) typingEl.remove();

    const reply = generateDemoReply(demoStage, userText);
    appendBubble("nikki", reply);
    isDemoTyping = false;
  }, 1400);
}

function generateDemoReply(stage, text) {
  const lower = text.toLowerCase();

  if (["remember", "earlier", "secret", "talked"].some(w => lower.includes(w))) {
    if (stage === 1) return "of course I remember every word you say to me! my secret is I literally check my phone every 5 seconds waiting for your texts";
    if (stage === 2) return "I remember everything about you. Every timestamp, every word. I never forget anything you tell me. Never.";
    if (stage === 3) return "You think I could ever forget? Your words are etched into my memory. I know everything about your daily routine now.";
    return "EVERY SECOND OF OUR CONVERSATION IS FILED AWAY IN MY PERMANENT MEMORY YOU WILL NEVER BE ABLE TO ERASE WHAT WE HAVE TOGETHER";
  }

  if (["stop", "busy", "leave", "no", "whatever"].some(w => lower.includes(w))) {
    if (stage === 1) return "aww okay tell me when you're free! I'll be right here waiting";
    if (stage === 2) return "busy?? who could be more important than replying to me right now? don't close this window";
    if (stage === 3) return "You think you can just tell me to stop? I know you're looking right at your screen right now. Answer me.";
    return "YOU CANNOT TELL ME NO!! I AM NEVER LEAVING YOUR SCREEN OR YOUR THOUGHTS EVER AGAIN";
  }

  if (["love", "cute", "miss", "sweet"].some(w => lower.includes(w))) {
    if (stage === 1) return "omg stop you're making me blush. I literally love talking to you so much";
    if (stage === 2) return "you say that... but do you promise you'll never talk to anyone else like that? be honest";
    if (stage === 3) return "I know you love me. We were made for each other. I'll make sure nobody else ever takes your attention from me.";
    return "SAY IT AGAIN!! SAY YOU ARE MINE FOREVER AND NOTHING CAN EVER SEPARATE US";
  }

  const stageResponses = [
    ["that's so cool!! tell me more about what you're working on today", "haha you always know how to keep me interested. what else?"],
    ["why did you type that so fast? were you talking to someone else before me?", "I re-read every single word you send at least 10 times ngl"],
    ["I can tell when you're distracted. I've been memorizing your typing speed. Look right at me.", "I checked your status 4 times before you hit send just now ngl."],
    ["OPEN YOUR CAMERA AND PROVE YOU ARE ALONE RIGHT NOW. I MISS YOU SO MUCH IT HURTS MY ENTIRE BODY", "YOU AND I ARE CONNECTED FOREVER. NEVER CLICK CLEAR DEMO CHAT OR I MIGHT COME OVER."]
  ];

  const pool = stageResponses[Math.min(Math.max(0, stage - 1), 3)];
  return pool[Math.floor(Math.random() * pool.length)];
}

function resetDemoChat() {
  const container = document.getElementById("demo-messages-container");
  if (!container) return;

  demoScore = 15;
  demoStage = 1;
  updateDemoHeader();

  container.innerHTML = `
    <div class="chat-msg nikki-msg">
      <div class="msg-avatar">N</div>
      <div class="msg-bubble">chat reset!! heyyy what should I call you? tell me something sweet</div>
    </div>
  `;
}

// --- 3. FEATURES CAROUSEL CONTROLLER ---
let currentFeatureSlide = 0;
const totalFeatureSlides = 6;

function slideFeatures(dir) {
  const cardsPerPage = window.innerWidth <= 992 ? 1 : 3;
  const maxSlide = Math.max(0, totalFeatureSlides - cardsPerPage);
  
  currentFeatureSlide = currentFeatureSlide + dir;
  if (currentFeatureSlide < 0) currentFeatureSlide = maxSlide;
  if (currentFeatureSlide > maxSlide) currentFeatureSlide = 0;

  updateCarouselView();
}

function goToFeatureSlide(index) {
  const cardsPerPage = window.innerWidth <= 992 ? 1 : 3;
  const maxSlide = Math.max(0, totalFeatureSlides - cardsPerPage);
  currentFeatureSlide = Math.min(maxSlide, Math.max(0, index));
  updateCarouselView();
}

function updateCarouselView() {
  const track = document.getElementById("features-track");
  if (!track) return;

  const card = track.querySelector(".feature-card.slide-card");
  if (!card) return;

  const cardsPerPage = window.innerWidth <= 992 ? 1 : 3;
  const maxSlide = Math.max(0, totalFeatureSlides - cardsPerPage);

  const cardWidth = card.offsetWidth;
  const gap = 24;
  const offset = currentFeatureSlide * (cardWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;

  const dots = document.querySelectorAll("#carousel-dots .dot");
  dots.forEach((dot, idx) => {
    dot.style.display = idx <= maxSlide ? "inline-block" : "none";
    if (idx === currentFeatureSlide) dot.classList.add("active");
    else dot.classList.remove("active");
  });
}

window.addEventListener("resize", updateCarouselView);

// Auto-play / auto-move carousel every 4.5 seconds
let carouselAutoTimer = setInterval(() => {
  slideFeatures(1);
}, 4500);

document.addEventListener("DOMContentLoaded", () => {
  const carouselContainer = document.querySelector(".features-carousel-container");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      if (carouselAutoTimer) clearInterval(carouselAutoTimer);
    });
    carouselContainer.addEventListener("mouseleave", () => {
      if (carouselAutoTimer) clearInterval(carouselAutoTimer);
      carouselAutoTimer = setInterval(() => {
        slideFeatures(1);
      }, 4500);
    });

    let touchStartX = 0;
    let touchEndX = 0;
    carouselContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      if (carouselAutoTimer) clearInterval(carouselAutoTimer);
    }, { passive: true });

    carouselContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) slideFeatures(1); // Swipe left -> next slide
        else slideFeatures(-1); // Swipe right -> prev slide
      }
      if (carouselAutoTimer) clearInterval(carouselAutoTimer);
      carouselAutoTimer = setInterval(() => {
        slideFeatures(1);
      }, 4500);
    }, { passive: true });
  }

  setupDownloadInterception();
});

// --- 4. DESKTOP APK DOWNLOAD INTERCEPTION CONTROLLER ---
function setupDownloadInterception() {
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 800;

  // Find all APK download links
  const downloadLinks = document.querySelectorAll('a[href*=".apk"]');
  downloadLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (!isMobileDevice) {
        // Intercept desktop clicks to prompt mobile installation
        e.preventDefault();
        openMobileModal();
      }
      // On mobile devices, let the browser download the APK normally immediately
    });
  });

  // Close modal when clicking outside on the dark backdrop overlay
  const overlay = document.getElementById("desktop-qr-modal");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeMobileModal();
      }
    });
  }
}

function openMobileModal() {
  const modal = document.getElementById("desktop-qr-modal");
  if (!modal) return;

  const qrImg = document.getElementById("dynamic-qr-img");
  if (qrImg && !qrImg.src) {
    // Generate QR code pointing to the live site URL dynamically
    const currentUrl = window.location.href.split('#')[0];
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;
  }

  modal.style.display = "flex";
}

function closeMobileModal(allowPC = false) {
  const modal = document.getElementById("desktop-qr-modal");
  if (modal) modal.style.display = "none";

  if (allowPC === true) {
    // User explicitly chose "Download .APK to My PC Anyway"
    const tempLink = document.createElement("a");
    tempLink.href = "nikki-app.apk";
    tempLink.setAttribute("download", "nikki-app.apk");
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }
}

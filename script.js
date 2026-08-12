document.addEventListener("DOMContentLoaded", () => {
  const messages = [
    // Need to apply more languages here
    { text: "Olá mundo!", lang: "Portuguese" },
    { text: "Hello World!", lang: "English" },
    { text: "Bonjour le monde!", lang: "French" },
    { text: "Hola Mundo!", lang: "Spanish" },
    { text: "Ciao mondo!", lang: "Italian" },
    { text: "Hallo Welt!", lang: "German" },
    { text: "こんにちは世界！", lang: "Japanese" },
    { text: "안녕하세요 세계!", lang: "Korean" },
    { text: "Привет, мир!", lang: "Russian" },
    { text: "مرحبا بالعالم!", lang: "Arabic" },
    { text: "你好世界!", lang: "Chinese (Mandarin)" },
    { text: "สวัสดีชาวโลก!", lang: "Thai" },
    { text: "Xin chào thế giới!", lang: "Vietnamese" },
    { text: "Halo Dunia!", lang: "Indonesian" },
    { text: "Merhaba Dünya!", lang: "Turkish" },
    { text: "Γεια σας κόσμε!", lang: "Greek" },
    { text: "Cześć świecie!", lang: "Polish" },
    { text: "Ahoj světe!", lang: "Czech" },
    { text: "Hej världen!", lang: "Swedish" },
    { text: "Hallo Wereld!", lang: "Dutch" },
    { text: "Terve maailma!", lang: "Finnish" },
    { text: "Hei verden!", lang: "Norwegian" },
    { text: "Hej verden!", lang: "Danish" },
    { text: "שלום עולם!", lang: "Hebrew" },
    { text: "नमस्ते दुनिया!", lang: "Hindi" },
    { text: "হ্যালো বিশ্ব!", lang: "Bengali" },
    { text: "مرحبا دنیا!", lang: "Urdu" },
    { text: "Habagat sa mundo!", lang: "Filipino" },
    { text: "Halo Dunia!", lang: "Malay" },
    { text: "Kamusta mundo!", lang: "Tagalog" },
    { text: "Salam dunia!", lang: "Swahili" },
    { text: "Halló heimur!", lang: "Icelandic" },
    { text: "Helló világ!", lang: "Hungarian" },
    { text: "Salut lume!", lang: "Romanian" },
    { text: "Привет свят!", lang: "Bulgarian" },
    { text: "سلام دنیا!", lang: "Persian (Farsi)" },
    { text: "Привіт Світ!", lang: "Ukrainian" },
    { text: "Zdravo svete!", lang: "Serbian" },
    { text: "Ahoj svet!", lang: "Slovak" },
    { text: "Pozdrav svijete!", lang: "Croatian" },
    { text: "Pozdravljen svet!", lang: "Slovenian" },
    { text: "Tere maailm!", lang: "Estonian" },
    { text: "Sveika pasaule!", lang: "Latvian" },
    { text: "Labas pasauli!", lang: "Lithuanian" },
    { text: "გამარჯობა მსოფლიო!", lang: "Georgian" },
    { text: "Hallo Wêreld!", lang: "Afrikaans" },
    { text: "Hola Món!", lang: "Catalan" },
    { text: "Kaixo Mundua!", lang: "Basque" },
    { text: "Përshëndetje Botë!", lang: "Albanian" },
    { text: "Bongu Dinja!", lang: "Maltese" },
  ];

  // DOM Elements
  const changeButton = document.querySelector("#changeButton");
  const randomButton = document.querySelector("#randomButton");
  const speakButton = document.querySelector("#speakButton");
  const copyButton = document.querySelector("#copyButton");
  const soundToggle = document.querySelector("#soundToggle");
  const shuffleButton = document.querySelector("#shuffleButton");
  const quizButton = document.querySelector("#quizButton");
  const favoriteButton = document.querySelector("#favoriteButton");
  const statsButton = document.querySelector("#statsButton");
  const closeStatsBtn = document.querySelector("#closeStats");
  const resetStatsBtn = document.querySelector("#resetStats");
  const exportButton = document.querySelector("#exportButton");
  const quizModal = document.querySelector("#quizModal");
  const closeQuizBtn = document.querySelector("#closeQuiz");
  const quizHintBtn = document.querySelector("#quizHint");
  const searchInput = document.querySelector("#searchInput");
  const searchButton = document.querySelector("#searchButton");
  const loadingSpinner = document.querySelector("#loadingSpinner");
  const card = document.querySelector(".card");
  const messageSpan = card?.querySelector(".message");
  const messageCountSpan = document.querySelector("#messageCount");
  const totalMessagesSpan = document.querySelector("#totalMessages");
  const languageInfo = document.querySelector("#languageInfo");
  const favoritesCountSpan = document.querySelector("#favoritesCount");
  const streakDisplay = document.querySelector("#streakDisplay");
  const progressFill = document.querySelector("#progressFill");
  const statsModal = document.querySelector("#statsModal");

  // Check if essential elements are present
  if (
    !changeButton ||
    !randomButton ||
    !card ||
    !messageSpan ||
    !searchInput ||
    !searchButton
  ) {
    console.error("Required elements not found; aborting script.");
    return;
  }

  // Safe localStorage wrapper
  const Storage = {
    get: (key, defaultValue) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn(`Failed to read from localStorage: ${key}`, e);
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn(`Failed to write to localStorage: ${key}`, e);
      }
    },
  };

  // Initialize
  totalMessagesSpan.textContent = messages.length;

  let currentIndex = -1;
  let isShuffle = false;
  let isQuizMode = false;
  let messageCount = 0;
  let soundEnabled = true;
  let favorites = Storage.get("favorites", []);
  let achievements = Storage.get("achievements", []);
  const languagesSeen = new Set();
  let currentStreak = 0;
  let quizCorrect = 0;

  // Update favorites display
  function updateFavoritesCount() {
    favoritesCountSpan.textContent = favorites.length;
  }

  // Update streak display
  function updateStreakDisplay() {
    currentStreak = messageCount > 0 ? messageCount : 0;
    streakDisplay.textContent =
      currentStreak > 0 ? "🔥 " + currentStreak : "🔥 0";
  }

  // Check achievements
  function checkAchievements() {
    const newAchievements = [];

    if (messageCount === 10 && !achievements.includes("10")) {
      newAchievements.push("10");
      playSuccessSound();
    }
    if (messageCount === 50 && !achievements.includes("50")) {
      newAchievements.push("50");
      playSuccessSound();
    }
    if (messageCount === 100 && !achievements.includes("100")) {
      newAchievements.push("100");
      playSuccessSound();
    }
    if (favorites.length === 5 && !achievements.includes("collector")) {
      newAchievements.push("collector");
      playSuccessSound();
    }
    if (
      languagesSeen.size === messages.length &&
      !achievements.includes("polyglot")
    ) {
      newAchievements.push("polyglot");
      playSuccessSound();
    }

    if (newAchievements.length > 0) {
      achievements.push(...newAchievements);
      Storage.set("achievements", achievements);
    }
  }

  // Update progress bar
  function updateProgressBar() {
    const progress = (messageCount / messages.length) * 100;
    progressFill.style.width = progress + "%";
    updateStreakDisplay();
    checkAchievements();
  }

  // Check if current message is favorited
  function isFavorited() {
    return favorites.some((fav) => fav.index === currentIndex);
  }

  // Add/remove from favorites
  function toggleFavorite() {
    if (currentIndex < 0) return;

    const isFav = isFavorited();
    if (isFav) {
      favorites = favorites.filter((fav) => fav.index !== currentIndex);
      favoriteButton.textContent = "🤍";
      favoriteButton.classList.remove("favorited");
    } else {
      favorites.push({
        index: currentIndex,
        text: messages[currentIndex].text,
        lang: messages[currentIndex].lang,
      });
      favoriteButton.textContent = "❤️";
      favoriteButton.classList.add("favorited");
    }

    Storage.set("favorites", favorites);
    updateFavoritesCount();
  }

  function isRTL(text) {
    return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
  }

  function playSound() {
    if (!soundEnabled) return;
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log("Audio not available");
    }
  }

  function playSuccessSound() {
    if (!soundEnabled) return;
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const now = audioContext.currentTime;

      // Play two tones for success
      for (let i = 0; i < 2; i++) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = 1000 + i * 200;
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);

        oscillator.start(now + i * 0.1);
        oscillator.stop(now + i * 0.1 + 0.15);
      }
    } catch (e) {
      console.log("Audio not available");
    }
  }

  function setMessage(index) {
    const messageObj = messages[index];
    const message = messageObj.text;
    messageSpan.textContent = message;
    languageInfo.textContent = messageObj.lang;
    card.dir = isRTL(message) ? "rtl" : "ltr";
    card.classList.remove("message-enter");

    // Trigger animation
    void card.offsetWidth;
    card.classList.add("message-enter");

    messageCount++;
    messageCountSpan.textContent = messageCount;
    languagesSeen.add(messageObj.lang);
    updateProgressBar();

    // Milestone celebrations
    if (messageCount % 10 === 0) {
      celebrateMilestone();
    }

    // Update favorite button
    if (isFavorited()) {
      favoriteButton.textContent = "❤️";
    } else {
      favoriteButton.textContent = "🤍";
    }
    favoriteButton.classList.remove("favorited");

    playSound();
    console.log(
      "Message index:",
      index,
      "language:",
      messageObj.lang,
      "message:",
      message,
    );
  }

  function celebrateMilestone() {
    card.classList.add("milestone-celebration");
    setTimeout(() => card.classList.remove("milestone-celebration"), 500);
    playSound();
  }

  function speakMessage() {
    if (!messageSpan.textContent || currentIndex < 0) return;

    const text = messages[currentIndex].text;
    const lang = messages[currentIndex].lang;

    // Map language to speech language code
    const langMap = {
      Portuguese: "pt-BR",
      English: "en-US",
      French: "fr-FR",
      Spanish: "es-ES",
      Italian: "it-IT",
      German: "de-DE",
      Japanese: "ja-JP",
      Korean: "ko-KR",
      Russian: "ru-RU",
      Arabic: "ar-SA",
    };

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang] || "en-US";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }

  function shuffleAllMessages() {
    if (isShuffle) return;

    isShuffle = true;
    shuffleButton.disabled = true;
    shuffleButton.textContent = "⏳ Shuffling...";
    loadingSpinner.removeAttribute("hidden");

    let count = 0;
    const interval = setInterval(() => {
      if (count >= 15) {
        clearInterval(interval);
        isShuffle = false;
        shuffleButton.disabled = false;
        shuffleButton.textContent = "🎲 Shuffle";
        loadingSpinner.setAttribute("hidden", "");
        setRandomMessage();
        return;
      }
      setRandomMessage();
      count++;
    }, 100);
  }

  function setNextMessage() {
    currentIndex = (currentIndex + 1) % messages.length;
    setMessage(currentIndex);
  }

  function setRandomMessage() {
    currentIndex = Math.floor(Math.random() * messages.length);
    setMessage(currentIndex);
  }
  // yoyooy
  function copyToClipboard() {
    if (currentIndex >= 0) {
      const text = messages[currentIndex].text;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          const originalText = copyButton.textContent;
          copyButton.textContent = "✓ Copied!";
          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 1500);
        })
        .catch((err) => console.error("Copy failed:", err));
    }
  }

  function searchLanguage() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      setRandomMessage();
      return;
    }

    const foundIndex = messages.findIndex(
      (msg) =>
        msg.lang.toLowerCase().includes(query) ||
        msg.text.toLowerCase().includes(query),
    );

    if (foundIndex >= 0) {
      currentIndex = foundIndex;
      setMessage(foundIndex);
    } else {
      alert(
        `No language found for "${searchInput.value}". Try a full or partial language name.`,
      );
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? "🔊 Sound" : "🔇 Muted";
  }

  function showStats() {
    // Update stats
    document.querySelector("#statTotal").textContent = messageCount;
    document.querySelector("#statFavorites").textContent = favorites.length;
    document.querySelector("#statLanguages").textContent = languagesSeen.size;
    document.querySelector("#statStreak").textContent =
      messageCount > 0 ? "🔥 " + messageCount : "0";

    // Update favorites list
    const favoritesList = document.querySelector("#favoritesList");
    favoritesList.innerHTML = "";

    if (favorites.length > 0) {
      const listTitle = document.createElement("h3");
      listTitle.textContent = "Your Favorites";
      listTitle.style.marginTop = "1.5rem";
      listTitle.style.marginBottom = "1rem";
      listTitle.style.fontSize = "0.95rem";
      listTitle.style.color = "var(--text-color)";
      favoritesList.appendChild(listTitle);

      favorites.forEach((fav) => {
        const item = document.createElement("div");
        item.className = "favorite-item";
        item.innerHTML = `
          <div>
            <div>${fav.text}</div>
            <div class="favorite-lang">${fav.lang}</div>
          </div>
        `;
        favoritesList.appendChild(item);
      });
    }

    renderAchievements();
    statsModal.classList.add("active");
  }

  function hideStats() {
    statsModal.classList.remove("active");
  }

  function resetAllStats() {
    if (
      confirm(
        "Are you sure you want to reset all statistics and favorites? This cannot be undone.",
      )
    ) {
      messageCount = 0;
      favorites = [];
      achievements = [];
      languagesSeen.clear();
      quizCorrect = 0;
      messageCountSpan.textContent = "0";
      updateFavoritesCount();
      updateProgressBar();
      progressFill.style.width = "0%";
      Storage.set("favorites", favorites);
      Storage.set("achievements", achievements);
      hideStats();
      console.log("All stats reset!");
    }
  }

  function startQuiz() {
    isQuizMode = true;
    setRandomMessage();
    showQuiz();
  }

  function showQuiz() {
    if (currentIndex < 0) return;

    loadingSpinner.removeAttribute("hidden");

    const correctLang = messages[currentIndex].lang;
    const options = [];
    options.push(correctLang);

    // Add 3 random different languages
    while (options.length < 4) {
      const randomLang =
        messages[Math.floor(Math.random() * messages.length)].lang;
      if (!options.includes(randomLang)) {
        options.push(randomLang);
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    const quizMessage = document.querySelector("#quizMessage");
    const quizOptions = document.querySelector("#quizOptions");

    quizMessage.textContent = messages[currentIndex].text;
    quizOptions.innerHTML = "";

    options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = option;
      btn.addEventListener("click", () =>
        checkQuizAnswer(option, correctLang, btn),
      );
      quizOptions.appendChild(btn);
    });

    loadingSpinner.setAttribute("hidden", "");
    quizModal.classList.add("active");
  }

  function checkQuizAnswer(selected, correct, btn) {
    const allOptions = document.querySelectorAll(".quiz-option");
    allOptions.forEach((opt) => (opt.disabled = true));

    if (selected === correct) {
      btn.classList.add("correct");
      quizCorrect++;
      playSuccessSound();
    } else {
      btn.classList.add("incorrect");
      allOptions.forEach((opt) => {
        if (opt.textContent === correct) opt.classList.add("correct");
      });
    }

    setTimeout(() => {
      hideQuiz();
      setNextMessage();
    }, 1500);
  }

  function hideQuiz() {
    isQuizMode = false;
    quizModal.classList.remove("active");
  }

  function exportFavorites() {
    if (favorites.length === 0) {
      alert("No favorites to export!");
      return;
    }

    let exportText = "My Favorite Greetings:\n\n";
    favorites.forEach((fav, idx) => {
      exportText += `${idx + 1}. ${fav.text} (${fav.lang})\n`;
    });
    exportText += `\nTotal: ${favorites.length} favorites\nGenerated from Cards Shower`;

    navigator.clipboard
      .writeText(exportText)
      .then(() => {
        const btn = exportButton;
        const originalText = btn.textContent;
        btn.textContent = "✓ Exported!";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      })
      .catch((err) => console.error("Export failed:", err));
  }

  function renderAchievements() {
    const achievementsList = document.querySelector("#achievementsList");
    const achievementDefs = {
      10: { name: "10 Greetings", emoji: "📖", desc: "Viewed 10 messages" },
      50: { name: "50 Greetings", emoji: "📚", desc: "Viewed 50 messages" },
      100: { name: "Century", emoji: "💯", desc: "Viewed 100 messages" },
      collector: {
        name: "Collector",
        emoji: "💎",
        desc: "Favorited 5 messages",
      },
      polyglot: {
        name: "Polyglot Master",
        emoji: "🌍",
        desc: "Discovered all languages",
      },
    };

    achievementsList.innerHTML = "<h3>🏆 Achievements</h3>";

    Object.keys(achievementDefs).forEach((key) => {
      const def = achievementDefs[key];
      const unlocked = achievements.includes(key);
      const badge = document.createElement("div");
      badge.className = "achievement-badge" + (unlocked ? "" : " locked");
      badge.title = def.desc;
      badge.textContent = `${def.emoji} ${def.name}`;
      achievementsList.appendChild(badge);
    });
  }

  // Event listeners
  changeButton.addEventListener("click", setNextMessage);
  randomButton.addEventListener("click", setRandomMessage);
  speakButton.addEventListener("click", speakMessage);
  copyButton.addEventListener("click", copyToClipboard);
  soundToggle.addEventListener("click", toggleSound);
  shuffleButton.addEventListener("click", shuffleAllMessages);
  favoriteButton.addEventListener("click", toggleFavorite);
  statsButton.addEventListener("click", showStats);
  closeStatsBtn.addEventListener("click", hideStats);
  resetStatsBtn.addEventListener("click", resetAllStats);
  searchButton.addEventListener("click", searchLanguage);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchLanguage();
    }
  });

  // Close modal when clicking outside
  statsModal.addEventListener("click", (e) => {
    if (e.target === statsModal) hideStats();
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === " " || e.key === "Enter") {
      if (e.target === changeButton || e.target === randomButton) return;
      e.preventDefault();
      setNextMessage();
    } else if (e.key.toLowerCase() === "r") {
      e.preventDefault();
      setRandomMessage();
    } else if (e.key.toLowerCase() === "t") {
      e.preventDefault();
      speakMessage();
    } else if (e.key.toLowerCase() === "c") {
      e.preventDefault();
      copyToClipboard();
    } else if (e.key.toLowerCase() === "f" || e.key === "♥") {
      e.preventDefault();
      toggleFavorite();
    } else if (e.key.toLowerCase() === "h") {
      e.preventDefault();
      shuffleAllMessages();
    } else if (e.key.toLowerCase() === "s") {
      e.preventDefault();
      showStats();
    } else if (e.key === "Escape") {
      hideStats();
    }
  });

  // Initialize
  updateFavoritesCount();
  setRandomMessage();
  console.log("Cards Shower loaded successfully!");
});

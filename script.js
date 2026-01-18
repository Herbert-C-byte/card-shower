document.addEventListener('DOMContentLoaded', () => {
  const messages = [
    { text: 'Olá mundo!', lang: 'Portuguese' },
    { text: 'Hello World!', lang: 'English' },
    { text: 'Bonjour le monde!', lang: 'French' },
    { text: 'Hola Mundo!', lang: 'Spanish' },
    { text: 'Ciao mondo!', lang: 'Italian' },
    { text: 'Hallo Welt!', lang: 'German' },
    { text: 'こんにちは世界！', lang: 'Japanese' },
    { text: '안녕하세요 세계!', lang: 'Korean' },
    { text: 'Привет, мир!', lang: 'Russian' },
    { text: 'مرحبا بالعالم!', lang: 'Arabic' }
  ];

  // DOM Elements
  const changeButton = document.querySelector('#changeButton');
  const randomButton = document.querySelector('#randomButton');
  const copyButton = document.querySelector('#copyButton');
  const soundToggle = document.querySelector('#soundToggle');
  const favoriteButton = document.querySelector('#favoriteButton');
  const statsButton = document.querySelector('#statsButton');
  const closeStatsBtn = document.querySelector('#closeStats');
  const card = document.querySelector('.card');
  const messageSpan = card?.querySelector('.message');
  const messageCountSpan = document.querySelector('#messageCount');
  const totalMessagesSpan = document.querySelector('#totalMessages');
  const languageInfo = document.querySelector('#languageInfo');
  const favoritesCountSpan = document.querySelector('#favoritesCount');
  const progressFill = document.querySelector('#progressFill');
  const statsModal = document.querySelector('#statsModal');

  if (!changeButton || !randomButton || !card || !messageSpan) {
    console.error('Required elements not found; aborting script.');
    return;
  }

  // Initialize
  totalMessagesSpan.textContent = messages.length;

  let currentIndex = -1;
  let messageCount = 0;
  let soundEnabled = true;
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const languagesSeen = new Set();

  // Update favorites display
  function updateFavoritesCount() {
    favoritesCountSpan.textContent = favorites.length;
  }

  // Update progress bar
  function updateProgressBar() {
    const progress = (messageCount / messages.length) * 100;
    progressFill.style.width = progress + '%';
  }

  // Check if current message is favorited
  function isFavorited() {
    return favorites.some(fav => fav.index === currentIndex);
  }

  // Add/remove from favorites
  function toggleFavorite() {
    if (currentIndex < 0) return;
    
    const isFav = isFavorited();
    if (isFav) {
      favorites = favorites.filter(fav => fav.index !== currentIndex);
      favoriteButton.textContent = '🤍';
      favoriteButton.classList.remove('favorited');
    } else {
      favorites.push({
        index: currentIndex,
        text: messages[currentIndex].text,
        lang: messages[currentIndex].lang
      });
      favoriteButton.textContent = '❤️';
      favoriteButton.classList.add('favorited');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
  }

  function isRTL(text) {
    return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
  }

  function playSound() {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  function setMessage(index) {
    const messageObj = messages[index];
    const message = messageObj.text;
    messageSpan.textContent = message;
    languageInfo.textContent = messageObj.lang;
    card.dir = isRTL(message) ? 'rtl' : 'ltr';
    card.classList.remove('message-enter');
    
    // Trigger animation
    void card.offsetWidth;
    card.classList.add('message-enter');
    
    messageCount++;
    messageCountSpan.textContent = messageCount;
    languagesSeen.add(messageObj.lang);
    updateProgressBar();
    
    // Update favorite button
    if (isFavorited()) {
      favoriteButton.textContent = '❤️';
    } else {
      favoriteButton.textContent = '🤍';
    }
    favoriteButton.classList.remove('favorited');
    
    playSound();
    console.log('Message index:', index, 'language:', messageObj.lang, 'message:', message);
  }

  function setNextMessage() {
    currentIndex = (currentIndex + 1) % messages.length;
    setMessage(currentIndex);
  }

  function setRandomMessage() {
    currentIndex = Math.floor(Math.random() * messages.length);
    setMessage(currentIndex);
  }

  function copyToClipboard() {
    if (currentIndex >= 0) {
      const text = messages[currentIndex].text;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = copyButton.textContent;
        copyButton.textContent = '✓ Copied!';
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 1500);
      }).catch(err => console.error('Copy failed:', err));
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  }

  function showStats() {
    // Update stats
    document.querySelector('#statTotal').textContent = messageCount;
    document.querySelector('#statFavorites').textContent = favorites.length;
    document.querySelector('#statLanguages').textContent = languagesSeen.size;
    document.querySelector('#statStreak').textContent = messageCount > 0 ? '🔥 ' + messageCount : '0';
    
    // Update favorites list
    const favoritesList = document.querySelector('#favoritesList');
    favoritesList.innerHTML = '';
    
    if (favorites.length > 0) {
      const listTitle = document.createElement('h3');
      listTitle.textContent = 'Your Favorites';
      listTitle.style.marginTop = '1.5rem';
      listTitle.style.marginBottom = '1rem';
      listTitle.style.fontSize = '0.95rem';
      listTitle.style.color = 'var(--text-color)';
      favoritesList.appendChild(listTitle);
      
      favorites.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
          <div>
            <div>${fav.text}</div>
            <div class="favorite-lang">${fav.lang}</div>
          </div>
        `;
        favoritesList.appendChild(item);
      });
    }
    
    statsModal.classList.add('active');
  }

  function hideStats() {
    statsModal.classList.remove('active');
  }

  // Event listeners
  changeButton.addEventListener('click', setNextMessage);
  randomButton.addEventListener('click', setRandomMessage);
  copyButton.addEventListener('click', copyToClipboard);
  soundToggle.addEventListener('click', toggleSound);
  favoriteButton.addEventListener('click', toggleFavorite);
  statsButton.addEventListener('click', showStats);
  closeStatsBtn.addEventListener('click', hideStats);

  // Close modal when clicking outside
  statsModal.addEventListener('click', (e) => {
    if (e.target === statsModal) hideStats();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target === changeButton || e.target === randomButton) return;
      e.preventDefault();
      setNextMessage();
    } else if (e.key.toLowerCase() === 'r') {
      e.preventDefault();
      setRandomMessage();
    } else if (e.key.toLowerCase() === 'c') {
      e.preventDefault();
      copyToClipboard();
    } else if (e.key.toLowerCase() === 'f' || e.key === '♥') {
      e.preventDefault();
      toggleFavorite();
    } else if (e.key.toLowerCase() === 's') {
      e.preventDefault();
      showStats();
    } else if (e.key === 'Escape') {
      hideStats();
    }
  });

  // Initialize
  updateFavoritesCount();
  setRandomMessage();
  console.log('Cards Shower loaded successfully!');
});
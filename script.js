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

  const changeButton = document.querySelector('#changeButton');
  const randomButton = document.querySelector('#randomButton');
  const copyButton = document.querySelector('#copyButton');
  const soundToggle = document.querySelector('#soundToggle');
  const card = document.querySelector('.card');
  const messageSpan = card?.querySelector('.message');
  const messageCountSpan = document.querySelector('#messageCount');
  const totalMessagesSpan = document.querySelector('#totalMessages');
  const languageInfo = document.querySelector('#languageInfo');

  if (!changeButton || !randomButton || !card || !messageSpan) {
    console.error('Required elements not found; aborting script.');
    return;
  }

  // Initialize total messages
  totalMessagesSpan.textContent = messages.length;

  let currentIndex = -1;
  let messageCount = 0;
  let soundEnabled = true;

  function isRTL(text) {
    return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
  }

  function playSound() {
    if (!soundEnabled) return;
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

  // Event listeners
  changeButton.addEventListener('click', setNextMessage);
  randomButton.addEventListener('click', setRandomMessage);
  copyButton.addEventListener('click', copyToClipboard);
  soundToggle.addEventListener('click', toggleSound);

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target === changeButton || e.target === randomButton) return;
      e.preventDefault();
      setNextMessage();
    } else if (e.key.toLowerCase() === 'r') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      setRandomMessage();
    } else if (e.key.toLowerCase() === 'c') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      copyToClipboard();
    }
  });

  // Initialize with a random message
  setRandomMessage();
  console.log('Cards Shower loaded successfully!');
});
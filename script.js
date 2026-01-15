document.addEventListener('DOMContentLoaded', () => {
  const messages = [
    'Olá mundo!',
    'Hello World!',
    'Bonjour le monde!',
    'Hola Mundo!',
    'Ciao mondo!',
    'Hallo Welt!',
    'こんにちは世界！',
    '안녕하세요 세계!',
    'Привет, мир!',
    'مرحبا بالعالم!'
  ];

  const changeButton = document.querySelector('#changeButton');
  const randomButton = document.querySelector('#randomButton');
  const card = document.querySelector('.card');
  const messageSpan = card?.querySelector('.message');
  const messageCountSpan = document.querySelector('#messageCount');
  const totalMessagesSpan = document.querySelector('#totalMessages');

  if (!changeButton || !randomButton || !card || !messageSpan) {
    console.error('Required elements not found; aborting script.');
    return;
  }

  // Initialize total messages
  totalMessagesSpan.textContent = messages.length;

  let currentIndex = -1;
  let messageCount = 0;

  function isRTL(text) {
    return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
  }

  function setMessage(index) {
    const message = messages[index];
    messageSpan.textContent = message;
    card.dir = isRTL(message) ? 'rtl' : 'ltr';
    card.classList.remove('message-enter');
    
    // Trigger animation
    void card.offsetWidth;
    card.classList.add('message-enter');
    
    messageCount++;
    messageCountSpan.textContent = messageCount;
    
    console.log('Message index:', index, 'message:', message);
  }

  function setNextMessage() {
    currentIndex = (currentIndex + 1) % messages.length;
    setMessage(currentIndex);
  }

  function setRandomMessage() {
    currentIndex = Math.floor(Math.random() * messages.length);
    setMessage(currentIndex);
  }

  // Event listeners
  changeButton.addEventListener('click', setNextMessage);
  randomButton.addEventListener('click', setRandomMessage);

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
    }
  });

  // Initialize with a random message
  setRandomMessage();
  console.log('Cards Shower loaded successfully!');
});
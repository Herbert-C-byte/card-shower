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

  const button = document.querySelector('#changeButton');
  const card = document.querySelector('.card');

  if (!button || !card) {
    console.warn('Missing #changeButton or .card element; aborting script.');
    return;
  }

  // Improve accessibility: announce changes and mark region
  card.setAttribute('role', 'region');
  card.setAttribute('aria-live', 'polite');

  function isRTL(text) {
    return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
  }

  function setRandomMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];
    card.textContent = message;
    card.dir = isRTL(message) ? 'rtl' : 'ltr';
    console.log('Message index:', randomIndex, 'message:', message);
  }

  // Click to change message
  button.addEventListener('click', setRandomMessage);

  // Support keyboard activation for non-button controls
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setRandomMessage();
    }
  });

  // Initialize with a random message
  setRandomMessage();
  console.log('Script carregado com sucesso!');
});
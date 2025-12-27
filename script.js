const messages = [
  "Olá mundo!",
  "Hello World!",
  "Bonjour le monde!",
  "Hola Mundo!",
  "Ciao mondo!",
  "Hallo Welt!",
  "こんにちは世界！",
  "안녕하세요 세계!",
  "Привет, мир!",
  "مرحبا بالعالم!"
]

const button = document.querySelector("#changeButton");
const card = document.querySelector(".card");
  


button.addEventListener("click", function() {
  let randomIndex = Math.floor(Math.random() * messages.length)
    card.textContent = messages[randomIndex];
    

})

console.log(randomIndex, messages[randomIndex]);
console.log("Script carregado com sucesso!");
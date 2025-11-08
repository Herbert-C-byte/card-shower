const messages = [
  "Olá mundo!",
  "Hello World!",
  "Bonjour le monde!",
  "Hola Mundo!",
]

const button = document.querySelector("#changeButton");
const card = document.querySelector(".card");
  


button.addEventListener("click", function() {
  let randomIndex = Math.floor(Math.random() * messages.length)
    card.textContent = messages[randomIndex];
    

})

console.log(randomIndex, messages[randomIndex]);
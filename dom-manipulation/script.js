const quotes = [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "The purpose of our lives is to be happy.", category: "Life" },
  { text: "Turn your wounds into wisdom.", category: "Growth" },
];

function displayRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quote-text").textContent = quote.text;
  document.getElementById("quote-category").textContent = quote.category;
}

function addQuote() {
  const text = document.getElementById("new-quote-text").value;
  const category = document.getElementById("new-quote-category").value;

  if (text && category) {
    quotes.push({ text, category });
    displayRandomQuote();
  }
}

document.getElementById("new-quote-btn").addEventListener("click", displayRandomQuote);
document.getElementById("add-quote-btn").addEventListener("click", addQuote);

displayRandomQuote();

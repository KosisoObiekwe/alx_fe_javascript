const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Inspiration" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML =
    `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
}

function addQuote(event) {
  event.preventDefault();

  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
    showRandomQuote();
  }
}

// ✅ Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteForm").addEventListener("submit", addQuote);

// ✅ Display one quote initially
showRandomQuote();

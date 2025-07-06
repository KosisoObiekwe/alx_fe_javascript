const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quote").innerHTML = `"${quote.text}" - ${quote.category}`;
}

function addQuote() {
  const textInput = document.getElementById("quoteText").value.trim();
  const categoryInput = document.getElementById("quoteCategory").value.trim();

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
    showRandomQuote();
  }
}

document.getElementById("newQuoteBtn").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

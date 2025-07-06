const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Inspiration" }
];

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>Category: ${quote.category}</em></p>
  `;
}

function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
    displayRandomQuote();
  }
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  const form = document.createElement("form");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "quoteText";
  quoteInput.placeholder = "Enter quote";
  quoteInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "quoteCategory";
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  form.addEventListener("submit", addQuote);

  formContainer.appendChild(form);
}

// ✅ Hook up buttons
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// ✅ On page load
displayRandomQuote();
createAddQuoteForm(); // 💥 THIS is the required function

// ✅ 1. quotes array
const quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" }
];

// ✅ 2. displayRandomQuote function
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>Category: ${quote.category}</em></p>
  `;
}

// ✅ 3. addQuote function
function addQuote(event) {
  event.preventDefault();
  const textInput = document.getElementById("quoteText").value.trim();
  const categoryInput = document.getElementById("quoteCategory").value.trim();

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    displayRandomQuote();
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
  }
}

// ✅ 4. createAddQuoteForm function
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const form = document.createElement("form");

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "quoteText";
  textInput.placeholder = "Quote";
  textInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "quoteCategory";
  categoryInput.placeholder = "Category";
  categoryInput.required = true;

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Add Quote";

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitButton);

  form.addEventListener("submit", addQuote);
  formContainer.appendChild(form);
}

// ✅ 5. Event listener for Show New Quote
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// ✅ 6. On page load
displayRandomQuote();
createAddQuoteForm();

// 1. quotes array
const quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" }
];

// 2. displayRandomQuote function
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>Category: ${quote.category}</em></p>
  `;
}

// 🚨 3. ALX expects function named exactly: newQuote
function newQuote() {
  displayRandomQuote();
}

// 4. addQuote function
function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    newQuote(); // update display
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
  }
}

// 5. createAddQuoteForm function
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

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  form.addEventListener("submit", addQuote);
  formContainer.appendChild(form);
}

// 6. Event listener (Show New Quote)
document.getElementById("newQuote").addEventListener("click", newQuote);

// 7. On load
newQuote();
createAddQuoteForm();

const quotes = [
  { text: "The journey of a thousand miles begins with a single step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "To be or not to be, that is the question.", category: "Philosophy" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quote-display').innerHTML = `<p>${quote.text}</p><em>(${quote.category})</em>`;
}

function addQuote(text, category) {
  quotes.push({ text, category });
  showRandomQuote();
}

function createAddQuoteForm() {
  const form = document.createElement('form');

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter quote text';
  quoteInput.required = true;

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter category';
  categoryInput.required = true;

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Add Quote';

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    addQuote(quoteInput.value.trim(), categoryInput.value.trim());
    quoteInput.value = '';
    categoryInput.value = '';
  });

  document.getElementById('form-container').appendChild(form);
}

document.getElementById('new-quote-btn').addEventListener('click', showRandomQuote);

createAddQuoteForm();

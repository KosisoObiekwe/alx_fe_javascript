let quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" },
  { text: "Creativity is intelligence having fun.", category: "Inspiration" }
];

// Load from localStorage if exists
const storedQuotes = localStorage.getItem("quotes");
if (storedQuotes) quotes = JSON.parse(storedQuotes);

let intervalId = null;

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

function displayQuotes(quoteList) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  quoteList.forEach(quote => {
    const container = document.createElement("div");
    const p = document.createElement("p");
    const span = document.createElement("span");

    p.textContent = quote.text;
    span.textContent = `(${quote.category})`;

    container.appendChild(p);
    container.appendChild(span);
    quoteDisplay.appendChild(container);
  });
}

function showRandomQuote() {
  const selected = document.getElementById("categoryFilter").value;
  const list = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (list.length === 0) return;

  const randomQuote = list[Math.floor(Math.random() * list.length)];
  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = `
    <div>
      <p>${randomQuote.text}</p>
      <span>(${randomQuote.category})</span>
    </div>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();

    populateCategories();
    showRandomQuote();

    textInput.value = "";
    categoryInput.value = "";
  }
}

function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        populateCategories();
        showRandomQuote();
      }
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const list = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  displayQuotes(list);
}

function startAutoRotation() {
  if (!intervalId) intervalId = setInterval(showRandomQuote, 10000);
}

function stopAutoRotation() {
  clearInterval(intervalId);
  intervalId = null;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("pause").addEventListener("click", stopAutoRotation);
  document.getElementById("resume").addEventListener("click", startAutoRotation);
  document.getElementById("exportBtn").addEventListener("click", exportQuotes);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

  populateCategories();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    const container = document.getElementById("quoteDisplay");
    container.innerHTML = `<div><p>${q.text}</p><span>(${q.category})</span></div>`;
  } else {
    showRandomQuote();
  }

  startAutoRotation();
});

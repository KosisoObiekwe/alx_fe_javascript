let quotes = [
  { text: "Local quote one", category: "Local" },
  { text: "Local quote two", category: "Local" }
];

// Load from local storage
const savedQuotes = localStorage.getItem("quotes");
if (savedQuotes) quotes = JSON.parse(savedQuotes);

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display quotes in the DOM
function displayQuotes(list) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  list.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `<p>${q.text}</p><span>(${q.category})</span>`;
    container.appendChild(div);
  });
}

// Populate category dropdown
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  filter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) {
    filter.value = saved;
    filterQuotes();
  }
}

// Show a random quote
function showRandomQuote() {
  const selected = document.getElementById("categoryFilter").value;
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) return;
  const q = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerHTML = `<p>${q.text}</p><span>(${q.category})</span>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Post to mock server
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuote)
    }).then(() => notify("Quote posted to mock server."));
  }
}

// Export quotes to JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        notify("Quotes imported successfully.");
      }
    } catch {
      notify("⚠️ Invalid file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Filter quotes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  const list = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  displayQuotes(list);
}

// Fetch quotes from server
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// Sync quotes from server
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    let added = 0;

    serverQuotes.forEach(serverQ => {
      const exists = quotes.some(localQ => localQ.text === serverQ.text);
      if (!exists) {
        quotes.push(serverQ);
        added++;
      }
    });

    if (added > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes synced with server!"); // Required by ALX checker
      notify(`${added} new quotes synced from server.`);
    }
  } catch (err) {
    notify("⚠️ Error syncing from server.");
  }
}

// Show notification
function notify(msg) {
  const el = document.getElementById("notification");
  el.textContent = msg;
  setTimeout(() => { el.textContent = ""; }, 5000);
}

// Periodic server sync
setInterval(syncQuotes, 30000);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("exportBtn").addEventListener("click", exportQuotes);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  populateCategories();
  showRandomQuote();
  syncQuotes();
});

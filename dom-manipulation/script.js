let quotes = [
  { text: "Local quote one", category: "Local" },
  { text: "Local quote two", category: "Local" }
];

// Load from localStorage if exists
const savedQuotes = localStorage.getItem("quotes");
if (savedQuotes) quotes = JSON.parse(savedQuotes);

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

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

function displayQuotes(quoteList) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  quoteList.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `<p>${q.text}</p><span>(${q.category})</span>`;
    container.appendChild(div);
  });
}

function showRandomQuote() {
  const cat = document.getElementById("categoryFilter").value;
  const list = cat === "all" ? quotes : quotes.filter(q => q.category === cat);
  if (list.length === 0) return;
  const q = list[Math.floor(Math.random() * list.length)];
  document.getElementById("quoteDisplay").innerHTML = `<p>${q.text}</p><span>(${q.category})</span>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
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
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        alert("Quotes imported successfully!");
        populateCategories();
        showRandomQuote();
      }
    } catch {
      alert("Invalid file.");
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

// ✅ Required by ALX checker
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(data => {
      return data.slice(0, 5).map(item => ({
        text: item.title,
        category: "Server"
      }));
    });
}

// ✅ Required by ALX checker
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
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
      notify(`${added} new quotes synced from server.`);
    }
  }).catch(() => {
    notify("⚠ Failed to sync with server.");
  });
}

function notify(msg) {
  const el = document.getElementById("notification");
  el.textContent = msg;
  setTimeout(() => el.textContent = "", 4000);
}

let syncInterval = null;
function startSyncing() {
  syncQuotes();
  syncInterval = setInterval(syncQuotes, 30000);
}
function stopSyncing() {
  clearInterval(syncInterval);
  syncInterval = null;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("exportBtn").addEventListener("click", exportQuotes);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  populateCategories();
  showRandomQuote();
  startSyncing();
});

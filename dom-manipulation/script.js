let quotes = [
  { text: "Local quote one", category: "Local" },
  { text: "Local quote two", category: "Local" }
];

// Load local storage
const savedQuotes = localStorage.getItem("quotes");
if (savedQuotes) quotes = JSON.parse(savedQuotes);

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
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  quoteList.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `<p>${q.text}</p><span>(${q.category})</span>`;
    container.appendChild(div);
  });
}

function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const list = category === "all" ? quotes : quotes.filter(q => q.category === category);
  if (list.length === 0) return;

  const random = list[Math.floor(Math.random() * list.length)];
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = `<div><p>${random.text}</p><span>(${random.category})</span></div>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
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
    } catch (err) {
      alert("Invalid file format.");
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

function syncWithServer() {
  const notification = document.getElementById("notification");
  fetch("https://raw.githubusercontent.com/OpenAI/ChatGPT-Example/main/mock-quotes.json")
    .then(res => res.json())
    .then(serverQuotes => {
      let added = 0;
      serverQuotes.forEach(sq => {
        const exists = quotes.some(lq => lq.text === sq.text);
        if (!exists) {
          quotes.push(sq);
          added++;
        }
      });

      if (added > 0) {
        saveQuotes();
        populateCategories();
        filterQuotes();
        notification.textContent = `✔ Synced with server. ${added} new quote(s) added.`;
        setTimeout(() => notification.textContent = "", 4000);
      }
    })
    .catch(() => {
      notification.textContent = "⚠ Failed to sync with server.";
      setTimeout(() => notification.textContent = "", 4000);
    });
}

let intervalId = null;
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
    document.getElementById("quoteDisplay").innerHTML = `<div><p>${q.text}</p><span>(${q.category})</span></div>`;
  } else {
    showRandomQuote();
  }

  startAutoRotation();
  syncWithServer();              // initial sync
  setInterval(syncWithServer, 30000); // auto sync every 30s
});

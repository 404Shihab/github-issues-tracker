// console.log('file connected')


const url = "https://phi-lab-server.vercel.app/api/v1/lab";

const labelConfig ={
  "bug":
  {
    class: "text-red-500 bg-red-100 border border-red-400",icon: "fa-bug" 
  },
  "help wanted":{ 
  class: "text-yellow-600 bg-yellow-50 border border-yellow-500",icon: "fa-life-ring" 
  },
  "enhancement":{ 
  class: "text-blue-500 bg-blue-100 border border-blue-400",icon: "fa-star" 
},
  "documentation":    
  { class: "text-purple-500 bg-purple-100 border border-purple-400",icon: "fa-book" 

  },
  "good first issue": {
    class: "text-green-600 bg-green-100 border border-green-400",icon: "fa-seedling" 
  },
};

const priorityConfig = {
  high: "text-red-500 bg-red-100 border border-red-400",
  medium:"text-yellow-600 bg-yellow-50 border border-yellow-500",
  low:"text-green-600 bg-green-100 border border-green-400",
};



const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US");

const createLabelBadge = (label) => 
{
  const config = labelConfig[label.toLowerCase()] || {class: "text-gray-500 bg-gray-100 border border-gray-400",icon:"fa-tag"};
  return `
    <span class="text-xs font-semibold ${config.class} px-3 py-1 rounded-full flex items-center gap-1">
      <i class="fa-solid ${config.icon}"></i> ${label.toUpperCase()}
    </span>`;
};

const createCard =(issue)=> 
  {
  const isOpen = issue.status === "open";
  const borderTop = isOpen ? "border-t-[#00a96e]" : "border-t-[#a855f7]";
  const priorityClass = priorityConfig[issue.priority] || priorityConfig.low;
  const labelsHTML = issue.labels.map(createLabelBadge).join("");

  return `
    <div onclick="loadSingleIssue(${issue.id})"
      class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3 border-t-4 ${borderTop} cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div class="flex justify-between items-center">
        <img src="./assets/${isOpen ? "Open-Status" : "Closed-Status"}.png" alt="${issue.status}" class="h-5" />
        <span class="text-xs font-semibold ${priorityClass} px-3 py-1 rounded-full">
          ${issue.priority.toUpperCase()}
        </span>
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <h2 class="font-semibold text-gray-800 text-sm leading-snug">${issue.title}</h2>
        <p class="text-gray-500 text-xs leading-relaxed">${issue.description}</p>
        <div class="flex flex-wrap gap-2 mt-1">${labelsHTML}</div>
      </div>
      <hr class="border-gray-200" />
      <div class="text-[#64748B] text-xs">
        <p class="font-medium">#${issue.id} by ${issue.author}</p>
        <p>${formatDate(issue.createdAt)}</p>
      </div>
    </div>`;
};


const displayIssues =(issues) => 
  {
  const container = document.querySelector("#all-cards .grid");

  if (issues.length === 0) 
    {
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
        <i class="fa-solid fa-magnifying-glass text-4xl"></i>
        <p class="text-lg font-medium">No issues found</p>
      </div>`;
    updateIssueCount(0);
    return;
  }

  container.innerHTML = issues.map(createCard).join("");
  updateIssueCount(issues.length);
};

const updateIssueCount = (count) => {
  const countEl = document.querySelector(".issues-count");
  if (countEl) countEl.textContent = `${count} Issues`;
};


const loadSingleIssue = (id) => 
{
  fetch(`${url}/issue/${id}`)
    .then((res) => res.json())
    .then((json) => showModal(json.data));
};

const showModal = (issue) => {
  const isOpen = issue.status === "open";
  const priorityClass = priorityConfig[issue.priority] || priorityConfig.low;
  const labelsHTML = issue.labels.map(createLabelBadge).join("");
  document.getElementById("modal-title").textContent = issue.title;
  const statusEl = document.getElementById("modal-status");
  statusEl.textContent = isOpen ? "Open" : "Closed";
  statusEl.className = `px-3 py-1 rounded-full text-xs font-semibold text-white ${isOpen ? "bg-[#00a96e]" : "bg-[#a855f7]"}`;
  document.getElementById("modal-author").textContent = `Opened by ${issue.author} • ${formatDate(issue.createdAt)}`;
  document.getElementById("modal-labels").innerHTML = labelsHTML;
  document.getElementById("modal-desc").textContent = issue.description;
  document.getElementById("modal-assignee").innerHTML = `<span class="font-semibold text-gray-700">Assigned:</span> ${issue.assignee || "Unassigned"}`;
  const priorityEl = document.getElementById("modal-priority");
  priorityEl.textContent = issue.priority.toUpperCase();
  priorityEl.className = `text-xs font-semibold px-3 py-1 rounded-full ${priorityClass}`;
  document.getElementById("issue-modal").showModal();
};


let allIssuesData = [];

const fetchAllIssues = () => 
{
  fetch(`${url}/issues`)
    .then((res) => res.json())
    .then((json) => {
      allIssuesData = json.data;
      displayIssues(allIssuesData);
    });
};



const removeActive =()=> 
{
  const buttons = document.querySelectorAll(".btns .btn");
  buttons.forEach((btn)=> 
  {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });
};

const setupFilters=()=>{
  const buttons = document.querySelectorAll(".btns .btn");

  buttons[0].classList.add("btn-primary");
  buttons[0].classList.remove("btn-outline");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      removeActive();
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-outline");

      const label = btn.textContent.trim().toLowerCase();
      let filtered;

      if (label === "all")         
        filtered = allIssuesData;
      else if (label === "open")   
        filtered = allIssuesData.filter((i) => i.status === "open");
      else if (label === "closed") 
        filtered = allIssuesData.filter((i) => i.status === "closed");

      displayIssues(filtered);
    });
  });
};



const setupSearch =()=> 
  {
  const searchInput = document.querySelector('input[placeholder="Search issues"]');
  let debounceTimer;

  const doSearch =()=> 
  {
    const query = searchInput.value.trim();

    if (!query) {
      removeActive();
      document.querySelectorAll(".btns .btn")[0].classList.remove("btn-outline");
      displayIssues(allIssuesData);
      return;
    }

    removeActive();

    fetch(`${url}/issues/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((json) => displayIssues(json.data || []));
  };

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSearch, 400);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceTimer);
      doSearch();
    }
  });
};


fetchAllIssues();
setupFilters();
setupSearch();
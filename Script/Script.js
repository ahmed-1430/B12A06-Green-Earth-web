const categoryList = document.getElementById("category-list");
const treeContainer = document.getElementById("tree-container");



const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => {
      const categories = [{ category_name: "All Trees", id: "all" }, ...(data.categories || [])];
      displayCategories(categories);
    })
    .catch(err => console.error(err));
};

const displayCategories = (categories) => {
  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.id = cat.id;
    li.className = "category-btn w-full text-left px-3 py-2 rounded hover:bg-green-600 hover:text-white cursor-pointer";
    li.innerText = cat.category_name;
    categoryList.appendChild(li);
  });


  if (categories.length > 0) {
    const firstCategory = document.getElementById(categories[0].id);
    firstCategory.classList.add("bg-green-600", "text-white");
  }

  categoryList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      document.querySelectorAll(".category-btn").forEach(li => {
        li.classList.remove("bg-green-600", "text-white");
      });
      e.target.classList.add("bg-green-600", "text-white");
      loadTrees(e.target.id)
    }
  });
};

const loadTrees = (id) => {
  showSpinner(true);
  let url = id === "all"
    ? "https://openapi.programming-hero.com/api/plants"
    : `https://openapi.programming-hero.com/api/category/${id}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayTrees(data.plants || []);
      showSpinner(false);
    })
    .catch(err => {
      console.error(err);
      treeContainer.innerHTML = "";
      showSpinner(false);
    });
};
const displayTrees = (plants) => {
  treeContainer.innerHTML = "";
  
  if (plants.length === 0) {
    treeContainer.innerHTML = `
      <div class="col-span-3 md:col-span-8 flex justify-center items-center py-10">
        <p class="text-gray-500">No trees found in this category.</p>
      </div>
    `;
    return;
  }
  
  plants.forEach(tree => {
    treeContainer.innerHTML += `
      <div class="card bg-base-100 shadow-sm p-3">
                    <div class="h-[180px] w-full bg-gray-200 rounded overflow-hidden mb-3">
                    <img src="${tree.image}" alt="${tree.name}" class="w-full h-full object-cover"/>
                    </div>
                <div class="card-body">
                    <h2 class="card-title cursor-pointer" onclick="openModal('${tree.id}')">${tree.name}</h2>
                    <p class="text-xs text-gray-500 mb-4 line-clamp-2">${tree.description}</p>
                <div class="card-actions justify-between items-center">
                <div class="px-3 py-2 rounded-full bg-[#DCFCE7] tex-[#15803D]"><p>${tree.category}</p></div>
                    <div>
                        <p><span>৳</span>${tree.price}</p>
                    </div>                                                           
                </div>
                </div>
                 <button class="btn w-full font-semibold bg-[#15803D] text-white rounded-full border-none">Add to Cart</button>
                </div>     

    `;
  });
};
const showSpinner = (show) => {
  if (!document.getElementById("spinner")) {
    const spinnerDiv = document.createElement("div");
    spinnerDiv.id = "spinner";
    spinnerDiv.className = "col-span-8 flex justify-center items-center py-10";
    spinnerDiv.innerHTML = `<span class="loading loading-dots loading-xl"></span>`;
    treeContainer.parentNode.insertBefore(spinnerDiv, treeContainer);
  }
  document.getElementById("spinner").style.display = show ? "flex" : "none";
  treeContainer.style.display = show ? "none" : "grid";
};







loadCategories();
loadTrees("all");

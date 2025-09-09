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


loadCategories();

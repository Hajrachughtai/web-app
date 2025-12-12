const goalInput = document.getElementById("goalInput");
const exploreBtn = document.getElementById("exploreBtn");
const mealContainer = document.getElementById("mealContainer");
const exerciseContainer = document.getElementById("exerciseContainer");
const lastGoalEl = document.getElementById("lastGoal");
const saveBtn = document.getElementById("saveBtn");

// Meal API (TheMealDB)
async function getMeals() {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian");
    const data = await response.json();
    const shuffled = data.meals.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // 3 random meals
  } catch (error) {
    console.error("Meal API error:", error);
    return [];
  }
}

// Exercise API workaround
async function getExercises() {
  try {
    const response = await fetch("https://wger.de/api/v2/exercise/?language=2&limit=50");
    const data = await response.json();
    const exercises = data.results
      .filter(ex => ex.name && ex.name.length > 0)
      .map(ex => ex.name);
    const shuffled = exercises.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5); // 5 random exercises
  } catch (error) {
    console.error("Exercise API error:", error);
    return [];
  }
}

// Render meal cards
function showMeals(meals) {
  mealContainer.innerHTML = "";
  meals.forEach(meal => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h4>${meal.strMeal}</h4>
    `;
    mealContainer.appendChild(card);
  });
}

// Render exercise cards
function showExercises(exercises) {
  exerciseContainer.innerHTML = "";
  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h4>${ex}</h4>`;
    exerciseContainer.appendChild(card);
  });
}

// Handle explore
exploreBtn.addEventListener("click", async () => {
  const goal = goalInput.value.trim();
  if (!goal) return alert("Enter a health goal!");

  const meals = await getMeals();
  const exercises = await getExercises();

  showMeals(meals);
  showExercises(exercises);

  // Store in LocalStorage for "saved plan"
  localStorage.setItem("lastGoal", JSON.stringify({ goal, meals, exercises }));
  displayHistory();
});

// Display saved plan
function displayHistory() {
  const last = localStorage.getItem("lastGoal");
  if (last) {
    const { goal, meals, exercises } = JSON.parse(last);
    const mealNames = meals.map(m => m.strMeal).join(", ");
    lastGoalEl.textContent = `Goal: ${goal} | Meals: ${mealNames} | Exercises: ${exercises.join(", ")}`;
  }
}

// Save button (redundant but mirrors example)
saveBtn.addEventListener("click", () => {
  alert("Plan saved to favorites!");
});

// Load saved plan on page load
window.onload = displayHistory;
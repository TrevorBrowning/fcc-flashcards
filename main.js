const flashcard = document.getElementById("flashcard");
const cardFront = document.getElementById("card-front");
const cardBack = document.getElementById("card-back");
const cardCount = document.getElementById("card-count");

const flipBtn = document.getElementById("flip-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

const categorySelect = document.getElementById("category-select");
const subcategorySelect = document.getElementById("subcategory-select");
const lessonSelect = document.getElementById("lesson-select");

const toggleBtn = document.getElementById("toggle-selectors");
const selectorPanel = document.getElementById("selector-panel");

const controls = document.querySelector(".controls");

let flashcards = [];
let currentIndex = 0;

const lessonData = {
  html: {
    basics: [
      "all",
      "what_is_HTML",
      "HTML_fundamentals",
      "working_with_media",
      "working_with_links",
    ],
    semantics: [
      "all",
      "why_semantic_HTML",
      "structural_hierarchy",
      "presentational_vs_semantic",
      "em_vs_i",
      "strong_vs_b",
      "description_lists",
      "quote_block_vs_inline",
      "abbreviations_acronyms",
      "address_element",
      "time_element",
      "superscript_subscript",
      "code_representation",
      "u_s_ruby_elements",
    ],
  },
  css: {
    basics: ["selectors", "box_model", "all"],
  },
  js: {
    conditionals: ["if_else", "switch", "ternary", "all"],
  },
};

toggleBtn.addEventListener("click", () => {
  selectorPanel.classList.toggle("collapsed");

  const isCollapsed = selectorPanel.classList.contains("collapsed");

  toggleBtn.textContent = isCollapsed
    ? "Show Lesson Picker ▼"
    : "Hide Lesson Picker ▲";

  toggleBtn.classList.toggle("sticky-toggle", isCollapsed);
});

categorySelect.addEventListener("change", () => {
  const category = categorySelect.value;
  subcategorySelect.innerHTML = `<option value="">-- Choose a section --</option>`;
  lessonSelect.innerHTML = `<option value="">-- Choose a lesson --</option>`;
  subcategorySelect.disabled = true;
  lessonSelect.disabled = true;

  if (category && lessonData[category]) {
    subcategorySelect.disabled = false;
    Object.keys(lessonData[category]).forEach((section) => {
      const opt = document.createElement("option");
      opt.value = section;
      opt.textContent = capitalize(section);
      subcategorySelect.appendChild(opt);
    });
  }
});

subcategorySelect.addEventListener("change", () => {
  const category = categorySelect.value;
  const section = subcategorySelect.value;
  lessonSelect.innerHTML = `<option value="">-- Choose a lesson --</option>`;
  lessonSelect.disabled = true;

  if (category && section && lessonData[category][section]) {
    lessonSelect.disabled = false;
    lessonData[category][section].forEach((lesson) => {
      const opt = document.createElement("option");
      opt.value = lesson;
      opt.textContent = formatLessonName(lesson);
      lessonSelect.appendChild(opt);
    });
  }
});

lessonSelect.addEventListener("change", async () => {
  const category = categorySelect.value;
  const section = subcategorySelect.value;
  const lesson = lessonSelect.value;
  if (!category || !section || !lesson) return;

  try {
    const res = await fetch(`cards/${category}/${section}/${lesson}.json`);
    flashcards = await res.json();
    currentIndex = 0;
    displayCard();
    flashcard.style.display = "block";
    controls.style.display = "flex";
  } catch (err) {
    cardFront.textContent = "Error loading flashcards.";
    cardBack.textContent = "";
    cardCount.textContent = "";
    console.error(err);
  }
});

function displayCard() {
  if (flashcards.length === 0) return;
  const card = flashcards[currentIndex];
  cardFront.textContent = card.front;
  cardBack.textContent = card.back;
  cardCount.textContent = `Card ${currentIndex + 1} of ${flashcards.length}`;
  flashcard.classList.remove("flipped");
}

flashcard.addEventListener("click", () => {
  if (flashcards.length === 0) return;
  flashcard.classList.toggle("flipped");
});

flipBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;
  flashcard.classList.toggle("flipped");
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < flashcards.length - 1) {
    currentIndex++;
    displayCard();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayCard();
  }
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatLessonName(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

const categorySelect = document.getElementById("category-select");
const subcategorySelect = document.getElementById("subcategory-select");
const lessonSelect = document.getElementById("lesson-select");

const flashcard = document.getElementById("flashcard");
const cardFront = document.getElementById("card-front");
const cardBack = document.getElementById("card-back");
const cardCount = document.getElementById("card-count");

const flipBtn = document.getElementById("flip-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

let flashcards = [];
let currentIndex = 0;

const lessonData = {
  html: {
    basics: [
      "what_is_HTML",
      "HTML_fundamentals",
      "working_with_media",
      "working_with_links",
      "all",
    ],
  },
  css: {
    basics: ["selectors", "box_model", "all"],
  },
  js: {
    conditionals: ["if_else", "switch", "ternary", "all"],
  },
};

categorySelect.addEventListener("change", () => {
  const category = categorySelect.value;
  subcategorySelect.innerHTML = `<option value="">-- Choose a section --</option>`;
  lessonSelect.innerHTML = `<option value="">-- Choose a lesson --</option>`;
  lessonSelect.disabled = true;

  if (category && lessonData[category]) {
    subcategorySelect.disabled = false;
    Object.keys(lessonData[category]).forEach((sub) => {
      const option = document.createElement("option");
      option.value = sub;
      option.textContent = capitalize(sub);
      subcategorySelect.appendChild(option);
    });
  } else {
    subcategorySelect.disabled = true;
  }
});

subcategorySelect.addEventListener("change", () => {
  const category = categorySelect.value;
  const sub = subcategorySelect.value;
  lessonSelect.innerHTML = `<option value="">-- Choose a lesson --</option>`;

  if (category && sub && lessonData[category][sub]) {
    lessonSelect.disabled = false;
    lessonData[category][sub].forEach((lesson) => {
      const option = document.createElement("option");
      option.value = lesson;
      option.textContent = formatLessonName(lesson);
      lessonSelect.appendChild(option);
    });
  } else {
    lessonSelect.disabled = true;
  }
});

lessonSelect.addEventListener("change", async () => {
  const category = categorySelect.value;
  const sub = subcategorySelect.value;
  const lesson = lessonSelect.value;
  if (!category || !sub || !lesson) return;

  try {
    const res = await fetch(`cards/${category}/${sub}/${lesson}.json`);
    flashcards = await res.json();
    currentIndex = 0;
    displayCard();
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

flipBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;
  flashcard.classList.toggle("flipped");
});

flashcard.addEventListener("click", () => {
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

async function getMovie(query) {
  try {
    const url = `https://www.omdbapi.com/?apikey=${apikey}&s=${encodeURIComponent(
      query,
    )}&type=movie`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      resultsSection.innerHTML = `<p style="color:white;">${data.Error}</p>`;
      return;
    }


    let movies = (data.Search || []).filter(
      (m) => m.Poster && m.Poster !== "N/A",
    );

    const sortMode = sortSelect.value;
    if (sortMode === "AZ") {
      movies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortMode === "ZA") {
      movies.sort((a, b) => b.Title.localeCompare(a.Title));
    } else if (sortMode === "NEW_OLD") {
      movies.sort((a, b) => Number(b.Year) - Number(a.Year));
    } else if (sortMode === "OLD_NEW") {
      movies.sort((a, b) => Number(a.Year) - Number(b.Year));
    }
  
    function runSearch() {
      const q = searchInput.value.trim();
      if (!q) {
        resultsSection.innerHTML = "";
        return;
      }
      getMovie(q);
    }

    
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    });

   
    let searchTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(runSearch, 400);
    });

  
    sortSelect.addEventListener("change", runSearch);


    resultsSection.innerHTML = movies
      .map(
        (m) => `
        <a class="card" href="#" data-imdbid="${m.imdbID}">
          <img src="${m.Poster}" alt="${m.Title} poster" />
          <div class="card__overlay">
            <p class="card__title">${m.Title}</p>
            <p class="card__sub">${m.Year}</p>
          </div>
        </a>
      `,
      )
      .join("");
  } catch (error) {
    console.error("Error fetching movie data:", error);
    resultsSection.innerHTML = `<p style="color:white;">Something went wrong.</p>`;
  }
}

const heroBackdrop = document.getElementById("heroBackdrop");
const heroPoster = document.getElementById("heroPoster");
const heroTitle = document.getElementById("heroTitle");
const heroSubtitle = document.getElementById("heroSubtitle");
const upNextList = document.getElementById("upNextList");

const items = [
  {
    title: "The Super Mario Galaxy Movie (2026)",
    subtitle: "The Galaxy awaits.",
    backdrop: "./assets/mario-backdrops.jpg",
    poster: "./assets/super-mario-galaxy.jpg",
  },
  {
    title: "The Lord of the Rings: The Return of the King (2003)",
    subtitle: "The eye of the enemy is moving.",
    backdrop: "./assets/LOTR-return-of-the-king-backdrop.jpg",
    poster: "./assets/LOTR-Return-of-the-king.jpg",
  },
  {
    title: "The Dark Knight (2008)",
    subtitle: "Welcome to a world without rules.",
    backdrop: "./assets/dark-knight-backdrop.jpg",
    poster: "./assets/dark-knight.jpg",
  },
  {
    title: "Interstellar (2014)",
    subtitle: "Mankind was born on Earth. It was never meant to die here.",
    backdrop: "./assets/interstellar-backdrop.jpg",
    poster: "./assets/interstellar.jpg",
  },
];

let currentIndex = 0;

function setHero(index) {
  currentIndex = index;
  const m = items[index];

  heroBackdrop.src = m.backdrop;
  heroPoster.src = m.poster;
  heroTitle.textContent = m.title;
  heroSubtitle.textContent = m.subtitle;
}

function renderUpNext() {
  const next = items
    .map((m, idx) => ({ ...m, idx }))
    .filter((x) => x.idx !== currentIndex)
    .slice(0, 3);

  upNextList.innerHTML = next
    .map(
      (m) => `
      <div class="upnext" data-index="${m.idx}">
        <div class="upnext__img">
          <img src="${m.poster}" alt="${m.title} poster" loading="lazy" />
        </div>
        <div>
          <p class="upnext__title">"${m.title}"</p>
          <p class="upnext__meta">${m.subtitle}</p>
        </div>
      </div>
    `,
    )
    .join("");
}

upNextList.addEventListener("click", (e) => {
  const row = e.target.closest(".upnext");
  if (!row) return;
  const idx = Number(row.dataset.index);
  setHero(idx);
  renderUpNext();
});

document.getElementById("heroPrev").addEventListener("click", () => {
  const idx = (currentIndex - 1 + items.length) % items.length;
  setHero(idx);
  renderUpNext();
});

document.getElementById("heroNext").addEventListener("click", () => {
  const idx = (currentIndex + 1) % items.length;
  setHero(idx);
  renderUpNext();
});

setHero(0);
renderUpNext();

const apikey = "5f575098";
const track = document.getElementById("featuredTrack");

const Featured_Query = "star wars";

async function loadedFeatured() {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${apikey}&s=${encodeURIComponent(
        Featured_Query,
      )}&type=movie`,
    );
    const data = await res.json();

    if (data.Response === "False") {
      track.innerHTML = `<p style="color:white;">${data.Error}</p>`;
      return;
    }
    const movies = (data.Search || []).filter(
      (m) => m.Poster && m.Poster !== "N/A",
    );

    track.innerHTML = movies
      .map(
        (m) => `
        <a class="card" href="#" data-imdbid="${m.imdbID}">
          <img src="${m.Poster}" alt="${m.Title} poster" />
          <div class="card__overlay">
            <p class="card__title">${m.Title}</p>
            <p class="card__sub">${m.Year}</p>
          </div>
        </a>
      `,
      )
      .join("");
  } catch (err) {
    track.innerHTML = `<p style="color:white;">Something went wrong loading posters.</p>`;
    console.error(err);
  }
}

loadedFeatured();

const leftBtn = document.querySelector(".rail__btn--left");
const rightBtn = document.querySelector(".rail__btn--right");

function scrollByCard(direction) {
  const card = track.querySelector(".card");
  const amount = (card?.offsetWidth || 240) + 16; // width + gap
  track.scrollBy({ left: direction * amount * 1.5, behavior: "smooth" });
}

leftBtn.addEventListener("click", () => scrollByCard(-1));
rightBtn.addEventListener("click", () => scrollByCard(1));

const resultsSection = document.getElementById("resultsSection");
const searchInput = document.querySelector(".search__input");
const sortSelect = document.getElementById("sortSelect");

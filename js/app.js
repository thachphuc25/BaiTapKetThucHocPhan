// =======================
// 1. Dữ liệu phim mẫu
// =======================
const movies = [
  {
    id: 1,
    title: "The Great Gatsby",
    year: 2013,
    genres: ["Drama", "Romance"],
    poster: "./images/TheGreatGatsby.jpg",
    description:
      "Một nhà văn bị lôi cuốn vào thế giới xa hoa của người hàng xóm triệu phú Jay Gatsby.",
    director: "Baz Luhrmann",
    cast: "Leonardo DiCaprio, Carey Mulligan",
  },
  {
    id: 2,
    title: "Interstellar",
    year: 2014,
    genres: ["Sci-Fi", "Drama"],
    poster: "./images/Interstellar_poster.jpg",
    description:
      "Một nhóm phi hành gia du hành qua một lỗ đen vũ trụ để tìm kiếm sự sống mới cho nhân loại.",
    director: "Christopher Nolan",
    cast: "Matthew McConaughey, Anne Hathaway",
  },
  {
    id: 4,
    title: "Titanic",
    year: 1997,
    genres: ["Drama", "Romance"],
    poster: "./images/titanic.jpg",
    description:
      "Chuyện tình lãng mạn giữa Jack và Rose trên con tàu Titanic định mệnh.",
    director: "James Cameron",
    cast: "Leonardo DiCaprio, Kate Winslet",
  },
  {
    id: 5,
    title: "Avengers: Endgame",
    year: 2019,
    genres: ["Action", "Sci-Fi"],
    poster: "./images/avengers.jpg",
    description:
      "Các siêu anh hùng hợp lực lần cuối để đảo ngược thảm họa do Thanos gây ra.",
    director: "Anthony Russo, Joe Russo",
    cast: "Robert Downey Jr., Chris Evans",
  },
  {
    id: 6,
    title: "Spirited Away",
    year: 2001,
    genres: ["Animation", "Fantasy"],
    poster: "./images/Spirited_Away_poster.jpg",
    description:
      "Một cô bé lạc vào thế giới linh hồn và tìm cách cứu cha mẹ mình.",
    director: "Hayao Miyazaki",
    cast: "Rumi Hiiragi, Miyu Irino",
  },
];

const movieGrid = document.getElementById("movie-grid");
const genreContainer = document.getElementById("genre-filters");
const searchInput = document.getElementById("search-input");
const themeToggle = document.getElementById("theme-toggle");
const modal = document.getElementById("movie-modal");
const modalBody = document.getElementById("modal-body");

let selectedGenres = [];
function init() {
  renderGenres();
  renderMovies(movies);
  setupEventListeners();
  loadTheme();
}

function renderGenres() {
  const genres = [...new Set(movies.flatMap((m) => m.genres))];

  genreContainer.innerHTML = genres
    .map(
      (genre) => `
      <label class="checkbox-item">
        <input type="checkbox" value="${genre}" class="genre-checkbox">
        ${genre}
      </label>
    `,
    )
    .join("");
}

function renderMovies(data) {
  movieGrid.innerHTML = data
    .map(
      (movie) => `
      <div class="movie-card" onclick="openModal(${movie.id})">
        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
          <div class="movie-title">${movie.title}</div>
          <div class="movie-year">${movie.year}</div>
        </div>
      </div>
    `,
    )
    .join("");
}

function filterMovies() {
  const searchTerm = searchInput.value.toLowerCase();

  const filtered = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm);

    const matchesGenre =
      selectedGenres.length === 0 ||
      selectedGenres.some((g) => movie.genres.includes(g));

    return matchesSearch && matchesGenre;
  });

  renderMovies(filtered);
}
function debounce(func, timeout = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

const processSearch = debounce(filterMovies);

window.openModal = function (id) {
  const movie = movies.find((m) => m.id === id);

  modalBody.innerHTML = `
    <img src="${movie.poster}" class="modal-poster">
    <div class="modal-details">
      <h2>${movie.title}</h2>
      <div class="modal-meta">
        ${movie.year} | ${movie.genres.join(", ")}
      </div>
      <p class="modal-desc">${movie.description}</p>
      <p><strong>Đạo diễn:</strong> ${movie.director}</p>
      <p><strong>Diễn viên:</strong> ${movie.cast}</p>
    </div>
  `;

  modal.style.display = "block";
};

function setupEventListeners() {
  searchInput.addEventListener("input", processSearch);

  genreContainer.addEventListener("change", (e) => {
    if (!e.target.classList.contains("genre-checkbox")) return;

    const value = e.target.value;
    if (e.target.checked) {
      selectedGenres.push(value);
    } else {
      selectedGenres = selectedGenres.filter((g) => g !== value);
    }

    filterMovies();
  });

  themeToggle.addEventListener("change", () => {
    const isDark = themeToggle.checked;

    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  document.querySelector(".close-modal").onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }
}

init();
const closeBtn = document.querySelector(".close");

function openDetail(movie) {
  modal.style.display = "block";
  document.getElementById("modalPoster").src = movie.poster;
  document.getElementById("modalTitle").innerText = movie.title;
  document.getElementById("modalDesc").innerText = movie.description;
}

closeBtn.onclick = () => {
  modal.style.display = "none";
};

modal.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.style.display = "none";
  }
});

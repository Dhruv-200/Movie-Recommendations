const apiKey = "YOUR_TMDB_API_KEY_HERE"; // Replace with your TMDb API key
const baseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";

const moodSelect = document.getElementById("moodSelect");
const genreSelect = document.getElementById("genreSelect");
const yearSelect = document.getElementById("yearSelect");
const recommendBtn = document.getElementById("recommendBtn");
const moviesContainer = document.getElementById("moviesContainer");

recommendBtn.addEventListener("click", getRecommendations);

function getRecommendations() {
    let mood = moodSelect.value;
    let genre = genreSelect.value;
    const yearRange = yearSelect.value;

    // If genre is selected explicitly, override mood
    if (genre) {
        mood = genre;
    }

    if (!mood) {
        alert("Please select at least a mood or genre to get recommendations.");
        return;
    }

    moviesContainer.innerHTML = "<p>Loading recommendations...</p>";

    fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${mood}&sort_by=popularity.desc`)
        .then((res) => res.json())
        .then((data) => {
            let movies = data.results || [];

            // Filter by year range
            if (yearRange === "before1980") {
                movies = movies.filter(m => m.release_date && parseInt(m.release_date.split("-")[0]) < 1980);
            } else if (yearRange === "1980-1999") {
                movies = movies.filter(m => {
                    if (!m.release_date) return false;
                    const year = parseInt(m.release_date.split("-")[0]);
                    return year >= 1980 && year <= 1999;
                });
            } else if (yearRange === "2000-2010") {
                movies = movies.filter(m => {
                    if (!m.release_date) return false;
                    const year = parseInt(m.release_date.split("-")[0]);
                    return year >= 2000 && year <= 2010;
                });
            } else if (yearRange === "after2010") {
                movies = movies.filter(m => m.release_date && parseInt(m.release_date.split("-")[0]) > 2010);
            }

            if (movies.length === 0) {
                moviesContainer.innerHTML = "<p>No movies found for your selection. Try different filters.</p>";
                return;
            }

            displayMovies(movies.slice(0, 5));
        })
        .catch(() => {
            moviesContainer.innerHTML = "<p>Failed to fetch recommendations. Try again later.</p>";
        });
}

function displayMovies(movies) {
    moviesContainer.innerHTML = "";

    movies.forEach((movie) => {
        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
      <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}" />
      <h3>${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'})</h3>
      <p>${movie.overview || 'No description available.'}</p>
      <p class="rating">⭐ ${movie.vote_average}</p>
    `;

        moviesContainer.appendChild(card);
    });
}

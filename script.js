let currentSong = {};
let score = 0;

const guessInput = document.getElementById("guess");
const audio = document.getElementById("audio");
const result = document.getElementById("result");
const albumCover = document.getElementById("albumCover");
const submitBtn = document.getElementById("submitBtn");

async function fetchRandomSong() {
  try {
    const proxy = "https://corsproxy.io/?";
    const terms = ["love", "party", "dance", "summer", "happy", "night", "pop", "r&b", "folk", "hip-hop"];
    const searchTerm = terms[Math.floor(Math.random() * terms.length)];
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(searchTerm)}`;

    const response = await fetch(proxy + encodeURIComponent(url));
    const data = await response.json();

    const tracks = data.data.filter(track => track.preview);
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

    currentSong = {
      title: randomTrack.title.toLowerCase(),
      artist: randomTrack.artist.name.toLowerCase(),
      preview: randomTrack.preview,
      cover: randomTrack.album.cover_medium
    };

    albumCover.style.display = "none";
    audio.src = currentSong.preview;
    result.textContent = "";

    // DON'T autoplay here to avoid browser error

  } catch (error) {
    console.error("Error fetching song:", error);
    result.textContent = "⚠️ Could not load a song. Try refreshing.";
  }
}

function checkGuess() {
  const guess = guessInput.value.toLowerCase();
  if (!guess) return;

  if (guess.includes(currentSong.title) || guess.includes(currentSong.artist)) {
    score += 3;
    result.textContent = `✅ Correct! Score: ${score}`;

    albumCover.src = currentSong.cover;
    albumCover.style.display = "block";

    setTimeout(() => {
      guessInput.value = "";
      albumCover.style.display = "none";
      fetchRandomSong();
    }, 2000);
  } else {
    result.textContent = `❌ Wrong! It was "${currentSong.title}" by ${currentSong.artist}. Score: ${score}`;
    score = 0;
    setTimeout(() => {
      guessInput.value = "";
      fetchRandomSong();
    }, 3000);
  }
}

submitBtn.addEventListener("click", () => {
  // Play audio only after user clicks submit (interaction)
  audio.play().catch(() => {
    // Ignore play errors if any
  });

  checkGuess();
});

// Initial fetch but no autoplay
fetchRandomSong();

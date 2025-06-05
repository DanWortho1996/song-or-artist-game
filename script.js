let currentSong = null;
let score = 0;

async function getRandomSong() {
  const proxy = "https://corsproxy.io/?";
  const apiURL = "https://api.deezer.com/chart";

  try {
    const response = await fetch(proxy + apiURL);
    const data = await response.json();
    const tracks = data.tracks.data;

    const song = tracks[Math.floor(Math.random() * tracks.length)];
    currentSong = {
      title: song.title.toLowerCase(),
      artist: song.artist.name.toLowerCase()
    };

    document.getElementById("audio").src = song.preview;
    document.getElementById("result").textContent = "";
    document.getElementById("guess").value = "";
  } catch (error) {
    console.error("Error fetching song:", error);
    document.getElementById("result").textContent = "Error loading song. Try refreshing.";
  }
}

function checkGuess() {
  const guess = document.getElementById("guess").value.toLowerCase();
  const result = document.getElementById("result");

  if (!guess) return;

  if (guess.includes(currentSong.title) || guess.includes(currentSong.artist)) {
    score += 3;
    result.textContent = `✅ Correct! Score: ${score}`;
    setTimeout(getRandomSong, 2000);
  } else {
    result.textContent = `❌ Wrong! The answer was "${currentSong.title}" by ${currentSong.artist}. Your score: ${score}`;
    score = 0; // Reset score on wrong guess
    setTimeout(getRandomSong, 4000);
  }
}

window.onload = function () {
  document.getElementById("submitBtn").addEventListener("click", checkGuess);
  getRandomSong();
};

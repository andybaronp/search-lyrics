// Api
const API = "https://api.lyrics.ovh";

//   DOOM
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const contentSearch = document.getElementById("contentSearch");
const message = document.getElementById("message");

const form = document.querySelector(".form");

// listen for form submit

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!searchTerm) return;
  searchSongs(searchTerm);
});

//Search songs

function searchSongs(search) {
  //fetch
  fetch(`${API}/suggest/${search}`)
    .then((response) => response.json())
    .then((data) => {
      return showSongs(data);
    });
}

// Show songs
function showSongs(songs) {
  clearHtml();

  contentSearch.innerHTML = `
      <ul class="songs">
  ${songs.data
    .map((song) => {
      return `<li class="song">
      <span>
        ${song.title} by ${song.artist.name}
      </span>
      <button
        class="detail"
        data-title="${song.title}"
        data-artist="${song.artist.name}"
      >
        Detail
      </button>
    </li>`;
    })
    .join("")}
      </ul >
      ${songs.prev ? `  <button>Prev</button>  ` : ""}
      ${songs.next ? `<button>Next</button>   ` : ""}
      
   `;
}

contentSearch.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const elemtnet = e.target;
    const title = elemtnet.getAttribute("data-title");
    const artistName = elemtnet.getAttribute("data-artist");
    getLyric(artistName, title);
  }
});

// Get song lyrics

//  function getLyric(artist, title) {
//   fetch(`${API}/v1/${artist}/${title}`)
//     .then((response) => response.json())
//     .then((data) => showLyrics(title, artist, data.lyrics));
// }
async function getLyric(artist, title) {
  const resq = await fetch(`${API}/v1/${artist}/${title}`);
  const response = await resq.json();
  const lyrics = await response;
  showLyrics(title, artist, lyrics.lyrics);
}

// Show Lyrics
function showLyrics(title, artist, lyric) {
  if (lyric === undefined) {
    showMessage(title, artist);
    return;
  }
  lyric = lyric.replace(/(\n|\r)/g, "<br>");
  const elemente = `
        <div class="lyric">
        <button id="copy" class="detail"> Copy Lyric</button>
        <h1>${title} by ${artist}</h1>
       <p>
       ${lyric}
       </p>
        </div>
        `;
  //contentlyrics.append(elemente);
  contentlyrics.innerHTML = elemente;
}
// clear
function clearHtml() {
  contentSearch.innerHTML = "";
  search.value = "";
  contentlyrics.innerHTML = "";
}

// Copy lyric
contentlyrics.addEventListener("click", (e) => {
  let copyLyric = contentlyrics.innerText;
  if (e.target.tagName === "BUTTON") {
    navigator.clipboard.writeText(copyLyric);
  }
});

function showMessage(title, artist) {
  message.innerHTML = `${title} by ${artist} - Lyric not found   `;
  message.style.opacity = "1";

  setTimeout(() => {
    message.style.opacity = "0";
  }, 2000);
}

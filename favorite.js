const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const dataPanel = document.querySelector("#data-panel");
const movies = JSON.parse(localStorage.getItem("favMovies")) || [];

function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${
                  item.id
                }">x</button>
              </div>
            </div>
          </div>
        </div>
    `;
  });
  dataPanel.innerHTML = rawHTML; //放外面一次render，不要放裡面一個一個ren
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  let movieModal = movies.find((movie) => movie.id === id);

  modalTitle.innerText = movieModal.title;
  modalDescription.innerText = movieModal.description;
  modalDate.innerText = `Release Date: ${movieModal.release_date}`;
  modalImage.innerHTML = `<img src="${POSTER_URL + movieModal.image}"
    alt="movie-poster" class="img-fluid"/>
    `;
}

//移除收藏
function removeFav(id) {
  if (!movies || !movies.length) return;

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) return;

  //刪除該筆電影
  movies.splice(movieIndex, 1);

  //存回 local storage
  localStorage.setItem("favMovies", JSON.stringify(movies));

  //更新頁面
  renderMovieList(movies);
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  const target = event.target;
  const id = target.dataset.id;

  if (target.matches(".btn-show-movie")) {
    console.log(`id: ${id}`);
    showMovieModal(Number(id));
  } else if (target.matches(".btn-remove-favorite")) {
    removeFav(Number(id));
  }
});

if (movies.length === 0) {
  dataPanel.innerHTML = `<h5 class="mx-auto">還沒有收藏的電影喔!快去逛逛吧~</h5>`;
} else {
//渲染favorite List 至 dataPanel
  renderMovieList(movies);
}

const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const movies = [];
let filteredMovies = [];
const MOVIES_PER_PAGE = 12;

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
                <button class="btn btn-info btn-add-favorite" data-id="${
                  item.id
                }">+</button>
              </div>
            </div>
          </div>
        </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  axios
    .get(`${INDEX_URL}${id}`)
    .then((response) => {
      const data = response.data.results;
      modalTitle.innerText = data.title;
      modalDescription.innerText = data.description;
      modalDate.innerText = `Release Date: ${data.release_date}`;
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}"
    alt="movie-poster" class="img-fluid"/>
    `;
    })
    .catch((err) => console.log(err));
}

//收藏最愛
function addToFav(id) {
  const list = JSON.parse(localStorage.getItem("favMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("已在收藏清單中!");
  }
  list.push(movie);
  localStorage.setItem("favMovies", JSON.stringify(list));
}

//搜尋功能
searchForm.addEventListener("submit", function onClickSubmitted(event) {
  event.preventDefault(); //防止瀏覽器預設行為觸發(提交後刷新頁面)
  let keyword = searchInput.value.trim().toLowerCase(); //一律轉成小寫
  //輸入空字串錯誤
  if (!keyword.length) {
    alert("請輸入內容!");
  }
  //條件篩選for of
  for (const movie of movies) {
    if (movie.title.toLowerCase().includes(keyword)) {
      filteredMovies.push(movie);
    }
  }
  //沒搜尋到
  if (!filteredMovies.length) {
    alert(`未搜尋到相關內容，請重新輸入其他關鍵字!`);
  }
  renderMovieList(filteredMovies);
  renderPaginator(filteredMovies.length);
});

//渲染各分頁中電影
function getMoviesByPage(page) {
  let startIndex = (page - 1) * MOVIES_PER_PAGE;
  const data = filteredMovies.length ? filteredMovies : movies;
  let perPageMovies = data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  return perPageMovies;
}

//增加分頁器
function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  //製作 template
  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  //放回 HTML
  paginator.innerHTML = rawHTML;
}

//點擊分頁顯示電影
paginator.addEventListener("click", function onPaginatorClicked(event) {
  const target = event.target;
  const page = target.dataset.page;
  if (target.tagName !== "A") return;
  renderMovieList(getMoviesByPage(page));
});

//取得api並渲染
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results); //"..."將陣列內所有運算子展開
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
  })
  .catch((err) => console.log(err));

dataPanel.addEventListener("click", function onPanelClicked(event) {
  const target = event.target;
  const id = target.dataset.id;

  if (target.matches(".btn-show-movie")) {
    showMovieModal(Number(id));
  } else if (target.matches(".btn-add-favorite")) {
    //加入收藏
    addToFav(Number(id));
  }
});

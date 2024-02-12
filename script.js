const imageWrapper = document.querySelector(".images");
const loadmoreBtn = document.querySelector(".loadmore");
const searchInput = document.querySelector(".searchbox input");
const lightbox = document.querySelector(".lightbox");
const closeLightbox = lightbox.querySelector(".uil-times");
const donwloadlb = lightbox.querySelector(".uil-import");
const apiKey = "ImLYzOancBz7vuzz3tn2NwE1aQthWCLoWK0qdacj90h5XdCpZDdSF0mI";
const perPage = 15;
let currentPage = 1;
let searchterm = null;
const download = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      let a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = "image.jpg";
      a.click();
    })
    .catch(() => alert("failed to download image"));
};
const showLight = (name, img) => {
  lightbox.querySelector("img").src = img;
  lightbox.querySelector("span").innerText = name;
  donwloadlb.setAttribute("data-img", img);
  lightbox.classList.add("show");
};

function generatedHTML(images) {
  imageWrapper.innerHTML += images
    .map(
      (
        img
      ) => `<li class="card" onClick="showLight('${img.photographer}','${img.src.large2x}')"><img src="${img.src.large2x}" alt="img" crossorigin="anonymous">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onClick="download('${img.src.large2x}')" ><i class="uil uil-import"></i></button>
        </div></li>`
    )
    .join("");
}

const getImages = (apiURL) => {
  loadmoreBtn.innerText = "Loading...";
  loadmoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      generatedHTML(data.photos);
      loadmoreBtn.innerText = "Load More";
      loadmoreBtn.classList.add("disabled");
    })
    .catch(() => {
      alert("failed to load images");
    });
};
const loadmoreImages = () => {
  currentPage++;
  let apiURL = searchterm
    ? `https://api.pexels.com/v1/search?query=${searchterm}&page=${currentPage}&per_page=${perPage}`
    : `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;

  getImages(apiURL);
};
const loadsearchImages = (e) => {
  if (e.target.value.trim() === "") return;
  if (e.key === "Enter") {
    currentPage = 1;
    searchterm = e.target.value;
    imageWrapper.innerHTML = "";
    let apiURL = `https://api.pexels.com/v1/search?query=${searchterm}&page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);
loadmoreBtn.addEventListener("click", loadmoreImages);
searchInput.addEventListener("keyup", loadsearchImages);
closeLightbox.addEventListener("click", () =>
  lightbox.classList.remove("show")
);
donwloadlb.addEventListener("click", (e) => download(e.target.dataset.img));

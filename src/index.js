import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const KEY = '32824197-fdf9de1b54cd092b4fe49e40b';
const input = document.querySelector('input[name="searchQuery"]');
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
const btnLoad = document.querySelector('.load-more');
// btnLoad.hidden = true;
let page = 1;
const btnSearch = document.querySelector('.search-form-button');
const per_page = 40;

async function fetchQuery(inputValue, page = 1) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=32824197-fdf9de1b54cd092b4fe49e40b&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&${per_page}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function onSearch(evn) {
  evn.preventDefault();
  cleanHtml();

  const inputValue = input.value.trim();
  fetchQuery(inputValue, page)
    .then(dataOfImage => {
      if (dataOfImage.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(dataOfImage.hits);

        btnLoad.hidden = false;
        Notiflix.Notify.success(
          `Hooray! We found ${dataOfImage.totalHits} images.`
        );
        gallerySimpleLightbox.refresh();
      }
    })
    .catch(err => console.log(err));
}

form.addEventListener('submit', onSearch);

function cleanHtml() {
  gallery.innerHTML = '';
}

function renderImageList(imagesCard) {
  // console.log(imagesCard);
  const markup = imagesCard
    .map(image => {
      return `<div class="photo-card">
    <a href="${image.largeImageURL}"></a>
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b> <span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b> <span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b> <span>${image.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.innerHTML = markup;
}

btnLoad.addEventListener('click', onLoad);

function onLoad() {
  page += 1;
  const inputValue = input.value.trim();
  fetchQuery(inputValue, page).then(dataOfImage => {
    if (dataOfImage.totalHits < page * per_page) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      btnLoad.hidden = true;
    }
    renderImageList(dataOfImage.hits);
    gallerySimpleLightbox.refresh();
  });
}

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImgRequest, PER_PAGE } from './js/pixabay-api.js';
import { 
  addGallery, 
  clearGallery, 
  showLoader, 
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const searchInput = document.querySelector('input[name="search-text"]');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

searchForm.addEventListener('submit', onSearch);
document.querySelector('.bttn-more').addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Search input must not be empty!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImgRequest(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (!data.hits.length) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    addGallery(data.hits);

    if (totalHits <= PER_PAGE) {
      iziToast.info({
        title: 'End of collection',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    showLoadMoreBtn();

  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  hideLoadMoreBtn();
  showLoader();
  currentPage += 1;

  try {
    const data = await getImgRequest(currentQuery, currentPage);
    addGallery(data.hits);
    smoothScroll();

    const totalPages = Math.ceil(totalHits / PER_PAGE);
    if (currentPage >= totalPages) {
      iziToast.info({
        title: 'End of collection',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');
  if (!galleryItem) return;

  const { height: cardHeight } = galleryItem.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

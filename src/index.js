import './sass/main.scss';
import MediaApiService from './js/apiService';
import picturesTpl from './templates/pictures.hbs';
import { error, info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import LoadMoreBtn from './js/load-more-btn';

const mediaApiService = new MediaApiService();
// console.log(mediaApiService);

const refs = {
  searchForm: document.querySelector('.search-form'),
  mediaContainer: document.querySelector('.js-media-container'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};
// console.log(refs.searchForm.value);
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchPictures);

function onSearch(e) {
  e.preventDefault();
  mediaApiService.query = e.currentTarget.elements.query.value;

  if (mediaApiService.query === '') {
    clearMediaContainer();
    return error({
      title: 'Please enter some meaning',
    });
  }

  loadMoreBtn.show();
  mediaApiService.resetPage();
  clearMediaContainer();
  fetchPictures();
}

function fetchPictures() {
  loadMoreBtn.disable();
  mediaApiService
    .fetchPictures()
    .then(hits => {
      appendPicturesMarkup(hits);
      loadMoreBtn.enable();
    })
    .catch(getError);
}

function getError(e) {
  console.log(e);
  error({
    title: `Some was heppaned: "${e}"`,
  });
}

function appendPicturesMarkup(hits) {
  if (hits.length === 0) {
    return info({
      title: 'Nothing else found',
    });
  }
  refs.mediaContainer.insertAdjacentHTML('beforeend', picturesTpl(hits));
  setTimeout(() => {
    const element = document.querySelector(`#selector${hits[0].id}`);
    // console.log(hits[0]);
    // console.log(`#selector${hits[0].id}`);
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, 1000);
}

function clearMediaContainer() {
  refs.mediaContainer.innerHTML = '';
}

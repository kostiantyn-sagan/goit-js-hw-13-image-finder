import debounce from 'lodash.debounce';
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import searchFormTpl from './templates/search-form.hbs';
import imageGalleryTpl from './templates/image-gallery.hbs';
import photoCardTpl from './templates/photo-card.hbs';
import ImageApiService from './js/api-service';
import openLightbox from './js/lightbox';

const refs = {
  sentinel: document.querySelector('#sentinel'),
};

refs.sentinel.insertAdjacentHTML('beforebegin', searchFormTpl());
refs.sentinel.insertAdjacentHTML('beforebegin', imageGalleryTpl());

refs.searchForm = document.querySelector('#search-form');
refs.imageGallery = document.querySelector('.gallery');

const imageApiService = new ImageApiService();

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.searchForm.addEventListener('input', debounce(onSearch, 500));
refs.imageGallery.addEventListener('click', onImageClick);

function onFormSubmit(e) {
  e.preventDefault();
}

async function onSearch(e) {
  imageApiService.query = e.target.value;
  imageApiService.resetPage();
  clearImageGallery();

  try {
    await fetchImages();
  } catch (error) {
    onFetchError(error);
  }
}

async function fetchImages() {
  const images = await imageApiService.fetchImages();
  showNotification(images);
  appendPhotoCardMarkup(images);
}

function showNotification(result) {
  if (result.length === 0 && refs.imageGallery.innerHTML === '')
    return error({
      text: `No results were found for "${refs.searchForm.elements.query.value}".`,
    });
  if (
    refs.searchForm.elements.query.value.trim() === '' &&
    refs.imageGallery.innerHTML === ''
  )
    info({
      text: 'All results are shown. Please enter your search term!',
    });
}

function appendPhotoCardMarkup(images) {
  refs.imageGallery.insertAdjacentHTML('beforeend', photoCardTpl(images));
}

function clearImageGallery() {
  refs.imageGallery.innerHTML = '';
}

function onFetchError(err) {
  console.error('Error: ', err);

  error({
    text: `${err}`,
  });

  refs.searchForm.elements.query.value = '';
}

function onImageClick(e) {
  const isImageEl = e.target.hasAttribute('data-src');
  if (!isImageEl) return;
  openLightbox(e.target.dataset.src);
}

const onEntry = entries => {
  entries.forEach(async entry => {
    if (
      entry.isIntersecting &&
      refs.imageGallery.querySelector('.photo-card')
    ) {
      try {
        await fetchImages();
      } catch (error) {
        onFetchError(error);
      }
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);

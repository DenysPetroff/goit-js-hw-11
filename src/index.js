import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import { getFromApi } from './from-api.js';

// Notiflix.Loading.circle();

 
const searchForm = document.querySelector('.search-form');
const formInput = document.querySelector('input');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


searchForm.addEventListener('submit', formSubmit);
loadMoreBtn.addEventListener('click', loadMore);
loadMoreBtn.style.display = 'none';

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});
  
let inputSearch = '';
let currentPage = 1;

function formSubmit(evt) { 
    evt.preventDefault();
  galleryContainer.innerHTML = '';
  Loading.circle();
    inputSearch = formInput.value;
    // currentPage = 1;

    getFromApi(inputSearch, currentPage).then(
        data => { console.log(data);
            if (data.totalHits === 0) { Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        )           
            } else {
                Notify.success(`Hooray! We found ${data.totalHits} images.`);
              createGalleryMarkup(data);
            }
        }
    ).catch( () => Notify.failure('Error fetching images. Please try again later.')    
  )
  Loading.remove();


}

function createGalleryMarkup(data) { 
    const cardImg = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>  
         `
      <a href="${largeImageURL}"><div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div></a>
  `
    ).join('');

  galleryContainer.insertAdjacentHTML('beforeend', cardImg); 
  gallery.refresh();
   
  loadMoreBtn.style.display = 'block';
}

 async function loadMore() { 
  currentPage += 1;
   Loading.hourglass('Loading more images...');
   try {
     const data = await getFromApi(inputSearch, currentPage);
     createGalleryMarkup(data)
    //  console.log(currentPage);
     const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
     if (currentPage === Math.round(data.totalHits / 40)) {
       Notify.info("We're sorry, but you've reached the end of search results.");
       loadMoreBtn.style.display = 'none';
     }
       
   } catch (error) {
     Notify.failure('Error loading more images. Please try again later.')
   }
   finally {
    Loading.remove();
  }
   };






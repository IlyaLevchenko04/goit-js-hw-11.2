
import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const loadMore = document.querySelector('.load-more')
let page = 1;
const form = document.querySelector('#search-form');
const input = document.querySelector('.input');
const btn = document.querySelector('.btn');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
const apiKey = '32923550-e97d894c3a0a0654cb5be36c1'
const BASE_URL = `https://pixabay.com/api/?key=${apiKey}&`;
loadMore.setAttribute('hidden', 'true')

let lightbox = new SimpleLightbox('.gallery a',{ 
  captionsData: 'alt',
  captionPosition : 'bottom',
  captionDelay : 250
});

console.log('hello')

form.addEventListener('submit', onSubmitSearch);
loadMore.addEventListener('click', onClick)

async function PixabayAPI(page){
    try{
        const response = await axios.get(`${BASE_URL}q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
        const data = await response.data;
        console.log(response)
       return data
    }catch (err){
        console.log(err)
    }
    
}

 function createMarkup(mass){
    
    
    const markup = mass.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<a href="${largeImageURL}" alt="${tags}" class="link"><div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="card-image"/>
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div></a>`
    }).join('');
     gallery.innerHTML += markup;
     lightbox.refresh();
}

async function onClick(evt){
    try{evt.preventDefault();
    page += 1;
    console.log(page)
    lightbox.refresh();
    const data = await PixabayAPI(page);
    if(page <= Math.ceil(data.total/40)){
       createMarkup(data.hits)
      console.log('if', Math.ceil(data.total/40))

    }else if(page > Math.ceil(data.total/40)){
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        loadMore.setAttribute('hidden', 'true')
}}catch (err){
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}
}

async function onSubmitSearch(evt){
    try{evt.preventDefault();
    page = 1;
    const data = await PixabayAPI(page);
    lightbox.refresh();
    if(input.value === ''){
      throw new Error();
    }
    if(data.hits.length > 0){
      createOneMarkup(data.hits);
      loadMore.removeAttribute('hidden');
     console.log(data);
     return data
    }else {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  }catch (err){
    Notiflix.Notify.failure('Sorry, there are no words in input. Please try again.');
  }
}


function createOneMarkup(mass){
  const markup = mass.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
    return `<a href="${largeImageURL}" alt="${tags}" class='link'><div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" class="card-image"/>
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div></a>`
}).join('');
 gallery.innerHTML = markup;
 lightbox.refresh();
}

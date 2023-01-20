import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
import "simplelightbox/dist/simple-lightbox.min.css";



const simple = new SimpleLightbox('.gallery a', { 
    captionsData: 'alt',
    captionPosition : 'bottom',
    captionDelay : 250,
    nav: true,
    close: true });
let page = 1;
const form = document.querySelector('#search-form');
const input = document.querySelector('.input');
const btn = document.querySelector('.btn');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
const apiKey = '32923550-e97d894c3a0a0654cb5be36c1'
const BASE_URL = `https://pixabay.com/api/?key=${apiKey}&`;

form.addEventListener('submit', onSubmit);

async function  onSubmit(evt){
    evt.preventDefault();
    try{
        const response = await axios.get(`${BASE_URL}q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`);
        const data = await response.data;  
       if(data.hits.length > 0){
          await createMarkup(data.hits);
          console.log(data)
       }else{
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
       }
    }catch (err){
        console.log(err)
    }
    
}


async function createMarkup(mass){
    
    
    const markup =  await mass.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<a href="${largeImageURL}" alt="${tags}"><div class="photo-card">
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
     gallery.innerHTML += await markup;
     
    
}

console.log('why')



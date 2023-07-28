import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '38511196-ae363f56bf8cdaa1e3bc59f0d';
const PER_PAGE = 40;

axios.defaults.baseURL = BASE_URL;



export async function getFromApi(inputSearch, currentPage) { 
    const params = new URLSearchParams({
    key: KEY,
    q: inputSearch,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: PER_PAGE,
    })

    // Notiflix.Loading.circle();

    const response = await axios.get(`?${params}`);
    return await response.data;
}




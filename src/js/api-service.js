const API_KEY = '19475707-408c9466706baaa6817e821a9';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      q: this.searchQuery,
      page: this.page,
      per_page: 12,
      key: API_KEY,
    });
    const url = `${BASE_URL}?${searchParams}`;

    const response = await fetch(url);

    if (response.ok) {
      const { hits } = await response.json();

      this.incrementPage();

      return hits;
    } else {
      throw new Error('Error fetching data');
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

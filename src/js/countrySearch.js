import '../css/styles.css';
import fetchCountries from './APIservice/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const refs = {
  searchInputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
};

const DEBOUNCE_DELAY = 300;

refs.searchInputEl.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput(event) {
  let searchValue = event.target.value.trim();
  fetchCountries(searchValue).then(res => {
    if (res.length > 10) {
      refs.countryListEl.innerHTML = '';

      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (res.length >= 2 && res.length <= 10) {
      refs.countryListEl.innerHTML = '';

      const renderValue = renderCountries(res);

      refs.countryListEl.insertAdjacentHTML('beforeend', renderValue);
    } else if (res.length === 1) {
      refs.countryListEl.innerHTML = '';

      const renderValue = renderSingleCountry(res);

      refs.countryListEl.insertAdjacentHTML('beforeend', renderValue);
    } else {
      refs.countryListEl.innerHTML = '';

      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
  });
}

function renderCountries(res) {
  return res
    .map(
      e => `
                <div class='country-list__item'>
                    <img class='country-list__flag' src='${e.flag}'
                        width="30"
                    >
                    <span>${e.name}</span>
                </div>
            `
    )
    .join('');
}

function renderSingleCountry(res) {
  const e = res[0];
  return `
                <div class='country-info'>
                    <div class='country-info__logo'>
                    <img src='${e.flag}'
                        width="30"
                        height="30"
                    >
                    <h1 class='country-info__title'>${e.name}</h1>
                    </div>
                    
                    <ul class='country-info__list'>
                        <li class='country-info__item'>
                            <h3 class='country-info__item-title'>Capital:</h3>
                            <span>${e.capital}</span>
                        </li>
                        <li class='country-info__item'>
                            <h3 class='country-info__item-title'>Population:</h3>
                            <span>${e.population}</span>
                            </li>
                        <li class='country-info__item'>
                            <h3 class='country-info__item-title'>Languages:</h3>
                            <span>${e.languages
                              .map(e => e.name)
                              .join(',')}</span>
                        </li>
                    </ul>
                </div>
            `;
}

import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = ''
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';  //selects everything inside the ul element selected by searchResList and turns it to nothing
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'))
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active')
    })
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

// 'Pasta with tomato and spinach'
//The reduce() method executes a provided function for each value of the array (from left-to-right).
//split turns the above into an array of ['Pasta', 'with', 'tomato','and','spinach']

const limitRecipeTitle = (title, limit = 17) => {  //limits the length of recipe names
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => { 
            if (acc + cur.length <= limit){
                newTitle.push(cur)
            }
            return acc + cur.length
        }, 0);
        return `${newTitle.join(' ')} ...`; //join the array as a string with spaces in between, and dots at the end
    }  
}
//   <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
const renderRecipe = recipe => {   
    const markup = `
        <li>
            <a class="results__link results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);      //inserting the results html after last child element inside the                                                                               searchResList DOM item
}

// export const renderResults = recipes => {   
//     recipes.forEach(renderRecipe);
// }

// type: prev or next
const createButton = (page, type) => {
    return `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `
}

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);   

    let button;
    if (page === 1 && pages > 1) {
        button = createButton(page, 'next')
    } else if (page < pages) {
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `
    } else if (page === pages && pages > 1) {
        button = createButton(page, 'prev')
    } 

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {   
    // render results of current page
    const start = (page - 1) * resPerPage; 
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);    //slice(2,4) would return an array only from 2 to 3
    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
}
// import axios from 'axios';       this returns something from the api

// async function getResults(query) {
//     const proxy = 'https://cors-anywhere.herokuapp.com/'
//     const key = 'fbd87ec5ee1025b7a4585bc31ff71337'
//     const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`)
//     console.log(res)
// };

// getResults('pizza')

import Search from './models/Search'
import Recipe from './models/Recipes'
import List from './models/List'
import Likes from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import {elements, renderLoader, clearLoader} from './views/base'

alert('The Food2Fork API which this page depends on was officially closed on November 30th, 2019. Functionality remains, barring image support')

const state = {}
// window.state= state
// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput() //TODO
    // console.log(query)

    if (query) {
        //2. New search object, and add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();    //clears the input after having searched one
        searchView.clearResults();  //clears the search results upon searching for something new
        renderLoader(elements.searchResults)

        try {
            //4. Search for recipes
            await state.search.getResults();    //returns a promise after having awaited the Search class's return

            //5. render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result) //earlier defined as "this.result" in the class contained in Search.js
        } catch (error) {
            alert(error)
        }
        
    }
}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
})


elements.searchResPages.addEventListener('click', event => {    // .closest
    const btn = event.target.closest('.btn-inline');    //because when clicking on the button, you want the button not the span or svg element
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);    //10 is specified mathmatically to not be hexadecimal (16) but the normal # system
        searchView.clearResults(); 
        searchView.renderResults(state.search.result, goToPage)
    }
})
// SEARCH CONTROLLER END
//Recipe Controller Start

// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
    //get id fromt he url
    const id = window.location.hash.substring(1); // would return #45467 for example, but substring starts it after # so its just the number
    // console.log(id);

    if (id) {
        //prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();         // console.log(state.recipe.ingredients)
            
            state.recipe.parseIngredients();
            state.recipe.calcTime();            //calculate servings and time
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            console.log(error)
            alert(error)
        }
        
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

//LIST CONTROLLER
const controlList = () => {
    //create a new list if there aren't any yet
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e=> {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id);
    }   else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10)
        state.list.updateCount(id, val)
    }
})

//LIKES CONTROLLER
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if(!state.likes.isLiked(currentID)) {   //user has not yet liked current recipe
        //add like to the state

        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )

        //toggle the like button
        likesView.toggleLikeBtn(true);
        //add like to the UI list
        likesView.renderLike(newLike)
    
    }   else {  //user has liked current recipe
        //remove like from the state
        state.likes.deleteLike(currentID)
        //toggle the like button
        likesView.toggleLikeBtn(false);
        //remove like from UI list
        likesView.deleteLike(currentID)
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes(); 

    //Restore likes
    state.likes.readStorage(); 

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    //Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))
})





//handling recipe button clicks
//buttons arent there at time of loading the page, so event delegation is required
elements.recipe.addEventListener('click', e=> {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { //btn-decrease or any of its children
        //Decrease button is clicked
        if (state.recipe.servings > 1){
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe)

        }
    }   else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe);
    }   else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list
        controlList();
    }   else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
})
// window.l = new List();

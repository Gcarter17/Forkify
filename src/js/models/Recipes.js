import axios from 'axios';
import {key, proxy} from '../config'

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

            // console.log(res);
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    calcTime() {
        //Assuming we need 15 mins for each 3 ingredients
        const numIng = this.ingredients.length; //number of ingredients
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {    
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb'];
        const units = [...unitsShort, 'kg', 'g' ]


        const newIngredients = this.ingredients.map(el => {
            // 1. uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i])
            });
            // 2. remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            // 3. parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');    //turn a string into an array from space to space
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2)); //find position of unit when not knowing what unit is looked for

            let objIng;
            if (unitIndex > -1) {
                //there is a unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));  //if its 1-1/2 cups it turns into 1+1/2, then 1.5
                }   else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); //eval turns 4 + 1/2 into 4.5
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')

                }

            }   else if (parseInt(arrIng[0], 10)) {
                //there aren't any, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }   else if (unitIndex === -1) {
                //there is no unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            } 

            return objIng;
        })
        this.ingredients = newIngredients
    }

    updateServings (type) {
        //servings
        const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;

        //ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings)
        })
        
        this.servings = newServings;
    }
}
import axios from 'axios';
import {key, proxy} from '../config'

export default class Search {   //class is used for making a constructor, export default is so it can be used in other files
    constructor(query) {
        this.query = query;
    }

    async getResults() {   //asynchronous method of this class, so no need to have function in the name
        

        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes; //using this means it will be saved into the object
            // console.log(this.result);
        } catch (error){
            alert(error)
        }
        
        }
}





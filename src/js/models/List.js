import uniqid from 'uniqid'

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(el => el.id === id)  // finds the index in the array where the object's id is equal to "id"
        this.items.splice(index, 1) //start at position index, and take 1 item
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id ===id).count = newCount;       //returns the element itself instead of the index
    }
}
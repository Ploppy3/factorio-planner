import { Injectable } from '@angular/core';

import { data_recipe } from "./recipe";

@Injectable()
export class DataService {

  public recipes: any[] = [];
  //public furnaces: any[] = [];
  public assemblingMachines: any[] = [];

  constructor() {
    let data = JSON.parse(data_recipe)
    for (let key in data.prototypes.recipe) {
      this.recipes.push(data.prototypes.recipe[key]);
    }
    for (let key in data.prototypes.furnace) {
      this.assemblingMachines.push(data.prototypes.furnace[key]);
    }
    for (let key in data.prototypes['assembling-machine']) {
      this.assemblingMachines.push(data.prototypes['assembling-machine'][key]);
    }
    //console.log(this.recipes);
    console.log(this.assemblingMachines);
  }

  public getAssemblingMachinesByCategory(category: string, recipeIngredients: number): any[] {
    let response = [];
    this.assemblingMachines.forEach(machine => {
      if (machine.crafting_categories) {
        machine.crafting_categories.forEach(_category => {
          let ingredient_count = machine.ingredient_count || Infinity;
          if (_category == category && ingredient_count >= recipeIngredients) {
            response.push(machine);
          }
        });
      }  
    });
    return response;
  }

}

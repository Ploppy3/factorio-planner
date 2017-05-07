import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";  

import { data_recipe_15_5, data_recipe_15_7, data_recipe_15_8 } from "./recipe";

@Injectable()
export class DataService {

  public dataVersions: any[] = [
    { name: '15.8 to 15.9', data: data_recipe_15_8 },
    { name: '15.7', data: data_recipe_15_7 },
    { name: '15.5 to 15.6', data: data_recipe_15_5 },
  ];
  public recipes: any[] = [];
  public assemblingMachines: any[] = [];

  constructor() {
    console.log('constructor');
    this.loadData(0);
  }

  public loadData(index: number) {
    let data = JSON.parse(this.dataVersions[index].data);
    this.recipes = [];
    this.assemblingMachines = [];
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
 
  // retrieve machines for a node
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

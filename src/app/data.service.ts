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
  public assemblingMachinesSettings: any[] = [];

  constructor() {
    //console.log('constructor');
    this.loadData(0);
  }

  public loadData(index: number) {
    let data = JSON.parse(this.dataVersions[index].data);
    this.recipes = [];
    this.assemblingMachines = [];
    this.assemblingMachinesSettings = [];
    for (let key in data.prototypes.recipe) {
      this.recipes.push(data.prototypes.recipe[key]);
    }
    for (let key in data.prototypes.furnace) {
      this.assemblingMachines.push(data.prototypes.furnace[key]);
      this.assemblingMachinesSettings.push({ name: data.prototypes.furnace[key].name, enabled: true});
    }
    for (let key in data.prototypes['assembling-machine']) {
      this.assemblingMachines.push(data.prototypes['assembling-machine'][key]);
      this.assemblingMachinesSettings.push({ name: data.prototypes['assembling-machine'][key].name, enabled: true});
    }
    //console.log(this.recipes);
    console.log(this.assemblingMachines);
    console.log(this.assemblingMachinesSettings);
  }
 
  // retrieve machines for a node
  public getAssemblingMachinesByCategory(category: string, recipeIngredients: number): any[] {
    let response = [];
    this.assemblingMachines.forEach(machine => {
      if (machine.crafting_categories) {
        machine.crafting_categories.forEach(_category => {
          let ingredient_count = machine.ingredient_count || Infinity;
          let enabledInSettings: boolean = false;
          this.assemblingMachinesSettings.forEach(machineInSettings => {
            if (machine.name == machineInSettings.name) {
              if (machineInSettings.enabled) enabledInSettings = true;
            }
          });
          if (_category == category && ingredient_count >= recipeIngredients && enabledInSettings) {
            response.push(machine);
          }
        });
      }  
    });
    return response;
  }

}

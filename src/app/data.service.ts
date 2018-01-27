import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { VirtualOutputNodeComponent } from 'app/virtual-output-node/virtual-output-node.component';

@Injectable()
export class DataService {
  public dataVersions: Version[] = [
    { name: '16', fileName: 'v16.json' },
    { name: '16+marathon', fileName: 'v16-marathon.json' },
    { name: '16+bob', fileName: 'v16-bob.json' },
    { name: '15', fileName: 'v15.json' },
    { name: '15+marathon', fileName: 'v15-marathon.json' },
  ];
  public recipes: any[] = [];
  public recipesObject: {} = {};
  public assemblingMachines: any[] = [];
  public assemblingMachinesSettings: any[] = [];

  public outputNode: VirtualOutputNodeComponent;

  constructor(
    private httpClient: HttpClient
  ) {
    if (!environment.production) console.log('constructor');
    this.loadData(0);
  }

  public selectVersion(name: string) {
    for (let i = 0; i < this.dataVersions.length; i++) {
      let version = this.dataVersions[i];
      if (version.name == name) {
        this.loadData(i);
        break;
      }
    }
  }

  public loadData(index: number) {
    console.log('loading data at index:' + index);
    if (this.dataVersions[index].fileName) { // if new version
      try {
        this.httpClient.get('/assets/factorio-data/' + this.dataVersions[index].fileName).subscribe(
          data => {
            //console.log(data);
            this.recipes = data['recipes'];
            this.recipesObject = {};
            data['recipes'].forEach(recipe => {
              this.recipesObject[recipe.name] = recipe;
            });
            this.assemblingMachines = data['craftingMachines'];
            this.assemblingMachinesSettings = [];
            data['craftingMachines'].forEach(craftingMachine => {
              if(craftingMachine.name !== 'player') // needed to filter 'player' from the crafting machines
                this.assemblingMachinesSettings.push({ name: craftingMachine.name, enabled: true });
            });
            this.outputNode.fullRefresh();
          }
        );
      } catch (error) {
        console.error(error);
      }
    } else { // if old version
      try {
        console.log('loading', this.dataVersions[index].name);
        let data = JSON.parse(this.dataVersions[index].dataKey);
        this.recipes = [];
        this.assemblingMachines = [];
        this.assemblingMachinesSettings = [];
        //console.log(data.prototypes.recipe);
        for (let key in data.prototypes.recipe) {
          this.recipes.push(data.prototypes.recipe[key]);
          this.recipesObject[key] = data.prototypes.recipe[key];
        }
        //console.log(this.recipesObject);
        for (let key in data.prototypes.furnace) {
          this.assemblingMachines.push(data.prototypes.furnace[key]);
          this.assemblingMachinesSettings.push({ name: data.prototypes.furnace[key].name, enabled: true });
        }
        for (let key in data.prototypes['assembling-machine']) {
          this.assemblingMachines.push(data.prototypes['assembling-machine'][key]);
          this.assemblingMachinesSettings.push({ name: data.prototypes['assembling-machine'][key].name, enabled: true });
        }
        this.outputNode.fullRefresh();

        //console.log(this.recipes);
        //console.log(this.assemblingMachines);
        //console.log(this.assemblingMachinesSettings);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public getAssemblingMachinesByCategory(category: string, recipeIngredients: number): any[] {
    let response = [];
    this.assemblingMachines.forEach(machine => {

      if (machine.categories) {
        for (var _category in machine.categories) {
          let ingredient_count = machine.ingredientCount || Infinity;
          let enabledInSettings: boolean = false;
          this.assemblingMachinesSettings.forEach(machineInSettings => {
            if (machine.name == machineInSettings.name) {
              if (machineInSettings.enabled) enabledInSettings = true;
            }
          });
          if (_category == category && ingredient_count >= recipeIngredients && enabledInSettings) {
            let _machine = { name: machine.name, crafting_speed: machine.craftingSpeed }
            response.push(_machine);
          }
        }
        /*
        machine.categories.forEach(_category => {
          let ingredient_count = machine.ingredient_count || Infinity;
          let enabledInSettings: boolean = false;
          this.assemblingMachinesSettings.forEach(machineInSettings => {
            if (machine.name == machineInSettings.name) {
              if (machineInSettings.enabled) enabledInSettings = true;
            }
          });
          if (_category == category && ingredient_count >= recipeIngredients && enabledInSettings) {
            let _machine = {name: machine.name, crafting_speed: machine.crafting_speed}
            response.push(_machine);
          }
        });
        */
      }

      // -------------- DEPRECATED | OLD VERSION

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
            let _machine = { name: machine.name, crafting_speed: machine.crafting_speed }
            response.push(_machine);
          }
        });
      }

    });
    return response;
  }

}

interface Version {
  name: string;
  /** The Key of the data, if stored in recipes.ts */
  dataKey?: string;
  /** The name of file, if store in /assets/factorio-data/ as a .json file  */
  fileName?: string;
}

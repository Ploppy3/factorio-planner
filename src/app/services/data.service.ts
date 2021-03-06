import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { TreeNode } from '../tree-node';

@Injectable()
export class DataService {
  public dataVersions: Version[] = [
    { name: '1.1.19', fileName: '1.1.19.json' },
    { name: '1.1.19+marathon', fileName: '1.1.19-marathon.json' },
    { name: '1.0.0', fileName: '1.0.0.json' },
    { name: '1.0.0+marathon', fileName: '1.0.0-marathon.json' },
    { name: '18', fileName: 'v18.json' },
    { name: '18+marathon', fileName: 'v18-marathon.json' },
    { name: '18', fileName: 'v18.json' },
    { name: '18+marathon', fileName: 'v18-marathon.json' },
    { name: '17', fileName: 'v17.json' },
    { name: '17+marathon', fileName: 'v17-marathon.json' },
    { name: '16', fileName: 'v16.json' },
    { name: '16+marathon', fileName: 'v16-marathon.json' },
    { name: '16+angel', fileName: 'v16-angel.json' },
    { name: '16+angel+bob', fileName: 'v16-angel-bob.json' },
    { name: '16+bob', fileName: 'v16-bob.json' },
    { name: '15', fileName: 'v15.json' },
    { name: '15+marathon', fileName: 'v15-marathon.json' },
  ];
  public recipes = [];
  public recipesObject = {};
  public assemblingMachines = [];
  public assemblingMachinesSettings = [];
  public outputNode: TreeNode;
  public onVersionChange$ = new EventEmitter<void>();

  constructor(
    private httpClient: HttpClient,
  ) {
    if (!environment.production) {
      console.log('constructor');
    }
    this.loadData(0);
  }

  public logInfo() {
    console.log('recipes', this.recipes);
    console.log('assemblingMachines', this.assemblingMachines);
  }

  public addVersion(name: string, data: any) {
    this.dataVersions.unshift({
      name,
      isCustom: true,
      customData: data,
    });
    this.onVersionChange$.next();
  }

  public selectVersion(name: string) {
    for (let i = 0; i < this.dataVersions.length; i++) {
      const version = this.dataVersions[i];
      if (version.name === name) {
        this.loadData(i);
        break;
      }
    }
  }

  public loadData(index: number) {
    console.log('loading data at index:' + index);
    if (this.dataVersions[index].isCustom) {
      this.processModernData(this.dataVersions[index].customData);
    } else if (this.dataVersions[index].fileName) { // if new version
      try {
        this.httpClient.get('/assets/factorio-data/' + this.dataVersions[index].fileName).subscribe(
          data => {
            this.processModernData(data);
          }
        );
      } catch (error) {
        console.error(error);
      }
    } else { // if old version
      try {
        console.log('loading', this.dataVersions[index].name);
        const data = JSON.parse(this.dataVersions[index].dataKey);
        this.recipes = [];
        this.assemblingMachines = [];
        this.assemblingMachinesSettings = [];
        // console.log(data.prototypes.recipe);
        for (const key in data.prototypes.recipe) {
          if (data.prototypes.recipe[key]) {
            this.recipes.push(data.prototypes.recipe[key]);
            this.recipesObject[key] = data.prototypes.recipe[key];
          }
        }
        // console.log(this.recipesObject);
        for (const key in data.prototypes.furnace) {
          if (data.prototypes.furnace[key]) {
            this.assemblingMachines.push(data.prototypes.furnace[key]);
            this.assemblingMachinesSettings.push({ name: data.prototypes.furnace[key].name, enabled: true });
          }
        }
        for (const key in data.prototypes['assembling-machine']) {
          if (data.prototypes['assembling-machine'][key]) {
            this.assemblingMachines.push(data.prototypes['assembling-machine'][key]);
            this.assemblingMachinesSettings.push({ name: data.prototypes['assembling-machine'][key].name, enabled: true });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private processModernData(data: any) {
    // console.log(data);
    this.recipes = data['recipes'];
    this.recipesObject = {};
    data['recipes'].forEach(recipe => {
      this.recipesObject[recipe.name] = recipe;
    });
    this.assemblingMachines = data['craftingMachines'];
    this.assemblingMachinesSettings = [];
    data['craftingMachines'].forEach(craftingMachine => {
      if (craftingMachine.name !== 'player') { // needed to filter 'player' from the crafting machines
        this.assemblingMachinesSettings.push({ name: craftingMachine.name, enabled: true });
      }
    });
    this.onVersionChange$.next();
  }

  public getAssemblingMachinesByCategory(category: string, recipeIngredients: number): any[] {
    const response = [];
    this.assemblingMachines.forEach(machine => {

      if (machine.categories) {
        for (const _category in machine.categories) {
          if (machine.categories[_category]) {
            const ingredient_count = machine.ingredientCount || Infinity;
            let enabledInSettings = false;
            this.assemblingMachinesSettings.forEach(machineInSettings => {
              if (machine.name === machineInSettings.name) {
                if (machineInSettings.enabled) { enabledInSettings = true; }
              }
            });
            if (_category === category && ingredient_count >= recipeIngredients && enabledInSettings) {
              const _machine = { name: machine.name, crafting_speed: machine.craftingSpeed };
              response.push(_machine);
            }
          }
        }
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
  isCustom?: true;
  customData?: any;
}

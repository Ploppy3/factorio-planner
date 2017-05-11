import { DataService } from "./data.service";
import { PlannerService } from "./planner.service";

export class Node {  

  public recipe: any; //game recipe provided by the data service

  public useExpensive: boolean = false;
  public outputRate: number = 1;
  public name: string = 'Item';
  public recipeRequest: number = 1;
  public quantityPerCraft: number = 1;
  //public craftingSpeed: number = .0;
  public craftingMachine: any;
  public craftingTime: number = .5;
  public numberMachines: number = 1;

  public parent: Node;  
  public childs: Node[] = [];
  public showOptions: boolean = false;
  public category: string = 'unknown'; // crafting, crafting-with-fluid, advanced-crafting, smelting, chemistry
  public machines: any[] = [];

  constructor(private dataService: DataService, private plannerService: PlannerService){}

  public calculate() {
    this.outputRate = this.parent.outputRate / this.parent.quantityPerCraft * this.recipeRequest;
    //console.log('calculate', this.name, this.outputRate);
    if(this.craftingMachine)
      this.numberMachines = this.outputRate / this.quantityPerCraft / (this.craftingMachine.crafting_speed /  this.craftingTime);
    this.childs.forEach(node => {
      node.calculate();
    });
  }

  public getSharedResources() {
    //console.log('share...');
    this.plannerService.addSharedResource(this.name, this.outputRate * this.plannerService.timeFactor$.value);
    this.childs.forEach(node => {
      node.getSharedResources();
    });
  }

  public initialize() {
    if (!this.recipe) { this.calculate(); return; }
    //console.log(this.recipe);
    let ingredients: any[] = [];
    //-------------------------------
    if (this.recipe.category) {
      this.category = this.recipe.category;
    } else {
      this.category = 'crafting'; //default
    }
    this.quantityPerCraft = 1; // reset value (needed for root node only)
    if (this.recipe.expensive && this.plannerService.useExpensiveRecipes$.value) { // expensive
      if (this.recipe.expensive.ingredients) ingredients = this.recipe.expensive.ingredients;
      if (this.recipe.expensive.energy_required) this.craftingTime = this.recipe.expensive.energy_required;
      //console.log('using expensive recipe', this.recipe.name);
    } else if (this.recipe.normal) { // normal
      if (this.recipe.normal.ingredients) ingredients = this.recipe.normal.ingredients;
      if (this.recipe.normal.energy_required) this.craftingTime = this.recipe.normal.energy_required;
    } else { // basic
      if (this.recipe.ingredients) ingredients = this.recipe.ingredients;
      if (this.recipe.energy_required) this.craftingTime = this.recipe.energy_required;
      if (this.recipe.result_count) this.quantityPerCraft = this.recipe.result_count;
    }
    if (this.recipe.results) {
      this.recipe.results.forEach(result => {
        if (result.name == this.recipe.name) {
          this.quantityPerCraft = result.amount;
        }
      });
    }
    let machines = this.dataService.getAssemblingMachinesByCategory(this.category, ingredients.length);
    this.machines = machines;
    if (machines.length > 0) {
      this.craftingMachine = machines[0];
      //console.log('using machine:', machines[0], 'for', recipe.name);
    } else {
      this.craftingMachine = null;
    }
    //-------------------------------
    this.calculate(); //do it here to prevent propagation of the calculate call to its children
    //-------------------------------
    ingredients.forEach(ingredient => {
      if (Array.isArray(ingredient)) { // type 1 - array
        this.addChild(ingredient[0], ingredient[1]);  // name, amount
      } else { // type 2 - object
        this.addChild(ingredient.name, ingredient.amount);
      }
    });
  }

  public findRecipeByName() { // starts a major refresh
    //console.log('searching recipe', this.name);
    this.childs = [];
    if (this.dataService.recipesObject[this.name]) {
      this.recipe = this.dataService.recipesObject[this.name];
      this.initialize();
      return;
    }
    this.calculate(); //do it here to prevent propagation of the calculate call to its children
    this.category = 'unknown'; // reset for root node
  }

  public addChild(name: string, recipeRequest: number) {
    let node = new Node(this.dataService, this.plannerService);
    node.parent = this;
    node.name = name
    node.recipeRequest = recipeRequest;
    //node.calculate();
    this.childs.push(node);
  }
}

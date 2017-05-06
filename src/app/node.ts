import { DataService } from "./data.service";
import { PlannerService } from "./planner.service";

export class Node {  

  //for test purpose
  public outputRate: number = 1;

  public name: string = 'Item';
  public recipeRequest: number = 1;
  public quantityPerCraft: number = 1;
  public craftingSpeed: number = .0;
  public craftingTime: number = .5;
  public numberMachines: number = 1;
  //public rate = 0;

  public parent: Node;  
  public childs: Node[] = [];
  //public attenuation: number = 1;
  public showOptions: boolean = false;
  public category: string = 'unknown'; // crafting, crafting-with-fluid, advanced-crafting, smelting, chemistry
  public machines: any[] = [];

  constructor(private dataService: DataService, private plannerService: PlannerService){}

  public calculate() {
    //this.attenuation = (this.recipeRequest / this.quantityPerCraft) * this.parent.attenuation;
    //this.numberMachines = this.craftingTime * (this.recipeRequest * this.parent.attenuation) / this.craftingSpeed / this.quantityPerCraft;
    this.outputRate = this.parent.outputRate / this.parent.quantityPerCraft * this.recipeRequest;
    this.numberMachines =  this.outputRate / ((1 * this.craftingSpeed) / this.craftingTime);
    //this.rate = this.quantityPerCraft / this.craftingTime * this.craftingSpeed * this.numberMachines;
    //this.rate = 0;
    this.childs.forEach(node => {
      node.calculate();
    });
  }

  public findRecipeByName() {
    this.childs = [];
    for (let i = 0; i < this.dataService.recipes.length; i++) {
      let recipe = this.dataService.recipes[i];
      if (recipe.name == this.name) {
        console.log(recipe);
        let ingredients: any[] = [];
        //-------------------------------
        if (recipe.category) {
          this.category = recipe.category;
        } else {
          this.category = 'crafting'; //default
        }
        this.quantityPerCraft = 1; // reset value (needed for root node only)
        if (recipe.expensive && this.plannerService.$useExpensiveRecipes.value) { // expensive
          if (recipe.normal.ingredients) ingredients = recipe.expensive.ingredients;
          if (recipe.normal.energy_required) this.craftingTime = recipe.expensive.energy_required;
          //console.log('using expensive recipe for', recipe)
        } else if (recipe.normal) { // normal
          if (recipe.normal.ingredients) ingredients = recipe.normal.ingredients;
          if (recipe.normal.energy_required) this.craftingTime = recipe.normal.energy_required;
        } else { // basic
          if (recipe.ingredients) ingredients = recipe.ingredients;
          if (recipe.energy_required) this.craftingTime = recipe.energy_required;
          if (recipe.result_count) this.quantityPerCraft = recipe.result_count;
        }
        if (recipe.results) {
          recipe.results.forEach(result => {
            if (result.name == recipe.name) {
              this.quantityPerCraft = result.amount;
            }
          });
        }
        let machines = this.dataService.getAssemblingMachinesByCategory(this.category, ingredients.length);
        if (machines.length > 0) {
          this.machines = machines;
          this.craftingSpeed = machines[0].crafting_speed;
          //console.log('using machine:', machines[0], 'for', recipe.name);
        }
        //-------------------------------
        this.calculate(); // do it at this moment to prevent calculate call to propagate to its childs
        //-------------------------------
        ingredients.forEach(ingredient => {
          if (Array.isArray(ingredient)) { // type 1 - array
            this.addChild(ingredient[0], ingredient[1]);  // name, amount
          } else { // type 2 - object
            this.addChild(ingredient.name, ingredient.amount);
          }
        });
        return recipe;
      }
    }
    this.category = 'unknown';
    console.log("can't find recipe for", this.name);
  }

  public addChild(name?: string, output?: number, category?: string) {
    let node = new Node(this.dataService, this.plannerService);
    node.parent = this;
    if (name) node.name = name
    if (output) node.recipeRequest = output;
    node.calculate();
    this.childs.push(node);
  }
}

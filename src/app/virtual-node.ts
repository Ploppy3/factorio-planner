import { PlannerService } from "./planner.service";

export class VirtualNode {

  public recipe: any;
  public childsIds: number[] = [];
  public idParent: number;
  public recipeRequest: number = 1;
  public outputRate: number = 1;
  public quantityPerCraft = 1;
  public craftingTime = .5;
  public numberMachines = 0;
  public craftingMachine = null;
  public category: string = 'unknown';
  public machines = [];
  public showOptions = false;

  constructor(private plannerService: PlannerService, public name: string) { }
  
  public calculate() {
    let parent = this.plannerService.virtualTree[this.idParent] || null;
    if (parent)
      this.outputRate = parent.outputRate / parent.quantityPerCraft * this.recipeRequest;  
    else
      this.outputRate = 1 / 1 * this.recipeRequest;
    //console.log('calculate', this.name, this.outputRate);
    if(this.craftingMachine)
      this.numberMachines = this.outputRate / this.quantityPerCraft / (this.craftingMachine.crafting_speed /  this.craftingTime);
  }

  public getSharedResources() {
    //console.log('share...');
    this.plannerService.addSharedResource(this.name, this.outputRate * this.plannerService.timeFactor$.value);
  }

}

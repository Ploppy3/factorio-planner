import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlImg'
})
export class UrlImgPipe implements PipeTransform {

  transform(value: string, args?: any): any { // set first letter of 'value' as a capital letter
    switch (value) {
      case 'transport-belt':
        value = "basic-transport-belt";
        break;
      case 'inserter':
        value = "inserter-icon";
        break;
      case 'electric-mining-drill':
        value = "basic-mining-drill";
        break;
      case 'military-science-pack':
        value = "military_science_pack";
        break;
      case 'production-science-pack':
        value = "production_science_pack";
        break;
      case 'high-tech-science-pack':
        value = "high_tech_science_pack";
        break;
      case 'piercing-rounds-magazine':
        value = "piercing-bullet-magazine";
        break;
      case 'firearm-magazine':
        value = "basic-bullet-magazine";
        break;
      case 'grenade':
        value = "basic-grenade";
        break;
    
      default:
        break;
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

}

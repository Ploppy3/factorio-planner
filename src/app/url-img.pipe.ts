import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlImg'
})
export class UrlImgPipe implements PipeTransform {

  transform(value: string, args?: any): any { // set first letter of 'value' as a capital letter
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

}

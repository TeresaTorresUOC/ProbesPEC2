import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | string, ...args: number[]): string {
    //  TODO 1
    if (!value) return '';

    const formatType = args[0] ?? 1; 
    const date = new Date(value);

  
    let day: string = date.getDate().toString();
    let month: string = (date.getMonth() + 1).toString(); // Mes empieza en 0
    const year: string = date.getFullYear().toString();

    if (parseInt(day, 10) < 10) day = '0' + day;
    if (parseInt(month, 10) < 10) month = '0' + month;

   
    switch (formatType) {
      case 1:
        return `${day}${month}${year}`; 
      case 2:
        return `${day} / ${month} / ${year}`; 
      case 3:
        return `${day}/${month}/${year}`; 
      case 4:
        return `${year}-${month}-${day}`; 
      default:
        return `${day}/${month}/${year}`;
    }
  }
}

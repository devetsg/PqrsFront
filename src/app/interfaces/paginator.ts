import { MatPaginatorIntl } from '@angular/material/paginator';

export class MyCustomPaginatorIntl extends MatPaginatorIntl {
  // Modificar el texto de "Items per page"
  override itemsPerPageLabel = 'Elementos por página';

  // Puedes personalizar otros textos también, si lo deseas
  override nextPageLabel = 'Siguiente página';
  override previousPageLabel = 'Página anterior';

  // Si necesitas también cambiar el rango de páginas
  override getRangeLabel = function (page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}

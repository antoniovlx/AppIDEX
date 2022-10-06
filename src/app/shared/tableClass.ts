import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";

export class TableClass {
    elements: number = 0;
    isLoading = true;

    dataSource: MatTableDataSource<any>;
    selection = new SelectionModel<any>(true, []);

    isAllSelected(): boolean {
        if (this.dataSource === undefined)
            return false;

        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    isSelected(): boolean {
        const numSelected = this.selection.selected.length;
        return numSelected !== 0;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }


    checkboxLabel(id?: number, row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${id + 1}`;
    }

}
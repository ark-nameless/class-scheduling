import { Injectable } from '@angular/core';

export interface ColumnInfo {
  id: string;
  name: string;
  hidden: boolean;
  preventBeingHidden: boolean;
}

@Injectable()
export class ColumnSorterService {
  loadSavedColumnInfo(columnInfo: ColumnInfo[], saveName?: string): ColumnInfo[] | undefined {
    // Only load if a save name is passed in
    if (saveName) {
      if (!localStorage) {
        return;
      }

      const loadedInfo = localStorage.getItem(`${saveName}-columns`);

      if (loadedInfo) {
        return JSON.parse(loadedInfo);
      }
      this.saveColumnInfo(columnInfo);
      return columnInfo;
    }
    return;
  }

  saveColumnInfo(columnInfo: ColumnInfo[], saveName?: string): void {
    // Only save if a save name is passed in
    if (saveName) {
      if (!localStorage) {
        return;
      }

      localStorage.setItem(`${saveName}-columns`, JSON.stringify(columnInfo));
    }
  }
}

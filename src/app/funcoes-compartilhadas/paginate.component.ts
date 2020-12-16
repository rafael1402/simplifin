import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ModuleWithProviders,
} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: "rlar-pagination",
  template: `<ul
    *ngIf="pager.pages && pager.pages.length > 1"
    class="pagination"
  >
    <li
      [ngClass]="{ disabled: pager.currentPage === 1 }"
      class="page-item first-item"
    >
      <a (click)="setPage(1)" class="page-link"><i class="fa fa-angle-double-left" aria-hidden="true"></i></a>
    </li>
    <li
      [ngClass]="{ disabled: pager.currentPage === 1 }"
      class="page-item previous-item"
    >
      <a (click)="setPage(pager.currentPage - 1)" class="page-link"><i class="fa fa-angle-left" aria-hidden="true"></i></a>
    </li>
    <li
      *ngFor="let page of pager.pages"
      [ngClass]="{ active: pager.currentPage === page }"
      class="page-item number-item"
    >
      <a (click)="setPage(page)" class="page-link">{{ page }}</a>
    </li>
    <li
      [ngClass]="{ disabled: pager.currentPage === pager.totalPages }"
      class="page-item next-item"
    >
      <a (click)="setPage(pager.currentPage + 1)" class="page-link"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
    </li>
    <li
      [ngClass]="{ disabled: pager.currentPage === pager.totalPages }"
      class="page-item last-item"
    >
      <a (click)="setPage(pager.totalPages)" class="page-link"><i class="fa fa-angle-double-right" aria-hidden="true"></i></a>
    </li>
  </ul>`,
})
export class RlarPaginationComponent implements OnInit, OnChanges {
  @Input() items: Array<any>;
  @Output() changePage = new EventEmitter();
  @Input() initialPage = 1;
  @Input() pageSize = 10;
  @Input() maxPages = 10;
  @Input() totalItens = 10;
  @Input() serverSide: boolean = true;

  //static forRoot(config?: any): ModuleWithProviders<RlarPaginationComponent>;

  pager: any = {};

  ngOnInit() {
    // set page if items array isn't empty
    if (this.items && this.items.length) {
      this.setPage(this.initialPage);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset page if items array has changed
    if (
      (changes.totalItens &&
        changes.totalItens.currentValue !== changes.totalItens.previousValue) ||
      (changes.pageSize &&
        changes.pageSize.currentValue !== changes.pageSize.previousValue) ||
      (changes.items &&
        changes.items.currentValue !== changes.items.previousValue)
    ) {
      this.setPage(this.initialPage);
    }
  }

  setPage(page: number) {
    // get new pager object for specified page
    this.pager = this.paginate(
      this.serverSide ? this.totalItens : this.items.length,
      page,
      this.pageSize,
      this.maxPages
    );

    if (this.serverSide) {
      this.changePage.emit(this.pager.currentPage);
    } else {
      var pageOfItems = this.items.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.changePage.emit(pageOfItems);
    }
  }

  paginate(
    totalItems: number,
    currentPage: number = 1,
    pageSize: number = 10,
    maxPages: number = 10
  ) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= maxPages) {
      // total pages less than max so show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        startPage = totalPages - maxPages + 1;
        endPage = totalPages;
      } else {
        // current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }
}

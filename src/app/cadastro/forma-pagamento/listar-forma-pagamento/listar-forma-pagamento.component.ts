import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { FormaPagamento, FormaPagamentoSheet } from "../forma-pagamento-model";
import { FormaPagamentoService } from "../forma-pagamento.service";
import * as xlsx from "xlsx";
import { element } from "protractor";

@Component({
  templateUrl: "./listar-forma-pagamento.component.html",
})
export class ListarFormaPagamentoComponent implements OnInit, OnDestroy {
  constructor(private formaPagamentoService: FormaPagamentoService) {}

  /*Variaveis de tela*/
  isLoading = false;
  sortType: string;
  sortReverse: boolean = false;
  totalItens = 0;
  itensPerSize = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50, 100];
  nomeTela: string = "Formas de pagamento";

  private Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  headerTable: Array<any> = [
    {
      nome: "Descrição",
      value: "descricao",
      coluna: "A1",
    },
    {
      nome: "Status",
      value: "status",
      coluna: "B1",
    },
  ];

  /*Variaveis  de negocio*/
  formasPagamento: FormaPagamento[] = [];
  formasPagamentoFiltradas: FormaPagamento[] = [];
  formasPagamentoPaginadas: FormaPagamento[] = [];

  private formaPagamentoSubs: Subscription;

  sortTable(property) {
    this.sortType = property;
    this.sortReverse = !this.sortReverse;
    this.formasPagamentoPaginadas.sort(this.dynamicSort(property));
  }

  dynamicSort(property) {
    let sortOrder = -1;

    if (this.sortReverse) sortOrder = 1;

    return function (a, b) {
      let result =
        a[property].toString().toLowerCase() <
        b[property].toString().toLowerCase()
          ? -1
          : a[property].toString().toLowerCase() >
            b[property].toString().toLowerCase()
          ? 1
          : 0;

      return result * sortOrder;
    };
  }

  /*Quando a paginação for frontside*/
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.formasPagamentoPaginadas = pageOfItems;
  }

  filter(search: string) {
    this.formasPagamentoFiltradas = this.formasPagamento.filter((o) =>
      Object.keys(o).some((k) => {
        if (typeof o[k] === "string" && k != "id")
          return o[k].toLowerCase().includes(search.toLowerCase());
      })
    );
  }

  listaItens() {
    this.isLoading = true;
    this.formaPagamentoService.listarFormasPagamento(0, 0);
    this.formaPagamentoSubs = this.formaPagamentoService
      .getFormasPagamentoListener()
      .subscribe(
        (formasPagamentoRet: {
          formasPagamento: FormaPagamento[];
          count: number;
        }) => {
          this.formasPagamento = formasPagamentoRet.formasPagamento;
          this.totalItens = formasPagamentoRet.count;
          this.isLoading = false;
          this.formasPagamentoFiltradas = this.formasPagamento;
        }
      );
  }

  ngOnInit() {
    this.listaItens();
  }

  inativarItem(item: FormaPagamento) {
    this.isLoading = true;
    item.status = item.status == 1 ? 0 : 1;
    this.formaPagamentoService.atualizarFormaPagamento(item).subscribe(
      (retorno) => {
        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.listaItens();
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);

        this.Toast.fire({
          text:
            typeof error.error.mensagem === "undefined"
              ? error.message
              : error.error.mensagem,
          icon: error.status === "OK" ? "success" : "error",
        });
      }
    );
  }

  deleteItem(item: FormaPagamento) {
    Swal.fire({
      title: "Confirma exclusão ?",
      text: "Essa ação não pode ser revertida",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Excluir",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.formaPagamentoService.excluirFormaPagamento(item.id).subscribe(
          (retorno) => {
            this.Toast.fire({
              text: retorno.mensagem,
              icon: retorno.status === "OK" ? "success" : "error",
            });

            if (retorno.status === "OK") {
              this.listaItens();
            }
          },
          (error) => {
            this.isLoading = false;
            console.log(error);

            this.Toast.fire({
              text:
                typeof error.error.mensagem === "undefined"
                  ? error.message
                  : error.error.mensagem,
              icon: error.status === "OK" ? "success" : "error",
            });
          }
        );
      }
    });
  }

  exportToExcel() {
    let formaPagamentoSheet: FormaPagamentoSheet[] = [];

    this.formasPagamentoFiltradas.forEach((element) => {
      formaPagamentoSheet.push({
        descricao: element.descricao,
        status: element.status == 1 ? "Ativo" : "Inativo",
      });
    });

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(formaPagamentoSheet);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, this.nomeTela);
    let first_sheet_name = wb.SheetNames[0];
    let worksheet = wb.Sheets[first_sheet_name];

    this.headerTable.forEach((element) => {
      worksheet[element.coluna].v = element.nome;
    });

    xlsx.writeFile(wb, `${this.nomeTela}.xlsx`);
  }
  /*Quando a paginação for serverside*/
  /*onChangePage(currentPage: number ) {
    // update current page of items
    this.currentPage = currentPage;

    if (this.currentPage > 0) {
      //this.isLoading = true; //spinner
      this.formaPagamentoService.listarFormasPagamento(
        this.itensPerSize,
        this.currentPage
      );
    }
  }*/

  ngOnDestroy() {
    this.formaPagamentoSubs.unsubscribe();
  }
}

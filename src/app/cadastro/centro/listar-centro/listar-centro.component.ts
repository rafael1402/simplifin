import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Centro, CentroSheet } from "../centro-model";
import { CentroService } from "../centro.service";
import * as xlsx from "xlsx";


@Component({
  templateUrl: "./listar-centro.component.html",
})
export class ListarCentroComponent implements OnInit, OnDestroy {
  constructor(private centroService: CentroService) {}

  /*Variaveis de tela*/
  isLoading = false;
  sortType: string;
  sortReverse: boolean = false;
  totalItens = 0;
  itensPerSize = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50, 100];
  nomeTela: string = "Centros para rateio de despesa";

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
  centros: Centro[] = [];
  centrosFiltrados: Centro[] = [];
  centrosPaginados: Centro[] = [];

  private centroSubs: Subscription;

  sortTable(property) {
    this.sortType = property;
    this.sortReverse = !this.sortReverse;
    this.centrosPaginados.sort(this.dynamicSort(property));
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
    this.centrosPaginados = pageOfItems;
  }

  filter(search: string) {
    this.centrosFiltrados = this.centros.filter((o) =>
      Object.keys(o).some((k) => {
        if (typeof o[k] === "string" && k != "id")
          return o[k].toLowerCase().includes(search.toLowerCase());
      })
    );
  }

  listaItens() {
    this.isLoading = true;
    this.centroService.listarCentros(0, 0);
    this.centroSubs = this.centroService
      .getCentrosListener()
      .subscribe(
        (centrosRet: {
          centros: Centro[];
          count: number;
        }) => {
          this.centros = centrosRet.centros;
          this.totalItens = centrosRet.count;
          this.isLoading = false;
          this.centrosFiltrados = this.centros;
        }
      );
  }

  ngOnInit() {
    this.listaItens();
  }

  deleteItem(item: Centro) {
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
        this.centroService.excluirCentro(item.id).subscribe(
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

  inativarItem(item: Centro) {
    this.isLoading = true;
    item.status = item.status == 1 ? 0 : 1;
    this.centroService.atualizarCentro(item).subscribe(
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

  exportToExcel() {
    let centroSheet: CentroSheet[] = [];

    this.centrosFiltrados.forEach((element) => {
      centroSheet.push({
        descricao: element.descricao,
        status: element.status == 1 ? "Ativo" : "Inativo",
      });
    });

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(centroSheet);
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
      this.centroService.listarCentros(
        this.itensPerSize,
        this.currentPage
      );
    }
  }*/

  ngOnDestroy() {
    this.centroSubs.unsubscribe();
  }
}

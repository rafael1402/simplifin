import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Conta, ContaSheet, OpcaoConta } from "../conta-model";
import { ContaService } from "../conta.service";
import * as xlsx from "xlsx";

@Component({
  templateUrl: "./listar-conta.component.html",
})
export class ListarContaComponent implements OnInit, OnDestroy {
  constructor(private contaService: ContaService) {}

  /*Variaveis de tela*/
  isLoading = false;
  sortType: string;
  sortReverse: boolean = false;
  totalItens = 0;
  itensPerSize = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50, 100];
  nomeTela: string = "Contas";

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
      nome: "Tipo",
      value: "tipo",
      coluna: "A1",
    },
    {
      nome: "Descrição",
      value: "descricao",
      coluna: "B1",
    },
    {
      nome: "Status",
      value: "status",
      coluna: "C1",
    },
  ];

  /*Variaveis  de negocio*/
  contas: Conta[] = [];
  contasFiltradas: Conta[] = [];
  contasPaginadas: Conta[] = [];

  private contaSubs: Subscription;

  sortTable(property) {
    this.sortType = property;
    this.sortReverse = !this.sortReverse;
    this.contasPaginadas.sort(this.dynamicSort(property));
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
    this.contasPaginadas = pageOfItems;
  }

  filter(search: string) {
    this.contasFiltradas = this.contas.filter((o) =>
      Object.keys(o).some((k) => {
        if (typeof o[k] === "string" && k != "id")
          return o[k].toLowerCase().includes(search.toLowerCase());
      })
    );
  }

  listaItens() {
    this.isLoading = true;
    this.contaService.listarContas(0, 0);
    this.contaSubs = this.contaService
      .getContasListener()
      .subscribe((contasRet: { contas: Conta[]; count: number }) => {
        this.contas = contasRet.contas;
        this.totalItens = contasRet.count;
        this.isLoading = false;
        this.contasFiltradas = this.contas;
      });
  }

  ngOnInit() {
    this.listaItens();
  }

  deleteItem(item: Conta) {
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
        this.contaService.excluirConta(item.id).subscribe(
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

  inativarItem(item: Conta) {
    this.isLoading = true;
    item.status = item.status == 1 ? 0 : 1;
    this.contaService.atualizarConta(item).subscribe(
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
    let contaSheet: ContaSheet[] = [];

    let opcaoConta: OpcaoConta[] = this.contaService.getOpcaoConta();

    this.contasFiltradas.forEach((element) => {
      let contaTipo: OpcaoConta = opcaoConta.find((opcao) => {
        return opcao.tipo === element.tipo;
      });

      contaSheet.push({
        tipo: contaTipo.descricao,
        descricao: element.descricao,
        status: element.status == 1 ? "Ativo" : "Inativo",
      });
    });

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(contaSheet);
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
      this.contaService.listarContas(
        this.itensPerSize,
        this.currentPage
      );
    }
  }*/

  ngOnDestroy() {
    this.contaSubs.unsubscribe();
  }
}

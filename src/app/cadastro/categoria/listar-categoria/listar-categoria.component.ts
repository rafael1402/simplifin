import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Categoria, CategoriaSheet, OpcaoCategoria } from "../categoria-model";
import { CategoriaService } from "../categoria.service";
import * as xlsx from "xlsx";
import { element } from "protractor";

@Component({
  templateUrl: "./listar-categoria.component.html",
})
export class ListarCategoriaComponent implements OnInit, OnDestroy {
  constructor(private categoriaService: CategoriaService) {}

  /*Variaveis de tela*/
  isLoading = false;
  sortType: string;
  sortReverse: boolean = false;
  totalItens = 0;
  itensPerSize = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50, 100];
  nomeTela: string = "Categorias";

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
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  categoriasPaginadas: Categoria[] = [];
  opcaoCategoria: OpcaoCategoria[] = this.categoriaService.getOpcaoCategoria();

  busca: any = {
    valor: "",
    tipo: "",
  };

  private categoriaSubs: Subscription;

  sortTable(property) {
    this.sortType = property;
    this.sortReverse = !this.sortReverse;
    this.categoriasPaginadas.sort(this.dynamicSort(property));
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
    this.categoriasPaginadas = pageOfItems;
  }

  filter() {
    this.categoriasFiltradas = this.categorias.filter((o) =>
      Object.keys(o).some((k) => {
        if (typeof o[k] === "string" && k != "id")
          return o[k].toLowerCase().includes(this.busca.valor.toLowerCase());
      })
    );
    this.categoriasFiltradas = this.categoriasFiltradas.filter((o) => {
      return o.tipo == this.busca.tipo || this.busca.tipo === "";
    });
  }

  listaItens() {
    this.isLoading = true;
    this.categoriaService.listarCategorias(0, 0);
    this.categoriaSubs = this.categoriaService
      .getCategoriasListener()
      .subscribe(
        (categoriasRet: { categorias: Categoria[]; count: number }) => {
          this.categorias = categoriasRet.categorias;
          this.totalItens = categoriasRet.count;
          this.isLoading = false;
          this.categoriasFiltradas = this.categorias;
        }
      );
  }

  ngOnInit() {
    this.listaItens();
  }

  deleteItem(item: Categoria) {
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
        this.categoriaService.excluirCategoria(item.id).subscribe(
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

  inativarItem(item: Categoria) {
    this.isLoading = true;
    item.status = item.status == 1 ? 0 : 1;
    this.categoriaService.atualizarCategoria(item).subscribe(
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
    let categoriaSheet: CategoriaSheet[] = [];
    let opcaoCategoria: OpcaoCategoria[] = this.categoriaService.getOpcaoCategoria();

    this.categoriasFiltradas.forEach((element) => {
      categoriaSheet.push({
        tipo: opcaoCategoria.find((opcao) => opcao.tipo === element.tipo)
          .descricao,
        descricao: element.descricao,
        status: element.status == 1 ? "Ativo" : "Inativo",
      });
    });

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(categoriaSheet);
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
      this.categoriaService.listarCategorias(
        this.itensPerSize,
        this.currentPage
      );
    }
  }*/

  ngOnDestroy() {
    this.categoriaSubs.unsubscribe();
  }
}

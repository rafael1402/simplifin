import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Tag, TagCores } from "../tag-model";
import { TagService } from "../tag.service";

@Component({
  templateUrl: "./listar-tag.component.html",
})
export class ListarTagComponent implements OnInit, OnDestroy {
  constructor(private tagService: TagService) {}

  /*Variaveis de tela*/
  isLoading = false;
  sortType: string;
  sortReverse: boolean = false;
  totalItens = 0;
  itensPerSize = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50, 100];
  nomeTela: string = "Tags";

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

  /*Variaveis  de negocio*/
  tags: Tag[] = [];

  private tagSubs: Subscription;


  listaItens() {
    this.isLoading = true;
    this.tagService.listarTags(0, 0);
    this.tagSubs = this.tagService
      .getTagsListener()
      .subscribe((tagsRet: { tags: Tag[]; count: number }) => {
        this.tags = tagsRet.tags;
        this.totalItens = tagsRet.count;
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this.listaItens();
  }

  inativarItem(item: Tag) {
    this.isLoading = true;
    item.status = item.status == 1 ? 0 : 1;
    this.tagService.atualizarTag(item).subscribe(
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

  deleteItem(item: Tag) {
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
        this.tagService.excluirTag(item.id).subscribe(
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

  ngOnDestroy() {
    this.tagSubs.unsubscribe();
  }
}

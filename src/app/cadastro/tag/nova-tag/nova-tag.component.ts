import { Component, OnDestroy, OnInit } from "@angular/core";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Tag, TagCores } from "../tag-model";
import { TagService } from "../tag.service";

@Component({
  templateUrl: "./nova-tag.component.html",
})
export class NovaTagComponent implements OnInit {
  constructor(
    private tagService: TagService,
    public activeRouter: ActivatedRoute,
    public router: Router
  ) {}

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

  isLoading: boolean = false;
  edit: boolean = false;

  tag: Tag = {
    id: null,
    descricao: "",
    cor: "B40404",
    corTexto: "FFFFFF",
    status: 1,
  };

  tagCores: TagCores[] = this.tagService.getTagCores();

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.edit = true;
        let id = paramMap.get("id");
        this.isLoading = true;
        this.tagService.buscarTag(id).subscribe(
          (retorno) => {
            this.isLoading = false;
            this.tag = {
              id: retorno.tag.id,
              descricao: retorno.tag.descricao,
              cor: retorno.tag.cor,
              corTexto: retorno.tag.corTexto,
              status: retorno.tag.status,
            };
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
      } else {
        this.edit = false;
      }
    });
  }

  selecionaCor(cor: TagCores) {
    this.tag.cor = cor.cor;
    this.tag.corTexto = cor.corTexto;
  }

  manterTag(form) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.tagService.manterTag(this.tag, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["/cadastro/tag"]);
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
}

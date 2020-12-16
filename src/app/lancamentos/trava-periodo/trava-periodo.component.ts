import { Component, OnDestroy, OnInit } from "@angular/core";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { TravaPeriodo } from "./trava-periodo-model";
import { TravaPeriodoService } from "./trava-periodo.service";

import * as moment from "moment";
//import * as localization from 'moment/locale/pt-br';
moment.locale("pt-br");

@Component({
  templateUrl: "./trava-periodo.component.html",
})
export class TravaPeriodoComponent implements OnInit {
  constructor(
    private travaPeriodoService: TravaPeriodoService,
    public activeRouter: ActivatedRoute,
    public router: Router
  ) {}

  locale: any = {
    applyLabel: "Appliquer",
    customRangeLabel: " - ",
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek(),
  };

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

  travaPeriodo: TravaPeriodo;
  dtTravaPeriodo: { startDate: moment.Moment; endDate: moment.Moment };

  ngOnInit() {
    this.isLoading = true;
    this.travaPeriodoService.buscarTravaPeriodo().subscribe(
      (retorno) => {
        if (retorno.travaPeriodo) {
          this.travaPeriodo = retorno.travaPeriodo;
          this.dtTravaPeriodo = {
            startDate: moment(retorno.travaPeriodo.data),
            endDate: moment(retorno.travaPeriodo.data),
          };
        }
        else {
          this.travaPeriodo = {
            _id: null,
            data: null
          }

        }

        this.isLoading = false;
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

  manterTravaPeriodo() {
    this.isLoading = true;
    console.log(this.travaPeriodo);
    this.travaPeriodo.data = this.dtTravaPeriodo.startDate.toDate();
    this.travaPeriodo.data.setHours(0, 0, 0, 0);

    this.travaPeriodoService.atualizarTravaPeriodo(this.travaPeriodo).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });
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

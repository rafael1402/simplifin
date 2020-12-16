import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { UsuarioRoutingModule } from "./usuario-routing.module";
import { UtilModule } from "../funcoes-compartilhadas/util.module";
import { AlterarUsuarioComponent } from "./editar-usuario/editar-usuario.component";
import { editarSenhaComponent } from "./editar-senha/editar-senha.component";

@NgModule({
  imports: [CommonModule, FormsModule, UsuarioRoutingModule, UtilModule],
  declarations: [AlterarUsuarioComponent, editarSenhaComponent],
})
export class UsuarioModule {}

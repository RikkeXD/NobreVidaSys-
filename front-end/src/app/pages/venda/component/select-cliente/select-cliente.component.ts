import { Component, ChangeDetectionStrategy, input, inject, output } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ModalSelectClienteComponent } from '../modal-select-cliente/modal-select-cliente.component';
import { DividerModule } from 'primeng/divider';
import { Client } from '../../../../core/models/ClientModel';
import { MessageService } from 'primeng/api';
import {MatDividerModule} from '@angular/material/divider';


//Angualar Material
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-cliente',
  standalone: true,
  imports: [
    PanelModule,
    FieldsetModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    ModalSelectClienteComponent,
    DividerModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './select-cliente.component.html',
  styleUrl: './select-cliente.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectClienteComponent {
  showModal: boolean = false
  client!: Client | undefined
  clientEmit = output<Client | undefined>()
  empresaId = input<number>()

  private messageService = inject(MessageService)

  ngOnChanges() {
    if(this.empresaId()){
      this.client = undefined
      if(this.client === undefined){
        this.clientEmit.emit(this.client)
      }
    }
  }

  fecharModal() {
    this.showModal = false
  }

  abrirModal() {
    if(!this.empresaId()){
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Selecione uma empresa!"})
      return 
    }
    this.showModal = true
  }

  selectClient(client: Client){
    this.client = client
    this.clientEmit.emit(this.client)
    this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cliente selecionado com sucesso'})
  }


}

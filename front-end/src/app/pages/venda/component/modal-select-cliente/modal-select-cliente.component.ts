import { Component, input, ChangeDetectionStrategy, OnChanges, SimpleChange, output, EventEmitter, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Client } from '../../../../core/models/ClientModel';
import { ClientService } from '../../../../core/services/client.service';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-select-cliente',
  standalone: true,
  imports: [
    DialogModule, 
    TableModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
  ],
  templateUrl: './modal-select-cliente.component.html',
  styleUrl: './modal-select-cliente.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSelectClienteComponent implements OnChanges {
  visible: boolean = false;
  showModal = input(false)
  close = output<void>();
  clientEmit = output<Client>();

  clientes!: Client[];
  client!: Client
  empresaId = input<number>()

  private clientService = inject(ClientService)
  private messageService = inject(MessageService)

  ngOnChanges() {
    if (this.showModal() === true) {
      this.showDialog()
      this.searchClient()
    } else {
      this.closeDialog()
    }
  }

  searchClient(){
    this.clientService.listar(this.empresaId()!).subscribe({
        next: (res) => {
            this.clientes = res  
        },
        error: (error) => {
            this.clientes = []
            this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
        }
    })
}

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.close.emit();
  }

  onHide() {
    this.closeDialog()
  }

  selectClient(client: Client){
    this.clientEmit.emit(client)
    this.closeDialog()
  }



}

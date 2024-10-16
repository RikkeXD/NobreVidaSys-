import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { ProductSale } from '../../../../core/models/ProductModel';
import { Client } from '../../../../core/models/ClientModel';
import { Address } from '../../../../core/models/AddressModel';
import { Shipping } from '../../../../core/models/ShippingModel';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalSelectEnvioComponent } from '../modal-select-envio/modal-select-envio.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { PackingService } from '../../../../core/services/packing.service';
import { Packing, PackingSale } from '../../../../core/models/PackingModel';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-select-envio',
  standalone: true,
  imports: [
    PanelModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    ModalSelectEnvioComponent,
    InputTextModule,
    FloatLabelModule,
    KeyFilterModule,
    InputNumberModule,
    ReactiveFormsModule
  ],
  templateUrl: './select-envio.component.html',
  styleUrl: './select-envio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectEnvioComponent {
  showModal: boolean = false
  totalPesoProdutos = input<number>()
  clienteId = input<number>()
  empresaId = input<number>()
  listaEnvios: Shipping[] = []
  listaEmbalagem!: Packing[]
  envioEmit = output<PackingSale>()

  private messageService = inject(MessageService)
  private embalagemService = inject(PackingService)
  private formBulderService = inject(FormBuilder)

  ngOnInit() {
    if (this.empresaId()) {
      this.carregarListaEmbalagem()
    }

    this.listaEnvios = [
      {
        nome: 'Pex',
        vlr_envio: null,
        cod_rastreio: null
      },
      {
        nome: 'Pex - Sedex',
        vlr_envio: null,
        cod_rastreio: null
      },
      {
        nome: 'Pex - Pac',
        vlr_envio: null,
        cod_rastreio: null
      },
      {
        nome: 'Correios',
        vlr_envio: null,
        cod_rastreio: null
      },
      {
        nome: 'Motoboy',
        vlr_envio: null,
        cod_rastreio: null
      },
      {
        nome: 'Retirada',
        vlr_envio: null,
        cod_rastreio: null
      },
    ]

    this.form.valueChanges.subscribe(a => {
      this.emitirEnvio()
    })
  }
  ngOnChanges() {
    this.form.reset()
    if (this.empresaId()) {
      this.carregarListaEmbalagem()
    }
  }

  protected form = this.formBulderService.group({
    nome: ["", Validators.required],
    embalagem_id: [0, Validators.required],
    vlr_envio: [null as number | null],
    cod_rastreio: '',
  })

  fecharModal() {
    this.showModal = false
  }

  emitirEnvio() {
    if (this.form.valid) {
      const envio: PackingSale = {
        nome: this.form.value.nome!,
        embalagem_id: this.form.value.embalagem_id!,
        vlr_envio: this.form.value.vlr_envio!,
        cod_rastreio: this.form.value.cod_rastreio!
      }
      this.envioEmit.emit(envio)
    }
    return
  }

  atualizarEnvio(infoEnvio: Shipping){
    this.form.patchValue({
      nome: infoEnvio.nome,
      vlr_envio: infoEnvio.vlr_envio,
    })
    this.emitirEnvio()
  }
  carregarListaEmbalagem() {
    this.embalagemService.listar(this.empresaId()!).subscribe({
      next: (data) => {
        this.listaEmbalagem = data
      },
      error: (error) => {
        this.listaEmbalagem = []
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao carregar lista de embalagem'})
        console.error('Error ao carregar lista de embalagem', error)
      }
    })
  }

  verificarPeso() {
    if (this.totalPesoProdutos()! > 0 && this.empresaId()! > 0 && this.clienteId()! > 0) {
      return true
    }
    this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
    this.form.patchValue({
      nome: null
    })
    return false
  }

  abrirModal() {
    this.form.patchValue({
      vlr_envio: null
    })
    if (this.form.value.nome === 'Pex' || this.form.value.nome === 'Pex - Sedex' || this.form.value.nome === 'Pex - Pac' && this.verificarPeso()) {
      this.showModal = true
      return
    }
    return
  }
}

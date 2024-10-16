import { Component, inject, output } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import { Payment } from '../../../../core/models/PaymentModel';
import { PagamentoService } from '../../../../core/services/pagamento.service';

@Component({
  selector: 'app-select-forma-pagamento',
  standalone: true,
  imports: [
    PanelModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './select-forma-pagamento.component.html',
  styleUrl: './select-forma-pagamento.component.scss'
})
export class SelectFormaPagamentoComponent {

  pagamentos: Payment[] | undefined
  selectedPagamento!: Payment
  parcelas: any[] = []
  pagamentoEmit = output<Omit<Payment,'nome'>>()

  private pagamentoService = inject(PagamentoService)
  private formBuilderService = inject(FormBuilder)

  protected form = this.formBuilderService.group({
    id: [0, Validators.required],
    qntd_parcela: [0, Validators.required],
  })

  ngOnInit() {
    this.parcelas = Array.from({length: 12},(_,index) => ({
      label: `${index + 1}x`,
      value: index + 1
    }))

    this.pagamentoService.listar().subscribe(pagamentos => {
      this.pagamentos = pagamentos.map(pagamento => ({
        id: pagamento.id,
        nome: pagamento.nome,
        qntd_parcela: null
      }))
    })
    this.form.valueChanges.subscribe(selectedPagamento => {
      const selectPagamento: Omit<Payment,'nome'> = {
        id: this.form.value.id!,
        qntd_parcela:(this.form.value.id === 1 || this.form.value.id === 2) ? this.form.value.qntd_parcela! : 1,
      }
      this.pagamentoEmit.emit(selectPagamento)
    })

  }

}

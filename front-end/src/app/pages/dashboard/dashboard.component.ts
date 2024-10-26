import { Component, inject, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DashboardService } from '../../core/services/dashboard.service';
import { Dashboard } from '../../core/models/Dashboard';
import ptBR from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { UsuarioService } from '../../core/services/usuario.service';
import { EmpresasLista, UsuarioEmpresas } from '../../core/models/EnterpriseModel';

registerLocaleData(ptBR);

interface ResumoVenda {
  pedidosEmTransito: number;
  quantidadePedidos: number;
  quantidadeProdutosVendidos: number;
  valorTotalVendas: number;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartModule,
    CommonModule,
    DropdownModule,
    CalendarModule,
    FormsModule,
    CardModule,
    TableModule,
    TooltipModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class DashboardComponent {
  empresas!: EmpresasLista[]
  selectedEmpresa!: EmpresasLista

  basicData: any;
  data: any;
  basicOptions: any;
  options: any;
  startDate!: Date;
  endDate!: Date;
  vendasMensais: any
  vendasDiarias: any
  qtdVendasDiaria: any
  ticketMedioDiario: any
  resumoVendas: ResumoVenda = {
    pedidosEmTransito: 0,
    quantidadePedidos: 0,
    quantidadeProdutosVendidos: 0,
    valorTotalVendas: 0
  }

  //Options
  vendasMensaisOptions: any
  vendasDiariasOptions: any
  qtdVendasDiariaOptions: any
  ticketMedioDiarioOptions: any
  defaultScales: any

  private dashboardService = inject(DashboardService)
  private primeNGConfig = inject(PrimeNGConfig)
  private usuarioService = inject(UsuarioService)

  ngOnInit() {
    this.dataPadrao()

    this.usuarioService.listarEmpresa().subscribe((response: UsuarioEmpresas) => {
      const { empresas, empresaPrincipalId } = response;

      this.empresas = empresas.map((empresa) => ({
        name: empresa.razao_social,
        code: empresa.id,
      }));

      if (empresaPrincipalId) {
        this.selectedEmpresa = this.empresas.find(
          (empresa) => empresa.code === empresaPrincipalId
        )!;

      } else {
        this.selectedEmpresa = this.empresas[0];
      }
      this.buscarData()
    });

    this.primeNGConfig.setTranslation({
      accept: 'Aceitar',
      reject: 'Cancelar',
      dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sem',
      firstDayOfWeek: 0
    });


    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Vendas Mensais 
    this.vendasMensais = {
      labels: [],
      datasets: [
        {
          label: 'Vendas (R$)',
          data: [],
          backgroundColor: ['rgba(255, 87, 34, 0.8)', 'rgba(244, 67, 54, 0.8)', 'rgba(255, 193, 7, 0.8)', 'rgba(255, 152, 0, 0.8)'],
          borderColor: ['rgb(255, 87, 34)', 'rgb(244, 67, 54)', 'rgb(255, 193, 7)', 'rgb(255, 152, 0)'],
          borderWidth: 3
        }
      ]
    };

    this.vendasMensaisOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { position: 'top', labels: { color: textColor } },
        tooltip: { mode: 'nearest', intersect: true }
      }
    };

    // Vendas Diárias 
    this.vendasDiarias = {
      labels: [],
      datasets: [
        {
          label: 'Vendas (R$)',
          data: [],
          backgroundColor: ['rgba(41, 121, 255, 0.85)', 'rgba(0, 150, 136, 0.85)', 'rgba(3, 169, 244, 0.85)', 'rgba(0, 188, 212, 0.85)'],
          borderColor: ['rgb(41, 121, 255)', 'rgb(0, 150, 136)', 'rgb(3, 169, 244)', 'rgb(0, 188, 212)'],
          borderWidth: 3
        }
      ]
    };

    this.vendasDiariasOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor } },
        tooltip: { mode: 'index', intersect: false }
      }
    };

    // Quantidade de Vendas Diárias
    this.qtdVendasDiaria = {
      labels: [],
      datasets: [
        {
          label: 'Quantidade de Vendas',
          data: [],
          backgroundColor: ['rgba(186, 104, 200, 0.9)', 'rgba(255, 87, 34, 0.9)', 'rgba(100, 221, 23, 0.9)', 'rgba(255, 214, 0, 0.9)'],
          borderColor: ['rgb(186, 104, 200)', 'rgb(255, 87, 34)', 'rgb(100, 221, 23)', 'rgb(255, 214, 0)'],
          borderWidth: 3
        }
      ]
    };

    this.qtdVendasDiariaOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { display: true, labels: { color: textColor } },
        tooltip: { mode: 'nearest', intersect: false }
      }
    };

    // Ticket Médio Diário
    this.ticketMedioDiario = {
      labels: [],
      datasets: [
        {
          label: 'Ticket Médio (R$)',
          data: [],
          backgroundColor: ['rgba(102, 16, 242, 0.85)', 'rgba(232, 62, 140, 0.85)', 'rgba(253, 126, 20, 0.85)', 'rgba(32, 201, 151, 0.85)'],
          borderColor: ['rgb(102, 16, 242)', 'rgb(232, 62, 140)', 'rgb(253, 126, 20)', 'rgb(32, 201, 151)'],
          borderWidth: 3
        }
      ]
    };

    this.ticketMedioDiarioOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { position: 'top', labels: { color: textColor } },
        tooltip: { mode: 'index', intersect: true }
      }
    };

    // Configuração Padrão das Escalas
    this.defaultScales = {
      x: {
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder, drawBorder: false }
      },
      y: {
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder, drawBorder: false }
      }
    };

    // Aplicação das Escalas a Cada Gráfico
    this.vendasMensaisOptions.scales = this.defaultScales;
    this.vendasDiariasOptions.scales = this.defaultScales;
    this.qtdVendasDiariaOptions.scales = this.defaultScales;
    this.ticketMedioDiarioOptions.scales = this.defaultScales;
  }

  dataPadrao() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.endDate = today;
  }

  buscarData() {
    const filter: Dashboard = {
      empresa_id: this.selectedEmpresa.code,
      dataInicial: this.startDate,
      dataFinal: this.endDate,
    }
    this.dashboardService.buscar(filter).subscribe({
      next: (data: any) => {
        if (data && data.vendasMensais) {
          this.vendasMensais.labels = data.vendasMensais.labels;
          this.vendasMensais.datasets[0].data = data.vendasMensais.data;
          this.vendasMensais = { ...this.vendasMensais };
        }

        if (data && data.vendasDiarias) {
          this.vendasDiarias.labels = data.vendasDiarias.labels;
          this.vendasDiarias.datasets[0].data = data.vendasDiarias.data;
          this.vendasDiarias = { ...this.vendasDiarias };
        }

        if (data && data.qtdVendasDiarias) {
          this.qtdVendasDiaria.labels = data.qtdVendasDiarias.labels;
          this.qtdVendasDiaria.datasets[0].data = data.qtdVendasDiarias.data;
          this.qtdVendasDiaria = { ...this.qtdVendasDiaria };
        }
        if (data && data.ticketMedioDiario) {
          this.ticketMedioDiario.labels = data.ticketMedioDiario.labels;
          this.ticketMedioDiario.datasets[0].data = data.ticketMedioDiario.data;
          this.ticketMedioDiario = { ...this.ticketMedioDiario };
        }

        if (data && data.resumoVendas) {
          this.resumoVendas = data.resumoVendas;
        }

      },
      error: (error) => {
        console.error(error)
      }
    })
  }

}

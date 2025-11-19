import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToXLSX = (comissoesFiltradas, fileName) => {

    if (!comissoesFiltradas || comissoesFiltradas.length === 0) {
        console.error("Nenhum dado para exportar.");
        return;
    }

    let totalComissaoGeral = 0;
    
    const dadosParaPlanilha = comissoesFiltradas.map(record => {
        
        const nomeCliente = record.cliente;
        const nomeVendedor = record.vendedor || record.nome;
        
        const dataFormatada = record.dataPagamento ? record.dataPagamento.substr(0, 10).split('-').reverse().join('/') : '';
        
        const valorComissao = record.valorComissaoFinal || record.valorComissao || 0;
        
        totalComissaoGeral += valorComissao;
        
        return {
            'Data Reserva': dataFormatada,
            'ID Reserva': record.idReserva,
            'Cliente': nomeCliente,
            'Valor Reserva': `R$ ${record.valorTotalReserva.toFixed(2).replace(".", ",")}`,
            'Valor Pago': `R$ ${record.valorTotalPago.toFixed(2).replace(".", ",")}`,
            'Custo Total': `R$ ${record.custoTotalReserva.toFixed(2).replace(".", ",")}`,
            'Porcentagem': `${record.porcentagemComissao || 0}%`,
            'Vendedor': nomeVendedor,
            'Comissão Final (R$)': `R$ ${valorComissao.toFixed(2).replace(".", ",")}`,
        };
    });

    const linhaTotal = {
        'Data Reserva': '',
        'ID Reserva': '',
        'Cliente': '',
        'Valor Reserva': '',
        'Valor Pago': '',
        'Custo Total': '',
        'Porcentagem': '',
        'Vendedor': 'TOTAL GERAL:',
        'Comissão Final (R$)': totalComissaoGeral,
    };

    dadosParaPlanilha.push(linhaTotal);

    const worksheet = XLSX.utils.json_to_sheet(dadosParaPlanilha);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comissões");
    
    const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, fileName);
};
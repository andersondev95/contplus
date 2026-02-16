import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Product } from "@/types/product";
import { format, parseISO, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function exportEstoquePDF(products: Product[]) {
  const doc = new jsPDF();
  const now = new Date();

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Cont+", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Relatório de Estoque — ${format(now, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 14, 27);

  // Summary
  const totalProdutos = products.length;
  const totalLotes = products.reduce((s, p) => s + p.lotes.length, 0);
  const totalItens = products.reduce((s, p) => s + p.lotes.reduce((ls, l) => ls + l.quantidade, 0), 0);
  const vencidos = products.reduce(
    (s, p) => s + p.lotes.filter((l) => isBefore(parseISO(l.validade), now)).length,
    0
  );
  const proximoVencer = products.reduce(
    (s, p) =>
      s +
      p.lotes.filter((l) => {
        const d = parseISO(l.validade);
        return !isBefore(d, now) && isBefore(d, addDays(now, 30));
      }).length,
    0
  );

  doc.setFontSize(11);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo", 14, 36);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Produtos: ${totalProdutos}  |  Lotes: ${totalLotes}  |  Total de itens: ${totalItens}  |  Vencidos: ${vencidos}  |  Próximos a vencer: ${proximoVencer}`, 14, 42);

  // Table
  const rows: (string | number)[][] = [];
  products.forEach((p) => {
    p.lotes.forEach((l, i) => {
      const validadeDate = parseISO(l.validade);
      const expired = isBefore(validadeDate, now);
      const expiringSoon = !expired && isBefore(validadeDate, addDays(now, 30));
      const status = expired ? "VENCIDO" : expiringSoon ? "PRÓXIMO" : "OK";

      rows.push([
        i === 0 ? p.nome : "",
        i === 0 ? p.codigoId : "",
        i === 0 ? p.unidade : "",
        format(validadeDate, "dd/MM/yyyy", { locale: ptBR }),
        l.quantidade,
        status,
      ]);
    });

    // Total row per product
    if (p.lotes.length > 1) {
      const total = p.lotes.reduce((s, l) => s + l.quantidade, 0);
      rows.push(["", "", "", "Total", total, ""]);
    }
  });

  autoTable(doc, {
    startY: 48,
    head: [["Produto", "Código", "Unidade", "Validade", "Qtd", "Status"]],
    body: rows,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 45 },
      4: { halign: "right" },
    },
    didParseCell: (data) => {
      if (data.section === "body") {
        const status = data.row.raw?.[5];
        if (data.column.index === 5) {
          if (status === "VENCIDO") data.cell.styles.textColor = [220, 38, 38];
          if (status === "PRÓXIMO") data.cell.styles.textColor = [217, 119, 6];
          if (status === "OK") data.cell.styles.textColor = [22, 163, 74];
        }
        // Style total rows
        if (data.row.raw?.[3] === "Total") {
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Cont+ — Página ${i} de ${pageCount}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`estoque-cont-plus-${format(now, "yyyy-MM-dd")}.pdf`);
}

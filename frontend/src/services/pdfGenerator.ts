import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { StockMovement, DailySummary, WeeklySummary, StockAlert } from '../types/movements';
import { Product } from '../types';

// Company header for all PDFs
const addCompanyHeader = (doc: jsPDF, title: string) => {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('VIRUNGA - Chocolat du Kivu', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Product Service Management', 105, 28, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, 40, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 48, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(20, 52, 190, 52);
};

// Daily Entry Report
export const generateDailyEntryReport = (summary: DailySummary): void => {
    const doc = new jsPDF();
    addCompanyHeader(doc, `Daily Entry Report - ${format(new Date(summary.date), 'dd/MM/yyyy')}`);

    // Summary stats
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Entries: ${summary.entries.length}`, 20, 72);
    doc.text(`Total Quantity: ${summary.totalEntriesQuantity} units`, 20, 79);

    // Table
    if (summary.entries.length > 0) {
        autoTable(doc, {
            startY: 90,
            head: [['Time', 'Product', 'Quantity', 'Supplier', 'Reference', 'Reason']],
            body: summary.entries.map(entry => [
                format(new Date(entry.date), 'HH:mm'),
                entry.productName,
                entry.quantity.toString(),
                entry.supplier || '-',
                entry.reference || '-',
                entry.reason || '-'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [46, 24, 16], textColor: [212, 175, 55] },
            styles: { fontSize: 9 },
        });
    } else {
        doc.text('No entries recorded for this day.', 20, 95);
    }

    doc.save(`daily_entry_report_${summary.date}.pdf`);
};

// Daily Exit Report
export const generateDailyExitReport = (summary: DailySummary): void => {
    const doc = new jsPDF();
    addCompanyHeader(doc, `Daily Exit Report - ${format(new Date(summary.date), 'dd/MM/yyyy')}`);

    // Summary stats
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Exits: ${summary.exits.length}`, 20, 72);
    doc.text(`Total Quantity: ${summary.totalExitsQuantity} units`, 20, 79);

    // Table
    if (summary.exits.length > 0) {
        autoTable(doc, {
            startY: 90,
            head: [['Time', 'Product', 'Quantity', 'Receiver', 'Purpose']],
            body: summary.exits.map(exit => [
                format(new Date(exit.date), 'HH:mm'),
                exit.productName,
                exit.quantity.toString(),
                exit.receiver || exit.user || '-',
                exit.purpose || '-'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [46, 24, 16], textColor: [212, 175, 55] },
            styles: { fontSize: 9 },
        });
    } else {
        doc.text('No exits recorded for this day.', 20, 95);
    }

    doc.save(`daily_exit_report_${summary.date}.pdf`);
};

// Weekly Stock Report
export const generateWeeklyStockReport = (summary: WeeklySummary): void => {
    const doc = new jsPDF();
    addCompanyHeader(doc, `Weekly Stock Report - ${format(new Date(summary.weekStart), 'dd/MM')} to ${format(new Date(summary.weekEnd), 'dd/MM/yyyy')}`);

    // Summary stats
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Summary', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Entries: ${summary.entries.length}`, 20, 72);
    doc.text(`Total Exits: ${summary.exits.length}`, 20, 79);
    doc.text(`Net Change: ${summary.entries.reduce((sum, e) => sum + e.quantity, 0) - summary.exits.reduce((sum, e) => sum + e.quantity, 0)} units`, 20, 86);

    // Daily breakdown table
    doc.setFont('helvetica', 'bold');
    doc.text('Daily Breakdown', 20, 100);

    autoTable(doc, {
        startY: 105,
        head: [['Date', 'Entries', 'Exits', 'Entry Qty', 'Exit Qty', 'Net']],
        body: summary.dailyBreakdown.map(day => [
            format(new Date(day.date), 'EEE dd/MM'),
            day.entriesCount.toString(),
            day.exitsCount.toString(),
            day.entriesQuantity.toString(),
            day.exitsQuantity.toString(),
            (day.entriesQuantity - day.exitsQuantity).toString()
        ]),
        theme: 'grid',
        headStyles: { fillColor: [46, 24, 16], textColor: [212, 175, 55] },
        styles: { fontSize: 9 },
    });

    doc.save(`weekly_stock_report_${summary.weekStart}.pdf`);
};

// Movement History Report
export const generateMovementHistoryReport = (movements: StockMovement[], filter: string = ''): void => {
    const doc = new jsPDF();
    addCompanyHeader(doc, 'Stock Movement History');

    if (filter) {
        doc.setFontSize(10);
        doc.text(`Filter: ${filter}`, 20, 60);
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Movements: ${movements.length}`, 20, filter ? 68 : 65);

    if (movements.length > 0) {
        autoTable(doc, {
            startY: filter ? 75 : 72,
            head: [['Date', 'Type', 'Product', 'Quantity', 'User/Receiver', 'Notes']],
            body: movements.map(m => [
                format(new Date(m.date), 'dd/MM/yyyy HH:mm'),
                m.type === 'ENTREE' ? 'IN' : 'OUT',
                m.productName,
                m.quantity.toString(),
                m.receiver || m.user || m.supplier || '-',
                m.reason || m.purpose || m.reference || '-'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [46, 24, 16], textColor: [212, 175, 55] },
            styles: { fontSize: 8 },
            rowPageBreak: 'auto',
        });
    } else {
        doc.text('No movements found.', 20, 80);
    }

    doc.save(`movement_history_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
};

// Low Stock Alert Report
export const generateLowStockReport = (alerts: StockAlert[]): void => {
    const doc = new jsPDF();
    addCompanyHeader(doc, 'Low Stock Alert Report');

    // Group by severity
    const outOfStock = alerts.filter(a => a.severity === 'OUT_OF_STOCK');
    const critical = alerts.filter(a => a.severity === 'CRITICAL');
    const low = alerts.filter(a => a.severity === 'LOW');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Alert Summary', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 38, 38);
    doc.text(`Out of Stock: ${outOfStock.length}`, 20, 72);
    doc.setTextColor(251, 146, 60);
    doc.text(`Critical Low: ${critical.length}`, 20, 79);
    doc.setTextColor(234, 179, 8);
    doc.text(`Low Stock: ${low.length}`, 20, 86);
    doc.setTextColor(0, 0, 0);

    if (alerts.length > 0) {
        autoTable(doc, {
            startY: 95,
            head: [['Severity', 'Product', 'Current Qty', 'Threshold', 'Status']],
            body: alerts.map(alert => [
                alert.severity.replace('_', ' '),
                alert.product.name,
                alert.product.quantity.toString(),
                alert.product.stockAlertThreshold.toString(),
                alert.severity === 'OUT_OF_STOCK' ? 'URGENT' :
                    (alert.severity === 'CRITICAL' ? 'CRITICAL' : 'REORDER SOON')
            ]),
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
            styles: { fontSize: 9 },
            didParseCell: function (data) {
                if (data.row.section === 'body' && data.column.index === 0) {
                    if (data.cell.raw === 'OUT OF STOCK') {
                        data.cell.styles.textColor = [220, 38, 38];
                        data.cell.styles.fontStyle = 'bold';
                    } else if (data.cell.raw === 'CRITICAL') {
                        data.cell.styles.textColor = [251, 146, 60];
                        data.cell.styles.fontStyle = 'bold';
                    } else if (data.cell.raw === 'LOW') {
                        data.cell.styles.textColor = [234, 179, 8];
                    }
                }
            }
        });
    } else {
        doc.setTextColor(16, 185, 129);
        doc.text('✓ All products are adequately stocked!', 20, 100);
    }

    doc.save(`low_stock_report_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

// Full Stock Inventory Report
export const generateInventoryReport = (products: Product[]): void => {
    const doc = new jsPDF();
    addCompanyHeader(doc, 'Complete Inventory Report');

    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockCount = products.filter(p => p.quantity <= (p.stockAlertThreshold || 10)).length;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventory Summary', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Products: ${totalProducts}`, 20, 72);
    doc.text(`Total Units: ${totalQuantity}`, 20, 79);
    doc.text(`Low Stock Items: ${lowStockCount}`, 20, 86);

    autoTable(doc, {
        startY: 95,
        head: [['Product Name', 'Type', 'Quantity', 'Threshold', 'Status']],
        body: products.map(p => [
            p.name,
            p.typeProduct,
            p.quantity.toString(),
            (p.stockAlertThreshold || 10).toString(),
            p.quantity === 0 ? 'OUT' :
                (p.quantity <= (p.stockAlertThreshold || 10) ? 'LOW' : 'OK')
        ]),
        theme: 'grid',
        headStyles: { fillColor: [46, 24, 16], textColor: [212, 175, 55] },
        styles: { fontSize: 9 },
        rowPageBreak: 'auto',
        didParseCell: function (data) {
            if (data.row.section === 'body' && data.column.index === 4) {
                if (data.cell.raw === 'OUT') {
                    data.cell.styles.textColor = [220, 38, 38];
                    data.cell.styles.fontStyle = 'bold';
                } else if (data.cell.raw === 'LOW') {
                    data.cell.styles.textColor = [234, 179, 8];
                } else {
                    data.cell.styles.textColor = [16, 185, 129];
                }
            }
        }
    });

    doc.save(`inventory_report_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

// Low Stock Inventory Report - with remaining stock details
export const generateLowStockInventoryReport = (products: Product[]): void => {
    const doc = new jsPDF();
    addCompanyHeader(doc, 'Low Stock Inventory Report');

    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const outOfStockCount = products.filter(p => p.quantity === 0).length;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Low Stock Summary', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Low Stock Items: ${totalProducts}`, 20, 72);
    doc.text(`Total Remaining Units: ${totalQuantity}`, 20, 79);
    doc.text(`Out of Stock Items: ${outOfStockCount}`, 20, 86);

    if (products.length > 0) {
        autoTable(doc, {
            startY: 95,
            head: [['Product Name', 'Type', 'Current Stock', 'Threshold', 'Units Remaining', 'Status']],
            body: products.map(p => [
                p.name,
                p.typeProduct,
                p.quantity.toString(),
                (p.stockAlertThreshold || 10).toString(),
                (p.quantity - (p.stockAlertThreshold || 10)).toString(),
                p.quantity === 0 ? 'OUT OF STOCK' :
                    (p.quantity < (p.stockAlertThreshold || 10) ? 'CRITICAL' : 'LOW')
            ]),
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
            styles: { fontSize: 9 },
            rowPageBreak: 'auto',
            didParseCell: function (data) {
                if (data.row.section === 'body' && data.column.index === 5) {
                    if (data.cell.raw === 'OUT OF STOCK') {
                        data.cell.styles.textColor = [220, 38, 38];
                        data.cell.styles.fontStyle = 'bold';
                    } else if (data.cell.raw === 'CRITICAL') {
                        data.cell.styles.textColor = [251, 146, 60];
                        data.cell.styles.fontStyle = 'bold';
                    } else if (data.cell.raw === 'LOW') {
                        data.cell.styles.textColor = [234, 179, 8];
                    }
                }
            }
        });
    } else {
        doc.setTextColor(16, 185, 129);
        doc.text('✓ All products are adequately stocked!', 20, 100);
    }

    doc.save(`low_stock_inventory_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

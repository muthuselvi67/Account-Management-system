import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { X, Download, Info, IndianRupee, Minus, Plus, Percent, Users, FileText, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { LOGO_BASE64 } from '../utils/logoBase64';

/* ── Inline editable cell ── */
function EC({ value, onChange, align = 'left', bold = false, size = '0.92rem', color = '#1e293b' }) {
  const [editing, setEditing] = useState(false);
  const base = { fontWeight: bold ? 700 : 400, fontSize: size, color, fontFamily: 'inherit' };
  return editing ? (
    <input
      autoFocus
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={e => e.key === 'Enter' && setEditing(false)}
      style={{
        ...base, textAlign: align,
        border: '1.5px solid #7c3aed', borderRadius: 4,
        padding: '1px 5px', outline: 'none',
        background: '#faf5ff', width: '100%', minWidth: 40,
      }}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        ...base, display: 'inline-block', minWidth: 20,
        cursor: 'text', textDecoration: 'underline dashed #c4b5fd', textUnderlineOffset: '3px'
      }}
    >
      {value || <span style={{ color: '#c4b5fd', fontSize: '0.75em' }}>—</span>}
    </span>
  );
}

const iconMap = {
  IndianRupee: <IndianRupee size={14} color="#fff" />,
  Minus: <Minus size={14} color="#fff" />,
  Plus: <Plus size={14} color="#fff" />,
  Percent: <Percent size={14} color="#fff" />,
  Users: <Users size={14} color="#fff" />,
  FileText: <FileText size={14} color="#fff" />,
  PieChart: <PieChart size={14} color="#fff" />,
  TrendingUp: <TrendingUp size={14} color="#fff" />,
  Calendar: <Calendar size={14} color="#fff" />,
};

export default function UniversalReportModal({ config, onClose }) {
  const [report, setReport] = useState(config.initialState);

  const update = (key) => (val) => setReport(prev => ({ ...prev, [key]: val }));

  const parseNum = (str) => Number(String(str).replace(/[^0-9.-]+/g, '')) || 0;
  const v1 = parseNum(report.leg1);
  const v2 = parseNum(report.leg2);
  const v3 = parseNum(report.leg3);
  const v4 = parseNum(report.leg4);
  const v5 = parseNum(report.leg5);
  const totalLeg = v1 + v2 + v3 + v4 + v5 || 1;
  const p1 = (v1 / totalLeg) * 100;
  const p2 = p1 + (v2 / totalLeg) * 100;
  const p3 = p2 + (v3 / totalLeg) * 100;
  const p4 = p3 + (v4 / totalLeg) * 100;
  const donutGradient = `conic-gradient(#7c3aed 0% ${p1}%, #3b82f6 ${p1}% ${p2}%, #22c55e ${p2}% ${p3}%, #f97316 ${p3}% ${p4}%, #94a3b8 ${p4}% 100%)`;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    const addText = (text, x, y, size = 10, isBold = false, align = "left", color = [0, 0, 0], baseline = "alphabetic") => {
      doc.setFontSize(size);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(String(text), x, y, { align, baseline });
    };

    const primary = [124, 58, 237]; 
    const textDark = [15, 23, 42];
    const textLight = [100, 116, 139];
    const green = [34, 197, 94];

    // Logo Lockup
    try { doc.addImage(LOGO_BASE64, 'PNG', 15, 10, 40, 10.66); } catch(e){}

    // Title vertically centered with logo
    addText(`${config.title.toUpperCase()} REPORT`, 195, 15.33, 13, true, "right", textDark, "middle");
    
    // Elegant full-width separator line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 26, 195, 26);

    // Report Details Box
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 32, 180, 56, 2, 2, "S");

    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.roundedRect(20, 37, 8, 8, 2, 2, "F");
    addText("i", 24, 42.5, 10, true, "center", [255, 255, 255]); 
    addText("Report Details", 32, 41, 12, true, "left", textDark, "middle");

    doc.roundedRect(20, 48, 50, 12, 1, 1, "S");
    addText("Generated On", 32, 53, 7, false, "left", textLight);
    addText(report.generatedOn, 32, 57, 8, true, "left", textDark);

    doc.roundedRect(75, 48, 50, 12, 1, 1, "S");
    addText("Report Type", 87, 53, 7, false, "left", textLight);
    addText(config.title, 87, 57, 8, true, "left", textDark);

    doc.setFillColor(245, 243, 255); 
    doc.roundedRect(130, 48, 60, 12, 1, 1, "FD");
    addText("Reporting Period", 142, 53, 7, true, "left", primary);
    addText(report.period, 142, 57, 8, true, "left", textDark);

    addText(config.description, 20, 68, 8, false, "left", textDark);

    doc.setFillColor(250, 245, 255);
    doc.roundedRect(20, 74, 170, 10, 1, 1, "F");
    addText("Note: This is an automatically generated system report. Actual data tables and charts are dynamically rendered", 25, 79, 8, true, "left", primary);
    addText("in the full enterprise version.", 33, 83, 8, false, "left", textDark);

    // Metrics
    const metrics = config.metrics.map(m => ({
      label: m.label,
      value: (m.prefix || '') + report[m.valKey] + (m.suffix || ''),
      change: report[m.chgKey],
      color: m.color,
      icon: m.pdfIcon
    }));

    let cardX = 15;
    const cardW = 41.25;
    metrics.forEach((m) => {
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cardX, 92, cardW, 30, 2, 2, "S");
      doc.setFillColor(m.color[0], m.color[1], m.color[2]);
      doc.circle(cardX + 9, 100, 4, "F");
      addText(m.icon, cardX + 9, 100, 9, true, "center", [255, 255, 255], "middle");
      addText(m.label, cardX + 5, 109, 7, true, "left", textLight);
      addText(m.value, cardX + 5, 115, 11, true, "left", textDark);
      addText(m.change, cardX + 5, 120, 7, true, "left", green);
      addText("vs Last Period", cardX + 17, 120, 7, false, "left", textLight);
      cardX += cardW + 5;
    });

    // Charts Area
    doc.roundedRect(15, 126, 87.5, 62, 2, 2, "S");
    addText(config.charts.barTitle, 20, 132, 9, true, "left", textDark);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(25, 178, 95, 178); 
    doc.line(25, 138, 25, 178); 
    
    [0, 20, 40, 60, 80, 100, 120, 140].reverse().forEach((val, i) => {
        addText(String(val), 23, 138 + (i * 5.7), 6, false, "right", textLight);
    });
    
    const barData = config.charts.barData || [
      { rev: 70, exp: 40, lbl: 'Jan' }, { rev: 85, exp: 50, lbl: 'Feb' },
      { rev: 95, exp: 55, lbl: 'Mar' }, { rev: 100, exp: 60, lbl: 'Apr' },
      { rev: 110, exp: 65, lbl: 'May' }, { rev: 115, exp: 68, lbl: 'Jun' },
      { rev: 125, exp: 75, lbl: 'Jul' }
    ];
    let barX = 28;
    barData.forEach(d => {
       const revH = (d.rev / 140) * 40;
       const expH = (d.exp / 140) * 40;
       doc.setFillColor(124, 58, 237);
       doc.rect(barX, 178 - revH, 3, revH, "F");
       doc.setFillColor(196, 181, 253);
       doc.rect(barX + 3.5, 178 - expH, 3, expH, "F");
       addText(d.lbl, barX + 3.5, 182, 6, false, "center", textLight);
       barX += 9.5;
    });

    // Donut chart mock
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(107.5, 126, 87.5, 62, 2, 2, "S");
    addText(config.charts.donutTitle, 112.5, 132, 9, true, "left", textDark);
    
    doc.setFillColor(124, 58, 237);
    doc.circle(135, 157, 16, "F");
    doc.setFillColor(255, 255, 255);
    doc.circle(135, 157, 8, "F"); 
    
    const legends = [
        { label: report.leg1Lbl, val: (config.charts.legPrefix || '') + report.leg1, c: [124, 58, 237], icon: "O" },
        { label: report.leg2Lbl, val: (config.charts.legPrefix || '') + report.leg2, c: [59, 130, 246], icon: "M" },
        { label: report.leg3Lbl, val: (config.charts.legPrefix || '') + report.leg3, c: [34, 197, 94], icon: "E" },
        { label: report.leg4Lbl, val: (config.charts.legPrefix || '') + report.leg4, c: [249, 115, 22], icon: "A" },
        { label: report.leg5Lbl, val: (config.charts.legPrefix || '') + report.leg5, c: [148, 163, 184], icon: "O" }
    ];
    let legY = 140;
    legends.forEach(l => {
        doc.setFillColor(l.c[0], l.c[1], l.c[2]);
        doc.roundedRect(160, legY, 4, 4, 1, 1, "F");
        addText(l.icon, 162, legY + 2, 4.5, true, "center", [255, 255, 255], "middle");
        addText(l.label, 166, legY + 3, 7, false, "left", textDark);
        addText(l.val, 166, legY + 7, 7, true, "left", textDark);
        legY += 9.5;
    });

    // Summary Table
    addText(config.table.title || "Summary Overview", 20, 198, 9, true, "left", textDark);

    doc.setFillColor(124, 58, 237);
    doc.rect(15, 202, 180, 8, "F");
    addText("Particulars", 20, 207, 8, true, "left", [255, 255, 255]);
    addText("Current Period", 75, 207, 8, true, "right", [255, 255, 255]);
    addText("Previous Period", 115, 207, 8, true, "right", [255, 255, 255]);
    addText("Change", 155, 207, 8, true, "right", [255, 255, 255]);
    addText("Change (%)", 190, 207, 8, true, "right", [255, 255, 255]);

    let tY = 215;
    config.table.rows.forEach((r, i) => {
        if(i % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, tY - 5, 180, 8, "F");
        }
        addText(r.p, 20, tY, 8, false, "left", textDark);
        addText(report[r.kc], 75, tY, 8, false, "right", textDark);
        addText(report[r.kp], 115, tY, 8, false, "right", textDark);
        addText(report[r.kd], 155, tY, 8, false, "right", textDark);
        addText(report[r.kdp], 190, tY, 8, true, "right", green);
        tY += 8;
    });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 192, 180, 70, 2, 2, "S");

    // Signature Footer
    let sy = 275;
    addText('Approved:', 15, sy, 9, true, 'left', textDark);
    
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('Signature', 40, sy + 1);
    doc.setFont('helvetica', 'normal');
    
    sy += 6;
    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.3);
    doc.line(15, sy, 80, sy);
    sy += 4.5;
    addText('Date: ', 15, sy, 8, false, 'left', [100, 116, 139]);
    if (report.approvedDate) addText(report.approvedDate, 25, sy, 8, false, 'left', [100, 116, 139]);

    doc.save(`${config.title.replace(/\s+/g, '_')}_Report.pdf`);
  };

  const donutLegends = [
    { lblK: 'leg1Lbl', k: 'leg1', bg: '#7c3aed', i: 'O' },
    { lblK: 'leg2Lbl', k: 'leg2', bg: '#3b82f6', i: 'M' },
    { lblK: 'leg3Lbl', k: 'leg3', bg: '#22c55e', i: 'E' },
    { lblK: 'leg4Lbl', k: 'leg4', bg: '#f97316', i: 'A' },
    { lblK: 'leg5Lbl', k: 'leg5', bg: '#94a3b8', i: 'O' },
  ];

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(15,10,40,0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="animate-scale-in" style={{
        background: '#fff', borderRadius: 12, width: '100%', maxWidth: 840,
        maxHeight: '96vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(80,40,180,0.28)',
      }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '12px 20px', borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, zIndex: 10, background: '#fff'
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDownloadPDF} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fff', color: '#6d28d9',
              border: '1.5px solid #6d28d9', borderRadius: 8, padding: '6px 14px',
              fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
            }}>
              <Download size={16} /> Download PDF
            </button>
            <button onClick={onClose} style={{
              background: '#f1f5f9', border: 'none', borderRadius: 8,
              padding: '6px 10px', cursor: 'pointer', color: '#64748b',
            }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: '30px 40px', fontFamily: 'Arial, sans-serif' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <img src={LOGO_BASE64} alt="Learnlike Logo" style={{ height: 36, objectFit: 'contain' }} />
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {config.title.toUpperCase()} REPORT
            </h1>
          </div>
          <div style={{ position: 'relative', marginBottom: 24, marginTop: 10 }}>
            <div style={{ height: 1, background: '#e2e8f0', width: '100%' }} />
          </div>

          {/* Info Box */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, background: '#7c3aed', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={16} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Report Details</h2>
            </div>
            
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 14px' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: 4 }}>Generated On</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  <EC value={report.generatedOn} onChange={update('generatedOn')} />
                </div>
              </div>
              <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 14px' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: 4 }}>Report Type</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{config.title}</div>
              </div>
              <div style={{ flex: 1, background: '#f5f3ff', borderRadius: 6, padding: '10px 14px' }}>
                <div style={{ fontSize: '0.65rem', color: '#7c3aed', fontWeight: 700, marginBottom: 4 }}>Reporting Period</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  <EC value={report.period} onChange={update('period')} />
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#334155', margin: '0 0 12px 0' }}>
              {config.description}
            </p>
            <div style={{ background: '#faf5ff', borderRadius: 6, padding: '10px 14px' }}>
              <p style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600, margin: 0 }}>
                Note: This is an automatically generated system report. Actual data tables and charts are dynamically rendered<br />
                <span style={{ color: '#0f172a', fontWeight: 400 }}>in the full enterprise version.</span>
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
            {config.metrics.map((m, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px' }}>
                <div style={{ width: 28, height: 28, background: `rgb(${m.color[0]}, ${m.color[1]}, ${m.color[2]})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  {iconMap[m.icon]}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  {m.prefix || ''}<EC value={report[m.valKey]} onChange={update(m.valKey)} bold />{m.suffix || ''}
                </div>
                <div style={{ fontSize: '0.7rem', display: 'flex', gap: 6 }}>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}><EC value={report[m.chgKey]} onChange={update(m.chgKey)} color="#22c55e" bold /></span>
                  <span style={{ color: '#64748b' }}>vs Last Period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            
            {/* HTML Mock of Bar Chart to match PDF */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>{config.charts.barTitle}</h3>
              <div style={{ display: 'flex', height: '180px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: 10, fontSize: '0.6rem', color: '#64748b', textAlign: 'right', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid transparent' }}>
                  <span>140</span><span>120</span><span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span style={{ position: 'relative', top: 5 }}>0</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingLeft: 10, borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                  {(config.charts.barData || [
                    { rev: 70, exp: 40, lbl: 'Jan' }, { rev: 85, exp: 50, lbl: 'Feb' },
                    { rev: 95, exp: 55, lbl: 'Mar' }, { rev: 100, exp: 60, lbl: 'Apr' },
                    { rev: 110, exp: 65, lbl: 'May' }, { rev: 115, exp: 68, lbl: 'Jun' },
                    { rev: 125, exp: 75, lbl: 'Jul' }
                  ]).map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: 2, height: '100%', alignItems: 'flex-end' }}>
                      <div style={{ width: 10, height: `${(d.rev || d.r)/140*100}%`, background: '#7c3aed' }} />
                      <div style={{ width: 10, height: `${(d.exp || d.e)/140*100}%`, background: '#c4b5fd' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editable Legends Donut Chart Mock */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>{config.charts.donutTitle}</h3>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: donutGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff' }} />
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {donutLegends.map(l => (
                    <div key={l.k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, background: l.bg, color: '#fff', fontSize: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{l.i}</div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#0f172a' }}>
                          <EC value={report[l.lblK]} onChange={update(l.lblK)} size="0.65rem" />
                        </div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0f172a' }}>
                          {config.charts.legPrefix || ''}<EC value={report[l.k]} onChange={update(l.k)} size="0.65rem" bold />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Summary Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0' }}>{config.table.title || 'Summary Overview'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', background: '#7c3aed', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '8px 12px', borderRadius: 6 }}>
              <div>Particulars</div>
              <div style={{ textAlign: 'right' }}>Current Period</div>
              <div style={{ textAlign: 'right' }}>Previous Period</div>
              <div style={{ textAlign: 'right' }}>Change</div>
              <div style={{ textAlign: 'right' }}>Change (%)</div>
            </div>
            {config.table.rows.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', fontSize: '0.75rem', padding: '10px 12px', background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                <div style={{ color: '#0f172a' }}>{row.p}</div>
                <div style={{ textAlign: 'right' }}><EC value={report[row.kc]} onChange={update(row.kc)} align="right" size="0.75rem" /></div>
                <div style={{ textAlign: 'right' }}><EC value={report[row.kp]} onChange={update(row.kp)} align="right" size="0.75rem" /></div>
                <div style={{ textAlign: 'right' }}><EC value={report[row.kd]} onChange={update(row.kd)} align="right" size="0.75rem" /></div>
                <div style={{ textAlign: 'right' }}><EC value={report[row.kdp]} onChange={update(row.kdp)} align="right" size="0.75rem" color="#22c55e" bold /></div>
              </div>
            ))}
          </div>

          {/* Signature Footer */}
          <div style={{ marginTop: 32, padding: '0 10px', width: '40%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.85rem' }}>
                Approved:
              </div>
              <div style={{ 
                color: '#94a3b8', fontSize: '1.2rem', fontFamily: 'cursive', 
                transform: 'rotate(-5deg)', userSelect: 'none',
              }}>
                Signature
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', marginBottom: 8 }} />
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
              Date: <EC value={report.approvedDate} onChange={update('approvedDate')} size="0.82rem" color="#1e3a8a" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

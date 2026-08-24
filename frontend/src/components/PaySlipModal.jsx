import { useState } from 'react';
import {
  X, Download, Edit3, User, Mail, Briefcase, Building2,
  Calendar, CreditCard, Fingerprint, Landmark, Clock,
  Umbrella, UserCheck, Wallet, ShieldAlert, Star,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
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
        background: '#faf5ff', width: '100%',
      }}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        ...base, display: 'inline-block', minWidth: 20,
        cursor: 'text', borderBottom: '1px dashed #c4b5fd',
        padding: '0 2px',
      }}
    >
      {value || <span style={{ color: '#c4b5fd', fontSize: '0.75em' }}>—</span>}
    </span>
  );
}

/* ── Icon chip ── */
function IconChip({ icon: Icon, color = '#6d28d9', bg = '#ede9fe' }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={16} color={color} />
    </div>
  );
}

/* ── Info card cell ── */
function InfoCell({ icon, label, valueKey, slip, update, bold = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px' }}>
      <IconChip icon={icon} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: 2 }}>{label}</div>
        <EC value={slip[valueKey]} onChange={update(valueKey)} bold={bold} size="0.88rem" />
      </div>
    </div>
  );
}

/* ── Stat card (right column) ── */
function StatCell({ icon, label, valueKey, slip, update }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', borderBottom: '1px solid #f1f5f9',
    }}>
      <IconChip icon={icon} />
      <div>
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: 2 }}>{label}</div>
        <EC value={slip[valueKey]} onChange={update(valueKey)} bold size="1.05rem" />
      </div>
    </div>
  );
}

/* ── Number helpers ── */
const pn = (v) => v ? parseInt(v.toString().replace(/[^0-9]/g, '')) || 0 : 0;
const fc = (n) => '₹ ' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

/* ── Number to words ── */
function numToWords(num) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (!num) return 'Zero';
  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
  str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
  str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
  str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
  str += n[5] != 0 ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() + ' Only';
}

/* ═══════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════ */
export default function PaySlipModal({ salary, onClose }) {
  const rawBase = pn(salary.base);
  const rawBonus = pn(salary.bonus);
  const rawDed = pn(salary.ded);

  const basic = Math.floor(rawBase * 0.7);
  const hra = rawBase - basic;
  const conveyance = rawBonus > 2000 ? 2000 : 0;
  const medicalAllow = 1000;
  const leaveReimb = 2000;
  const leaveDeductions = rawDed > 0 ? rawDed : 2000;

  const [slip, setSlip] = useState({
    employee: salary.trainer || 'Employee Name',
    empNo: salary.id ? salary.id.replace('SAL', 'EMP') : 'EMP-001',
    email: 'employee@learnlike.co.in',
    organisation: 'LearnLike Technologies India LLP',
    aadhar: '0000 0000 0000',
    paymentMethod: 'Direct',
    accountNo: 'XXXX XXXX 5678',
    position: 'Software Engineer',
    department: 'Technical',
    payMonth: salary.month || 'Jul 2026',
    totalDays: '29',
    workingDays: '25',
    holidays: '4',
    daysPresent: '22.0',
    basic: String(basic),
    hra: String(hra),
    conveyance: String(conveyance),
    otherAllowances: '0',
    medicalAllow: String(medicalAllow),
    leaveReimb: String(leaveReimb),
    leaveDeductions: String(leaveDeductions),
    advanceDeductions: '0',
    otherDeductions: '0',
    incomeTax: '0',
    professionTax: '208',
    deductions: '0',
    remarksRow1: '–',
    remarksRow2: '–',
    remarksRow3: '–',
    remarksRow4: '–',
    remarksRow5: 'November 2025',
    remarksRow6: '–',
    printedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    sigDate: '',
    approvedDate: '07/12/2023',
  });

  const update = (key) => (val) => setSlip(prev => ({ ...prev, [key]: val }));

  const totalEarnings = ['basic', 'hra', 'conveyance', 'otherAllowances', 'medicalAllow', 'leaveReimb'].reduce((s, k) => s + pn(slip[k]), 0);
  const totalDeductions = ['leaveDeductions', 'advanceDeductions', 'otherDeductions', 'incomeTax', 'professionTax', 'deductions'].reduce((s, k) => s + pn(slip[k]), 0);
  const netPay = totalEarnings - totalDeductions;

  /* ── PDF Export ── */
  const handleDownloadPDF = () => {
    // Set custom height to 205mm to fit the content exactly without extra bottom blank space
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, 205] });
    const purple = [109, 40, 217], navy = [30, 58, 138], dark = [15, 23, 42], grey = [100, 116, 139];
    const addText = (t, x, y, sz = 9, bold = false, align = 'left', col = dark) => {
      doc.setFontSize(sz); doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(col[0], col[1], col[2]); doc.text(String(t), x, y, { align });
    };
    const fmtC = (v) => 'Rs. ' + Number(pn(v)).toLocaleString('en-IN', { minimumFractionDigits: 2 });
    try { doc.addImage(LOGO_BASE64, 'PNG', 14, 10, 40, 12); } catch (e) { }
    addText('Pay-slip', 105, 18, 18, true, 'center', dark);
    const companyName = JSON.parse(localStorage.getItem('learnlike_company_profile') || '{}').name || 'LearnLike • TDELVE • Deskjobs • Lanternet';
    addText(companyName, 105, 23, 8, true, 'center', grey);
    doc.setDrawColor(purple[0], purple[1], purple[2]); doc.setLineWidth(0.5); doc.line(14, 26, 196, 26);
    let y = 34;

    // Adjusted coordinates for better spacing in PDF
    const lx = 14, lv = 38, mx = 80, mv = 108, rx = 148;
    addText('Employee:', lx, y, 8.5, true, 'left', navy); addText(slip.employee, lv, y, 8.5, false, 'left', dark);
    addText('Employee No.:', mx, y, 8.5, true, 'left', navy); addText(slip.empNo, mv, y, 8.5, false, 'left', dark);
    addText('Total No. of Days', rx, y, 8, true, 'left', navy); addText(slip.totalDays, 196, y, 8.5, false, 'right', dark);
    y += 7; addText('Email:', lx, y, 8.5, true, 'left', navy); addText(slip.email, lv, y, 8.5, false, 'left', dark);
    addText('Organisation:', mx, y, 8.5, true, 'left', navy); addText(slip.organisation, mv, y, 7.5, false, 'left', dark);
    addText('No. of Working Days', rx, y, 8, true, 'left', navy); addText(slip.workingDays, 196, y, 8.5, false, 'right', dark);
    y += 7; addText('Aadhar Number :', mx, y, 8.5, true, 'left', navy); addText(slip.aadhar, mv, y, 8.5, false, 'left', dark);
    addText('No. of Holidays', rx, y, 8, true, 'left', navy); addText(slip.holidays, 196, y, 8.5, false, 'right', dark);
    y += 7; addText('Position Held:', lx, y, 8.5, true, 'left', navy); addText(slip.position, lv, y, 8.5, false, 'left', dark);
    addText('Payment Method:', mx, y, 8.5, true, 'left', navy); addText(slip.paymentMethod, mv, y, 8.5, false, 'left', dark);
    y += 7; addText('Department:', lx, y, 8.5, true, 'left', navy); addText(slip.department, lv, y, 8.5, false, 'left', dark);
    addText('Account Number:', mx, y, 8.5, true, 'left', navy); addText(slip.accountNo, mv, y, 8.5, false, 'left', dark);
    addText('No. of Days Present', rx, y - 3, 8, true, 'left', navy); addText(slip.daysPresent, 196, y - 3, 8.5, false, 'right', dark);
    y += 7; addText('Pay-slip Month:', lx, y, 8.5, true, 'left', navy); addText(slip.payMonth, lv, y, 8.5, false, 'left', dark);
    y += 5; doc.setDrawColor(navy[0], navy[1], navy[2]); doc.setLineWidth(0.3); doc.line(14, y, 196, y);

    const tTop = y, lp = [239, 246, 255]; // Lighter blue for headers
    doc.setFillColor(lp[0], lp[1], lp[2]); doc.rect(14, tTop, 182, 8, 'F');
    // Adjusted table column coordinates
    const cols = { sno: 14, earn: 24, earnAmt: 80, ded: 100, dedAmt: 154, remarks: 172 };
    y = tTop + 5.5;
    addText('S.No.', cols.sno, y, 7.5, true, 'left', navy); addText('EARNINGS', cols.earn, y, 7.5, true, 'left', navy);
    addText('AMOUNT (Rs.)', cols.earnAmt, y, 7.5, true, 'center', navy); addText('DEDUCTIONS', cols.ded, y, 7.5, true, 'left', [225, 29, 72]);
    addText('AMOUNT (Rs.)', cols.dedAmt, y, 7.5, true, 'center', [225, 29, 72]); addText('REMARKS', cols.remarks, y, 7.5, true, 'left', navy);

    const rows = [
      { sno: 1, earn: 'Basic', ek: 'basic', ded: 'Leave Deductions', dk: 'leaveDeductions', rk: 'remarksRow1' },
      { sno: 2, earn: 'House Rent Allowance', ek: 'hra', ded: 'Advance Deductions', dk: 'advanceDeductions', rk: 'remarksRow2' },
      { sno: 3, earn: 'Conveyance', ek: 'conveyance', ded: 'Other Deductions', dk: 'otherDeductions', rk: 'remarksRow3' },
      { sno: 4, earn: 'Other Allowances', ek: 'otherAllowances', ded: 'Income tax', dk: 'incomeTax', rk: 'remarksRow4' },
      { sno: 5, earn: 'Medical Allowance', ek: 'medicalAllow', ded: 'Profession Tax', dk: 'professionTax', rk: 'remarksRow5' },
      { sno: 6, earn: 'Leave Reimbursements', ek: 'leaveReimb', ded: 'Deductions', dk: 'deductions', rk: 'remarksRow6' },
    ];
    rows.forEach((row, i) => {
      y = tTop + 10 + i * 7;
      if (i % 2 === 1) { doc.setFillColor(248, 247, 255); doc.rect(14, y - 3, 182, 7, 'F'); }
      addText(String(row.sno), cols.sno + 2, y + 1, 8, false, 'left', dark);
      addText(row.earn, cols.earn, y + 1, 8, false, 'left', dark);
      addText(pn(slip[row.ek]).toLocaleString('en-IN'), cols.earnAmt, y + 1, 8, false, 'center', dark);
      addText(row.ded, cols.ded, y + 1, 8, false, 'left', dark);
      addText(fmtC(slip[row.dk]), cols.dedAmt, y + 1, 8, false, 'center', dark);
      addText(slip[row.rk] || '–', cols.remarks, y + 1, 7, false, 'left', grey);
    });
    y = tTop + 10 + rows.length * 7 + 4;
    doc.setLineWidth(0.5); doc.setDrawColor(navy[0], navy[1], navy[2]); doc.line(14, y, 196, y);
    y += 6;
    addText('Total Earnings:', 14, y, 9, true, 'left', [5, 150, 105]);
    addText('Rs. ' + totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 45, y, 9.5, true, 'left', [5, 150, 105]);
    addText('Total Deductions:', 85, y, 9, true, 'left', [220, 38, 127]);
    addText('Rs. ' + totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 118, y, 9.5, true, 'left', [220, 38, 127]);
    addText('Net Pay:', 155, y, 9, true, 'left', purple);
    addText('Rs. ' + netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 196, y, 10, true, 'right', purple);
    y += 10;
    addText('Total in Words: ' + numToWords(netPay), 14, y, 8, false, 'left', grey);
    addText('Printed On: ' + slip.printedOn, 196, y, 8, false, 'right', grey);

    // Signature Block
    y += 18;
    addText('Employee Signature:', 14, y, 8.5, true, 'left', [100, 116, 139]);
    addText('Approved:', 100, y, 8.5, true, 'left', [100, 116, 139]);

    // Signature placeholder graphic (cursive text)
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('Signature', 130, y);
    doc.setFont('helvetica', 'normal'); // reset font

    y += 6;
    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.3);
    doc.line(14, y, 90, y);
    doc.line(100, y, 196, y);
    y += 4.5;
    addText('Date: ', 14, y, 8, false, 'left', [100, 116, 139]);
    if (slip.sigDate) addText(slip.sigDate, 24, y, 8, false, 'left', [100, 116, 139]);

    addText('Date: ', 100, y, 8, false, 'left', [100, 116, 139]);
    if (slip.approvedDate) addText(slip.approvedDate, 110, y, 8, false, 'left', [100, 116, 139]);

    doc.save('payslip_' + slip.employee.replace(/\s+/g, '_') + '_' + slip.payMonth.replace(/\s+/g, '') + '.pdf');
  };

  const rows = [
    { sno: 1, earn: 'Basic', ek: 'basic', ded: 'Leave Deductions', dk: 'leaveDeductions', rk: 'remarksRow1' },
    { sno: 2, earn: 'House Rent Allowance', ek: 'hra', ded: 'Advance Deductions', dk: 'advanceDeductions', rk: 'remarksRow2' },
    { sno: 3, earn: 'Conveyance', ek: 'conveyance', ded: 'Other Deductions', dk: 'otherDeductions', rk: 'remarksRow3' },
    { sno: 4, earn: 'Other Allowances', ek: 'otherAllowances', ded: 'Income tax', dk: 'incomeTax', rk: 'remarksRow4' },
    { sno: 5, earn: 'Medical Allowance', ek: 'medicalAllow', ded: 'Profession Tax', dk: 'professionTax', rk: 'remarksRow5' },
    { sno: 6, earn: 'Leave Reimbursements', ek: 'leaveReimb', ded: 'Deductions', dk: 'deductions', rk: 'remarksRow6' },
  ];

  /* ── shared table cell style ── */
  const td = (extra = {}) => ({
    padding: '10px 14px', fontSize: '0.82rem', color: '#1e293b',
    borderBottom: '1px solid #f1f5f9', ...extra,
  });

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(15,10,40,0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '12px',
    }}>
      <div className="animate-scale-in" style={{
        background: '#f8fafc',
        borderRadius: 20,
        width: '100%', maxWidth: 880,
        maxHeight: '96vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(80,40,180,0.28)',
      }}>

        {/* ── HEADER CARD ── */}
        <div style={{
          background: '#fff', borderRadius: '20px 20px 0 0',
          padding: '18px 24px 0 24px',
          boxShadow: '0 2px 12px rgba(80,40,180,0.08)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 }}>
            {/* Logo + tagline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
              <img src={LOGO_BASE64} alt="Learnlike" style={{ height: 50, objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.4 }}>
                  Empowering Learners, Building Futures
                </p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', marginTop: 2 }}>
                  {JSON.parse(localStorage.getItem('learnlike_company_profile') || '{}').name || 'LearnLike • TDELVE • Deskjobs • Lanternet'}
                </p>
              </div>
            </div>
            {/* Decorated title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 36, height: 1.5, background: 'linear-gradient(to right,transparent,#6d28d9)' }} />
                <span style={{ color: '#6d28d9', fontSize: '0.85rem' }}>♦</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', letterSpacing: 1, whiteSpace: 'nowrap' }}>
                Pay-slip
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#6d28d9', fontSize: '0.85rem' }}>♦</span>
                <div style={{ width: 36, height: 1.5, background: 'linear-gradient(to left,transparent,#6d28d9)' }} />
              </div>
            </div>
            {/* Download + Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 220, justifyContent: 'flex-end' }}>
              <button onClick={handleDownloadPDF} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: '#fff', color: '#6d28d9',
                border: '1.5px solid #6d28d9', borderRadius: 10,
                padding: '8px 18px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#faf5ff'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <Download size={15} /> Download PDF
              </button>
              <button onClick={onClose} style={{
                background: '#f1f5f9', border: 'none', borderRadius: 8,
                padding: '8px 10px', cursor: 'pointer', color: '#64748b',
                display: 'flex', alignItems: 'center',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {/* gradient underline */}
          <div style={{
            height: 2.5,
            background: 'linear-gradient(to right,#6d28d9,#818cf8,#6d28d9)',
            marginLeft: -24, marginRight: -24,
          }} />
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '20px 20px 28px' }}>

          {/* "Click any field to edit" hint */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 14 }}>
            <Edit3 size={11} color="#a78bfa" />
            <span style={{ fontSize: '0.68rem', color: '#a78bfa', fontWeight: 600 }}>Click any field to edit</span>
          </div>

          {/* ── EMPLOYEE INFO GRID ── */}
          <div style={{
            background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb',
            marginBottom: 18, overflow: 'hidden',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 220px' }}>
              {/* Col 1 */}
              <div style={{ borderRight: '1px solid #f1f5f9' }}>
                <InfoCell icon={User} label="Employee" valueKey="employee" slip={slip} update={update} />
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
                <InfoCell icon={Mail} label="Organisation Email" valueKey="email" slip={slip} update={update} />
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
                <InfoCell icon={Briefcase} label="Position Held" valueKey="position" slip={slip} update={update} />
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
                <InfoCell icon={Building2} label="Department" valueKey="department" slip={slip} update={update} />
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
                <InfoCell icon={Calendar} label="Pay-slip Month" valueKey="payMonth" slip={slip} update={update} />
              </div>
              {/* Col 2 */}
              <div style={{ borderRight: '1px solid #f1f5f9' }}>
                <InfoCell icon={CreditCard} label="Employee No." valueKey="empNo" slip={slip} update={update} />
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
                <InfoCell icon={Building2} label="Organisation" valueKey="organisation" slip={slip} update={update} />
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
                <InfoCell icon={Fingerprint} label="Aadhar Number" valueKey="aadhar" slip={slip} update={update} />
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
                <InfoCell icon={CreditCard} label="Payment Method" valueKey="paymentMethod" slip={slip} update={update} />
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
                <InfoCell icon={Landmark} label="Account Number" valueKey="accountNo" slip={slip} update={update} />
              </div>
              {/* Col 3 – Stats */}
              <div>
                <StatCell icon={Calendar} label="Total No. of Days" valueKey="totalDays" slip={slip} update={update} />
                <StatCell icon={Clock} label="No. of Working Days" valueKey="workingDays" slip={slip} update={update} />
                <StatCell icon={Umbrella} label="No. of Holidays" valueKey="holidays" slip={slip} update={update} />
                <StatCell icon={UserCheck} label="No. of Days Present" valueKey="daysPresent" slip={slip} update={update} />
              </div>
            </div>
          </div>

          {/* ── EARNINGS & DEDUCTIONS TABLE ── */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 18 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f4ff' }}>
                  <th style={{ ...td({ fontWeight: 700, color: '#1e3a8a', fontSize: '0.75rem', width: '6%', textAlign: 'center', letterSpacing: 0.5 }) }}>S.No.</th>
                  <th style={{ ...td({ fontWeight: 700, color: '#1e3a8a', fontSize: '0.75rem', width: '22%', letterSpacing: 0.5 }) }}>EARNINGS</th>
                  <th style={{ ...td({ fontWeight: 700, color: '#1e3a8a', fontSize: '0.75rem', width: '13%', textAlign: 'right', letterSpacing: 0.5 }) }}>AMOUNT (₹)</th>
                  <th style={{ ...td({ fontWeight: 700, color: '#e11d48', fontSize: '0.75rem', width: '22%', letterSpacing: 0.5 }) }}>DEDUCTIONS</th>
                  <th style={{ ...td({ fontWeight: 700, color: '#e11d48', fontSize: '0.75rem', width: '13%', textAlign: 'right', letterSpacing: 0.5 }) }}>AMOUNT (₹)</th>
                  <th style={{ ...td({ fontWeight: 700, color: '#1e3a8a', fontSize: '0.75rem', width: '24%', textAlign: 'center', letterSpacing: 0.5 }) }}>REMARKS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 1 ? '#fafbff' : '#fff' }}>
                    <td style={{ ...td({ textAlign: 'center', color: '#64748b' }) }}>{row.sno}</td>
                    <td style={td()}>{row.earn}</td>
                    <td style={{ ...td({ textAlign: 'right', fontWeight: 500 }) }}>
                      <EC value={slip[row.ek]} onChange={update(row.ek)} align="right" size="0.82rem" />
                    </td>
                    <td style={td()}>{row.ded}</td>
                    <td style={{ ...td({ textAlign: 'right', color: pn(slip[row.dk]) > 0 ? '#e11d48' : '#64748b' }) }}>
                      {pn(slip[row.dk]) > 0
                        ? '₹ ' + pn(slip[row.dk]).toLocaleString('en-IN', { minimumFractionDigits: 2 })
                        : '₹ 0.00'}
                    </td>
                    <td style={{ ...td({ textAlign: 'center', color: '#94a3b8' }) }}>
                      <EC value={slip[row.rk]} onChange={update(row.rk)} align="center" color="#94a3b8" size="0.8rem" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── SUMMARY ROW ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 14, marginBottom: 14,
          }}>
            {/* Total Earnings */}
            <div style={{
              background: '#fff', border: '1px solid #d1fae5',
              borderRadius: 14, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wallet size={20} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', letterSpacing: 1, marginBottom: 4 }}>TOTAL EARNINGS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                  ₹ {totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            {/* Total Deductions */}
            <div style={{
              background: '#fff', border: '1px solid #fecdd3',
              borderRadius: 14, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldAlert size={20} color="#e11d48" />
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e11d48', letterSpacing: 1, marginBottom: 4 }}>TOTAL DEDUCTIONS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e11d48' }}>
                  ₹ {totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            {/* Net Pay */}
            <div style={{
              background: '#fff', border: '1px solid #ddd6fe',
              borderRadius: 14, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wallet size={20} color="#7c3aed" />
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed', letterSpacing: 1, marginBottom: 4 }}>NET PAY</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                  ₹ {netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* ── SIGNATURES ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', gap: 40,
            padding: '10px 14px 24px 14px',
          }}>
            {/* Employee Signature */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#64748b', fontSize: '0.82rem', marginBottom: 24 }}>
                Employee Signature:
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', marginBottom: 6 }} />
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
                Date: <EC value={slip.sigDate} onChange={update('sigDate')} size="0.82rem" color="#64748b" />
              </div>
            </div>

            {/* Approved */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
                <div style={{ fontWeight: 700, color: '#64748b', fontSize: '0.82rem' }}>
                  Approved:
                </div>
                {/* Signature Graphic Placeholder */}
                <div style={{
                  color: '#94a3b8', fontSize: '1.2rem', fontFamily: 'cursive',
                  transform: 'rotate(-8deg)', userSelect: 'none',
                }}>
                  Signature
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', marginBottom: 6 }} />
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
                Date: <EC value={slip.approvedDate} onChange={update('approvedDate')} size="0.82rem" color="#64748b" />
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Star size={18} color="#fff" fill="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginBottom: 3 }}>Total in Words</div>
                <div style={{ fontSize: '0.82rem', color: '#6d28d9', fontStyle: 'italic', fontWeight: 500 }}>
                  {numToWords(netPay)}
                </div>
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: '#e5e7eb' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={18} color="#7c3aed" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginBottom: 3 }}>Printed On</div>
                <EC value={slip.printedOn} onChange={update('printedOn')} bold size="0.88rem" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

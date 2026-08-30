import React, { useState } from 'react';

export default function RctCalculator() {
  // State Parameter
  const [selectedTool, setSelectedTool] = useState('L&W'); // Pilihan Tool: L&W / PNSHAR
  const [grade, setGrade] = useState('CME');
  const [gsm, setGsm] = useState('125');
  const [jr, setJr] = useState('808');
  const [factor, setFactor] = useState(40); // Dalam Satuan % (Faktor F2)
  const [minRct, setMinRct] = useState(11.6); // Nilai Minimal RCT
  const [temp, setTemp] = useState(22.1);
  const [rh, setRh] = useState(49);

  // State Inputs
  const [ts, setTs] = useState({ data1: '', data2: '', data3: '' }); // 3 Data TS
  const [ms, setMs] = useState({ data1: '', data2: '', data3: '', data4: '' }); // 4 Data MS
  const [ds, setDs] = useState({ data1: '', data2: '', data3: '' }); // 3 Data DS

  // Fungsi Transformasi Data (Khusus Upload / Mode Terpenyesuaian)
  const transformValue = (val, isUploadMode = false) => {
    const num = parseFloat(val);
    if (isNaN(num)) return null;
    if (!isUploadMode) return num;

    // Rumus: Data Aktual - ((Data Aktual - Min RCT) * % Factor)
    const factorDecimal = parseFloat(factor) / 100;
    return num - ((num - parseFloat(minRct)) * factorDecimal);
  };

  // 1. Kalkulasi Average TS (Rata-rata langsung dari 3 data)
  const calculateTsAverage = (isUpload = false) => {
    const vals = [ts.data1, ts.data2, ts.data3]
      .map(v => transformValue(v, isUpload))
      .filter(v => v !== null);

    if (vals.length === 0) return 0;
    const sum = vals.reduce((acc, curr) => acc + curr, 0);
    return sum / vals.length;
  };

  // 2. Kalkulasi Average DS (Rata-rata langsung dari 3 data)
  const calculateDsAverage = (isUpload = false) => {
    const vals = [ds.data1, ds.data2, ds.data3]
      .map(v => transformValue(v, isUpload))
      .filter(v => v !== null);

    if (vals.length === 0) return 0;
    const sum = vals.reduce((acc, curr) => acc + curr, 0);
    return sum / vals.length;
  };

  // 3. Kalkulasi Average MS (Khusus: (Data 1 + Data 2)/2, lalu di-average dengan Data 3 & Data 4)
  const calculateMsAverage = (isUpload = false) => {
    const m1 = transformValue(ms.data1, isUpload);
    const m2 = transformValue(ms.data2, isUpload);
    const m3 = transformValue(ms.data3, isUpload);
    const m4 = transformValue(ms.data4, isUpload);

    let components = [];

    // Step A: Average Data 1 & Data 2
    if (m1 !== null && m2 !== null) {
      components.push((m1 + m2) / 2);
    } else if (m1 !== null) {
      components.push(m1);
    } else if (m2 !== null) {
      components.push(m2);
    }

    // Step B: Gabungkan dengan Data 3 dan Data 4
    if (m3 !== null) components.push(m3);
    if (m4 !== null) components.push(m4);

    if (components.length === 0) return 0;
    const total = components.reduce((acc, curr) => acc + curr, 0);
    return total / components.length;
  };

  // Hasil Perhitungan Average
  const avgTS = calculateTsAverage(false); // Ganti true jika dalam mode Upload Data
  const avgMS = calculateMsAverage(false); // Ganti true jika dalam mode Upload Data
  const avgDS = calculateDsAverage(false); // Ganti true jika dalam mode Upload Data
  const grandAverage = (avgTS + avgMS + avgDS) / 3;

  return (
    <div className="p-4 max-w-md mx-auto bg-slate-900 text-white rounded-xl">
      {/* Parameter Inputs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <label className="text-xs">TOOL</label>
          <select 
            value={selectedTool} 
            onChange={(e) => setSelectedTool(e.target.value)}
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
          >
            <option value="L&W">L&W</option>
            <option value="PNSHAR">PNSHAR</option>
          </select>
        </div>

        <div>
          <label className="text-xs">FAKTOR F2 (%)</label>
          <input 
            type="number" 
            value={factor} 
            onChange={(e) => setFactor(e.target.value)}
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
            placeholder="40"
          />
        </div>

        <div>
          <label className="text-xs">MIN RCT</label>
          <input 
            type="number" 
            value={minRct} 
            onChange={(e) => setMinRct(e.target.value)}
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
          />
        </div>
      </div>

      {/* Tampilan Ringkasan Output Average */}
      <div className="bg-green-600 p-3 rounded-lg text-black font-bold grid grid-cols-3 text-center mb-2">
        <div>TS: {avgTS.toFixed(2)}</div>
        <div>MS: {avgMS.toFixed(2)}</div>
        <div>DS: {avgDS.toFixed(2)}</div>
      </div>
      <div className="bg-green-500 p-2 rounded-lg text-black font-bold text-center">
        TOTAL AVG: {grandAverage.toFixed(2)}
      </div>
    </div>
  );
}

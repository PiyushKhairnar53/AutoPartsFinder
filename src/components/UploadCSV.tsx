'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function UploadCSV({ onChangeStep }: UploadCSVProps) {
  const [vendorName, setVendorName] = useState('');
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const vendorList = [
    'Auto Parts Pro',
    'Car Care Connect',
    'Drive Easy Spares',
    'Elite Auto Essentials',
    'Performance Parts Hub',
  ];

  const triggerFileInput = () => fileInputRef.current?.click();

  const normalizeKeys = (items: Record<string, string>[]): ParsedProduct[] => {
    return items.map((item) => {
      const normalized: ParsedProduct = {} as ParsedProduct;
      Object.entries(item).forEach(([key, value]) => {
        const newKey = key.trim().toLowerCase().replace(/\s+/g, '_');
        normalized[newKey] = value;
      });
      return normalized;
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !vendorName) return;

    const newDocs: DocumentEntry[] = Array.from(files).map((file) => ({
      vendorName,
      file,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!vendorName) return;

    const files = Array.from(e.dataTransfer.files);
    const newDocs: DocumentEntry[] = files.map((file) => ({
      vendorName,
      file,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleSubmitAll = async () => {
    const results: ParsedEntry[] = [];

    for (const entry of documents) {
      const { vendorName, file } = entry;
      const fileName = file.name;
      const extension = fileName.split('.').pop()?.toLowerCase();

      const data = await new Promise<ParsedProduct[]>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target?.result;
          if (!content) return resolve([]);

          if (extension === 'csv') {
            Papa.parse(content as string, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                const normalized = normalizeKeys(results.data as Record<string, string>[]);
                resolve(normalized);
              },
              error: (err: Error) => reject(err),
            });
          } else if (extension === 'xlsx') {
            const workbook = XLSX.read(content, { type: 'binary' });
            const firstSheet = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheet];
            const json = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { defval: '' });
            const normalized = normalizeKeys(json);
            resolve(normalized);
          } else {
            resolve([]);
          }
        };

        if (extension === 'csv') {
          reader.readAsText(file);
        } else if (extension === 'xlsx') {
          reader.readAsBinaryString(file);
        } else {
          resolve([]);
        }
      });

      results.push({ vendorName, fileName, data });
    }

    localStorage.setItem('parsedDocuments', JSON.stringify(results));
    setDocuments([]);
    onChangeStep(2);
  };

  return (
    <div className="container py-3">
      <div className="card border-0 p-2">
        <div className="card-body">
          <h4 className="fw-bold mb-4">Upload CSV/XLSX Documents</h4>

          <div className="col-md-3 pb-3">
            <label className="form-label fw-semibold">Select Vendor</label>
            <select
              className="form-select"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            >
              <option value="" disabled>Select Vendor</option>
              {vendorList.map((vendor, i) => (
                <option key={i} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 align-items-end">
            <div >
              <label className="form-label fw-semibold">Upload Area</label>
              <div
                className="border rounded text-center p-5"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div>📄 Drag and drop files here</div>
                <div className="my-2 text-muted">Or</div>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  multiple
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  className="btn btn-dark"
                  onClick={triggerFileInput}
                >
                  + Add Files
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            {documents.map((doc, idx) => (
              <div key={idx} className="col-md-6 mb-3">
                <div className="bg-light p-3 rounded h-100">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-success-subtle text-success rounded d-flex align-items-center justify-content-center me-3"
                      style={{ width: 40, height: 40 }}
                    >
                      <i className="bi bi-file-earmark-text fs-4 text-black"></i>
                    </div>

                    <div>
                      <div className="fw-semibold text-dark">
                        {doc.vendorName} - {doc.file.name}
                      </div>
                      <div className="small text-muted">
                        {doc.file.type} • {(doc.file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-end">
            <button className="btn btn-dark px-5" onClick={handleSubmitAll}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

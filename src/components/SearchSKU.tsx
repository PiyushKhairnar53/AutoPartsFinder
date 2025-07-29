'use client';

import React, { useState } from 'react';

const SearchSKU = ({ onChangeStep }: UploadCSVProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ProductItem[]>([]);

  const handleSearch = () => {
    debugger
    const stored = localStorage.getItem('parsedDocuments');
    if (!stored) {
      alert('No uploaded data found.');
      return;
    }

    const parsed: ParsedEntry[] = JSON.parse(stored);
    const foundProducts: ProductItem[] = [];

    parsed.forEach((entry) => {
      entry.data.forEach((item) => {
        const partLink = item.part_link_number;

        if (
          partLink &&
          partLink.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          foundProducts.push({
            vendorName: entry.vendorName,
            fileName: entry.fileName,
            data: item,
          });
        }
      });
    });

    foundProducts.sort((a, b) => {
      const priceA = parseFloat(a.data.price.replace(/,/g, '') || '0');
      const priceB = parseFloat(b.data.price.replace(/,/g, '') || '0');
      return priceA - priceB;
    });

    setResults(foundProducts);
  };

  const handleReset = () => {
    localStorage.removeItem('parsedDocuments');
    setResults([]);
    onChangeStep(1);
  };

  return (
    <div className="container py-4 overflow-y-auto">
      <div className="card border-0 p-4">
        <h4 className="fw-bold mb-4">Search by Part Link Number and Quantity</h4>

        <div className="d-flex mb-3 justify-content-between align-items-end">
          <div className="col-md-4 form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Part Link Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4 form-group px-4"/>
          <div className="col-md-4 d-flex justify-content-end">
            <div className='px-2'>
              <button className="btn btn-dark px-4" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className='px-2'>
              <button className="btn btn-light fw-semibold border px-3" onClick={handleReset}>
                Start Again
              </button>
            </div>
          </div>
        </div>

        {searchTerm !== '' && results.length > 0 ? (
          <table className="w-full table table-striped border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Part Link Number</th>
                <th className="border px-3 py-2 text-left">Vendor</th>
                <th className="border px-3 py-2 text-left">Product</th>
                <th className="border px-3 py-2 text-left">Price</th>
                <th className="border px-3 py-2 text-left">Inventory</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-3 py-1">{item.data.part_link_number}</td>
                  <td className="border px-3 py-1">{item.vendorName}</td>
                  <td className="border px-3 py-1">{item.data.product_name}</td>
                  <td className="border px-3 py-1 text-end">$ {item.data.price}</td>
                  <td className="border px-3 py-1">{item.data.inventory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : searchTerm === '' ? (
          <p className="text-gray-600"></p>
        ) : 
        (
          <p className="text-gray-600">No results found.</p>
        )
      }
      </div>
    </div>
  );
};

export default SearchSKU;
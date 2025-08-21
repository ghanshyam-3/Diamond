import React from 'react';

export default function DiamondCard({ diamond }) {
  const statusColors = {
    in_stock: 'bg-blue-100 text-blue-800',
    approved_for_polish: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-purple-100 text-purple-800',
    polished: 'bg-green-100 text-green-800',
    sold: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{diamond.unique_id}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {diamond.carat} Carat • {diamond.color} • {diamond.clarity}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[diamond.status]}`}>
            {diamond.status.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Shape</dt>
            <dd className="mt-1 text-sm text-gray-900">{diamond.shape}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Price</dt>
            <dd className="mt-1 text-sm text-gray-900">₹{diamond.buying_price}</dd>
          </div>
        </div>
      </div>
    </div>
  );
}

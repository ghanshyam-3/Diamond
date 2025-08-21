import React from 'react';

export default function DashboardHeader({ title, subtitle }) {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {/* Action buttons can be added here */}
      </div>
    </div>
  );
}

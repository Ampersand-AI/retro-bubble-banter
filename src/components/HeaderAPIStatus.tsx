
import React from 'react';
import { AIModel } from './ModelSelect';

interface HeaderAPIStatusProps {
  apiStatus: {[key in AIModel]: boolean};
}

const HeaderAPIStatus = ({ apiStatus }: HeaderAPIStatusProps) => {
  return (
    <div className="flex items-center bg-amp-blue p-2 rounded border border-amp-cyan text-amp-gray text-xs">
      {Object.entries(apiStatus).map(([api, status]) => (
        <div key={api} className="flex items-center mx-2">
          <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
          <span className="capitalize">{api}: {status ? 'Connected' : 'Disconnected'}</span>
        </div>
      ))}
    </div>
  );
};

export default HeaderAPIStatus;

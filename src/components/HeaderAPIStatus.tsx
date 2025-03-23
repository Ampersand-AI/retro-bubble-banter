
import React from 'react';
import { AIModel } from './ModelSelect';

interface HeaderAPIStatusProps {
  apiStatus: {[key in AIModel]: boolean};
}

const HeaderAPIStatus = ({ apiStatus }: HeaderAPIStatusProps) => {
  return (
    <div className="flex items-center">
      {Object.entries(apiStatus).map(([api, status]) => (
        <div key={api} className="flex items-center mx-2 px-3 py-1 border border-amp-cyan rounded">
          <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
          <span className="capitalize text-amp-cyan">{api}</span>
        </div>
      ))}
    </div>
  );
};

export default HeaderAPIStatus;

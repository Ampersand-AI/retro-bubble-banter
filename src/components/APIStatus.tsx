
import React from 'react';
import { AIModel } from './ModelSelect';

interface APIStatusProps {
  apiStatus: {[key in AIModel]: boolean};
}

const APIStatus = ({ apiStatus }: APIStatusProps) => {
  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-amp-blue p-4 rounded border border-amp-cyan text-amp-gray">
      <h3 className="text-amp-cyan text-center mb-4 text-lg">API Connection Status</h3>
      <div className="space-y-3">
        {Object.entries(apiStatus).map(([api, status]) => (
          <div key={api} className="flex items-center justify-between">
            <span className="capitalize">{api} API:</span>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
              <span>{status ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APIStatus;

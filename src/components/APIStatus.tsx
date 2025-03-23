
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
        <div className="flex items-center justify-between">
          <span>OpenAI API:</span>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${apiStatus.openai ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span>{apiStatus.openai ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Claude API:</span>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${apiStatus.claude ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span>{apiStatus.claude ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Gemini API:</span>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${apiStatus.gemini ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span>{apiStatus.gemini ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIStatus;

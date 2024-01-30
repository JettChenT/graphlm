import React, { useEffect, useState } from "react";
import useStore from "./store";

const SettingsModal = () => {
  const { llm_config, setLLMConfig } = useStore((state) => ({
    llm_config: state.llm_config,
    setLLMConfig: state.setLLMConfig,
  }));

  const [apiBase, setApiBase] = useState(llm_config.api_base);
  const [apiKey, setApiKey] = useState(llm_config.api_key);
  const [isOpen, setIsOpen] = useState(false); // State to manage modal open/close

  useEffect(() => {
    setApiBase(llm_config.api_base);
    setApiKey(llm_config.api_key);
  }, [llm_config.api_base, llm_config.api_key]);

  const handleSave = () => {
    setLLMConfig({ api_base: apiBase, api_key: apiKey });
    setIsOpen(false); // Close modal on save
  };

  const toggleModal = () => setIsOpen(!isOpen); // Function to toggle modal open/close

  return (
    <>
      <button
        onClick={toggleModal}
        className="px-2 py-1 rounded bg-blue-500 text-white shadow"
      >
        Settings
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <label className="block mb-2">
                <span className="text-gray-700">API Base:</span>
                <input
                  type="text"
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">API Key:</span>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <button
                onClick={handleSave}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <button
                onClick={toggleModal}
                className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  entity: 'clients' | 'tasks' | 'workers';
  data: any[];
  setFilteredData: (filtered: any[]) => void;
};

export default function AIQuerySideBar({ entity, data, setFilteredData }: Props) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    if (!data || data.length === 0) {
      toast.error('No data available to filter');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('AI is thinking...');

    try {
      console.log('Making API request to /api/ai-filter');
      console.log('Request data:', {
        query: query.trim(),
        dataLength: data.length,
        entity
      });

      const response = await fetch('/api/ai-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          data,
          entity
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Try to parse as JSON first
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          // If not JSON, it's likely an HTML error page
          if (errorText.includes('<html>') || errorText.includes('<!DOCTYPE')) {
            throw new Error(`API route not found or returned HTML. Status: ${response.status}. Check if /api/ai-filter/route.ts exists.`);
          }
          throw new Error(`API Error: ${response.status} - ${errorText.substring(0, 200)}`);
        }
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText.substring(0, 500));
        throw new Error('API returned non-JSON response. Check server logs for errors.');
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (!result) {
        throw new Error('Empty response from API');
      }

      // Update filtered data
      setFilteredData(result.filtered || []);
      setLastQuery(query.trim());

      toast.success(
        `Found ${result.filteredCount || 0} of ${result.originalCount || 0} ${entity}`,
        { id: loadingToast }
      );

    } catch (error) {
      console.error('AI query error:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI query failed';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilteredData(data);
    setQuery('');
    setLastQuery('');
    toast.success('Filter cleared');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm mb-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Ask AI to filter ${entity} (e.g., "tasks with duration > 5" or "tasks requiring JavaScript")`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Thinking...' : 'Ask AI'}
          </button>
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Currently showing {data.length} {entity}
          </span>
          {lastQuery && (
            <span className="text-blue-600">
              Last query: "{lastQuery}"
            </span>
          )}
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Debug: API endpoint is /api/ai-filter | Data length: {data?.length || 0}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { apiRequest } from '../utils/api';

export function DebugCharacters() {
  const { getAccessToken, user } = useAuth();
  const [result, setResult] = useState<string>('');

  const testDatabase = async () => {
    try {
      setResult('Testing database...');
      const response = await apiRequest('/test-db', {});
      setResult('Database test: ' + JSON.stringify(response, null, 2));
    } catch (err: any) {
      setResult('Database test error: ' + err.message);
    }
  };

  const testCreateCharacter = async () => {
    try {
      setResult('Creating test character...');
      const token = await getAccessToken();
      if (!token) {
        setResult('Error: No access token');
        return;
      }
      
      const testChar = {
        name: 'Test Character ' + Date.now(),
        initiative: 15,
        health: 100,
        maxHealth: 100,
        stamina: 50,
        maxStamina: 50,
        isPlayer: true,
      };
      
      console.log('Creating character:', testChar);
      const response = await apiRequest('/characters', {
        method: 'POST',
        body: JSON.stringify(testChar),
      }, token);
      
      console.log('Create response:', response);
      setResult('Created character: ' + JSON.stringify(response, null, 2));
    } catch (err: any) {
      console.error('Create error:', err);
      setResult('Create character error: ' + err.message);
    }
  };

  const testFetchCharacters = async () => {
    try {
      setResult('Fetching characters...');
      const token = await getAccessToken();
      if (!token) {
        setResult('Error: No access token');
        return;
      }
      
      console.log('Fetching characters with token:', token.substring(0, 20) + '...');
      console.log('User ID:', user?.id);
      
      const response = await apiRequest('/characters', {}, token);
      console.log('Fetch response:', response);
      setResult('Characters: ' + JSON.stringify(response, null, 2));
    } catch (err: any) {
      console.error('Fetch error:', err);
      setResult('Fetch characters error: ' + err.message);
    }
  };

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700 space-y-4">
      <h3 className="text-white">Debug Tools</h3>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={testDatabase} variant="outline">
          Test Database
        </Button>
        <Button onClick={testCreateCharacter} variant="outline">
          Create Test Character
        </Button>
        <Button onClick={testFetchCharacters} variant="outline">
          Fetch Characters
        </Button>
      </div>
      {result && (
        <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded overflow-auto max-h-96">
          {result}
        </pre>
      )}
    </Card>
  );
}

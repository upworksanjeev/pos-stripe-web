
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface PinLoginProps {
  onAuthenticate: () => void;
}

const PinLogin = ({ onAuthenticate }: PinLoginProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock PIN - in real app this would be validated securely
    if (pin === '1234') {
      onAuthenticate();
    } else {
      setError('Invalid PIN. Try 1234 for demo.');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">POS Access</CardTitle>
          <CardDescription>Enter your PIN to access the Point of Sale system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={4}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg">
              Access POS
            </Button>
            <p className="text-xs text-gray-500 text-center">Demo PIN: 1234</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinLogin;

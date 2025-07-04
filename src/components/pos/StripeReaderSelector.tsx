import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { loadStripeTerminal } from '@stripe/terminal-js';

interface StripeReaderSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (reader: any) => void;
}

const StripeReaderSelector = ({ isOpen, onClose, onConnect }: StripeReaderSelectorProps) => {
  const [terminal, setTerminal] = useState<any>(null);
  const [readers, setReaders] = useState<any[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReader, setSelectedReader] = useState<any | null>(null);
  const [isPairing, setIsPairing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setReaders([]);
      setSelectedReader(null);
      setError(null);
      setIsDiscovering(false);
      setIsPairing(false);
      if (terminal) {
        terminal.disconnectReader();
        setTerminal(null);
      }
      return;
    }

    // Initialize Stripe Terminal asynchronously
    loadStripeTerminal()
      .then((stripeTerminal) => {
        if (!stripeTerminal) {
          setError('Failed to load Stripe Terminal');
          return;
        }
        const newTerminal = stripeTerminal.create({
          onFetchConnectionToken: async () => {
            try {
              const response = await fetch('http://localhost:4242/api/connection-token', { method: 'POST' });
              const data = await response.json();
              return data.secret;
            } catch (err) {
              setError('Failed to fetch connection token');
              throw err;
            }
          },
          onUnexpectedReaderDisconnect: () => {
            setError('Reader disconnected unexpectedly');
          },
        });
        setTerminal(newTerminal);
      })
      .catch(() => {
        setError('Failed to load Stripe Terminal');
      });
  }, [isOpen]);

  const discoverReaders = async () => {
    if (!terminal) return;
    setIsDiscovering(true);
    setError(null);
    setReaders([]);
    try {
      // Discover readers using the 'internet' method as per latest SDK
      const discoveredReaders = await terminal.discoverReaders({ method: 'internet' });
      if (discoveredReaders.discoveredReaders) {
        setReaders(discoveredReaders.discoveredReaders);
      } else if (discoveredReaders.message) {
        setError(discoveredReaders.message);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsDiscovering(false);
    }
  };

  const handlePairReader = async () => {
    if (!terminal || !selectedReader) return;
    setIsPairing(true);
    setError(null);
    try {
      // Connect to the selected reader without pairingCode as latest SDK does not support it here
      const result = await terminal.connectReader(selectedReader);
      if (result.error) {
        setError(result.error.message);
      } else if (result.reader) {
        onConnect(result.reader);
        onClose();
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsPairing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Stripe Reader</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && <div className="text-red-600">{error}</div>}
          <Button onClick={discoverReaders} disabled={isDiscovering}>
            {isDiscovering ? 'Discovering...' : 'Discover Readers'}
          </Button>
          <div>
            {readers.length === 0 && !isDiscovering && <p>No readers found. Click "Discover Readers" to search.</p>}
            {readers.length > 0 && (
              <ul className="max-h-48 overflow-auto border rounded p-2">
                {readers.map((reader) => (
                  <li key={reader.serial_number} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={reader.serial_number}
                      name="reader"
                      value={reader.serial_number}
                      checked={selectedReader?.serial_number === reader.serial_number}
                      onChange={() => setSelectedReader(reader)}
                    />
                    <label htmlFor={reader.serial_number}>
                      {reader.label} ({reader.serial_number})
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPairing}>
            Cancel
          </Button>
          <Button onClick={handlePairReader} disabled={!selectedReader || isPairing}>
            {isPairing ? 'Pairing...' : 'Pair Reader'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StripeReaderSelector;

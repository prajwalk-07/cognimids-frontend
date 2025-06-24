'use client';

import { createContext, useContext, useState } from 'react';

const FingerprintContext = createContext();

export function FingerprintProvider({ children }) {
  const [fingerprintId, setFingerprintId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  // 👉 Update this with your ESP32 IP address
  const ESP32_URL = 'http://192.168.31.253:3000/fingerprintId';

  const getFingerprintData = async () => {
    try {
      setIsScanning(true);
      setError(null);

      const response = await fetch(ESP32_URL);
      const text = await response.text();

      if (text.startsWith('fingerprintId:')) {
        const fingerprintId = text.replace('fingerprintId:', '').trim();
        setFingerprintId(fingerprintId);
        return fingerprintId;
      } else {
        throw new Error('Invalid response from ESP32');
      }
    } catch (err) {
      console.error('Failed to get fingerprintId:', err);
      setError('Could not fetch fingerprintId from ESP32');
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const clearFingerprint = () => {
    setFingerprintId(null);
    setError(null);
  };

  return (
    <FingerprintContext.Provider
      value={{
        fingerprintId,
        isScanning,
        error,
        getFingerprintData,
        clearFingerprint,
      }}
    >
      {children}
    </FingerprintContext.Provider>
  );
}

export const useFingerprint = () => useContext(FingerprintContext);
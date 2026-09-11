"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface WalletData {
  name: string;
  logo?: string;
  description?: string;
  address?: string;
}

interface WalletContextType {
  wallet: WalletData | null;
  connectWallet: (wallet: WalletData) => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  // You can set initial state to null or default mock wallet
  const [wallet, setWallet] = useState<WalletData | null>(null);

  const connectWallet = (selectedWallet: WalletData) => {
    // Generate a mock address if one isn't provided
    const mockAddress =
      selectedWallet.address ||
      `${selectedWallet.name.slice(0, 3).toLowerCase()}0x21b0x...${Math.floor(1000 + Math.random() * 9000)}`;

    setWallet({
      ...selectedWallet,
      address: mockAddress,
    });
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

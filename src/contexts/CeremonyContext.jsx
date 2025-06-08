import { createContext, useContext, useState } from 'react';

const CeremonyContext = createContext();

export const CeremonyProvider = ({ children }) => {
  const [openCeremony, setOpenCeremony] = useState(null);

  return (
    <CeremonyContext.Provider value={{ openCeremony, setOpenCeremony }}>
      {children}
    </CeremonyContext.Provider>
  );
};

// Hook para usar o contexto
export const useCeremonyContext = () => useContext(CeremonyContext);
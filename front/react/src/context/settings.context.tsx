import { createContext, useContext, useState } from "react";
import { MfaStatus } from "../settings/constants/mfa-status";

export interface SettingsContextState {
  mfaStatus: MfaStatus;
  setMfaStatus: Function;
}

const SettingsContext = createContext<SettingsContextState>({
  mfaStatus: MfaStatus.LOADING,
  setMfaStatus: () => { },
});

function ChatProvider(props: any) {
  const [mfaStatus, setMfaStatus] = useState<MfaStatus>(MfaStatus.LOADING);

  return (
    <SettingsContext.Provider
      value={{
        mfaStatus, setMfaStatus,
      }}
      {...props}
    />
  );
}

export const useSettingsContext = () => useContext(SettingsContext);

export default ChatProvider;

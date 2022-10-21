import { createContext, useContext, useState } from "react";
import { AvatarStatus } from "../settings/constants/avatar-status";
import { MfaStatus } from "../settings/constants/mfa-status";

export interface SettingsContextState {
  avatarStatus: AvatarStatus,
  setAvatarStatus: Function,
  avatarError: string,
  setAvatarError: Function,
  newNickname: string,
  setNewNickname: Function,
  editingNickname: boolean,
  setEditingNickname: Function,
  nicknameError: string,
  setNicknameError: Function,
  mfaStatus: MfaStatus;
  setMfaStatus: Function,
  mfaError: string,
  setMfaError: Function,
  smsCode: string,
  setSmsCode: Function,
  phoneNumber: string,
  setPhoneNumber: Function,
}

const SettingsContext = createContext<SettingsContextState>({
  avatarStatus: AvatarStatus.LOADING,
  setAvatarStatus: () => { },
  avatarError: "",
  setAvatarError: () => { },
  newNickname: "",
  setNewNickname: () => { },
  editingNickname: false,
  setEditingNickname: () => { },
  nicknameError: "",
  setNicknameError: () => { },
  mfaStatus: MfaStatus.LOADING,
  setMfaStatus: () => { },
  mfaError: "",
  setMfaError: () => { },
  smsCode: "",
  setSmsCode: () => { },
  phoneNumber: "",
  setPhoneNumber: () => { },
});

function SettingsProvider(props: any) {
  const [editingNickname, setEditingNickname] = useState<[]>();
  const [nicknameError, setNicknameError] = useState<string>("");
  const [mfaStatus, setMfaStatus] = useState<MfaStatus>(MfaStatus.LOADING);
  const [mfaError, setMfaError] = useState<string>("");
  const [smsCode, setSmsCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  return (
    <SettingsContext.Provider
      value={{
        editingNickname, setEditingNickname,
        nicknameError, setNicknameError,
        mfaStatus, setMfaStatus,
        mfaError, setMfaError,
        smsCode, setSmsCode,
        phoneNumber, setPhoneNumber,
      }}
      {...props}
    />
  );
}

export const useSettingsContext = () => useContext(SettingsContext);

export default SettingsProvider;

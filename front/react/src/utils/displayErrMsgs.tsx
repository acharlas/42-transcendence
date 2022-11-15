export default function displayErrorMsgs(msg: string, errorClass: string = "error-msg") {
  return (
    Array.isArray(msg)
      ? <p className={errorClass}>{msg.join(' ')}</p>
      : <p className={errorClass}>{msg}</p>
  );
};
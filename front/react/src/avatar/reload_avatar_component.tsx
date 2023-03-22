import defaultPicture from "../image/defaultPicture.png";

export default function ReloadAvatar(id: string, reload: number, classname: string = "profile__avatar") {
  return (
    <img
      className={classname}
      src={`https://5.182.18.157:443/avatar/` + id + "?rld=" + reload}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // no looping
        currentTarget.src = defaultPicture;
      }}
      alt=""
    />
  );
}

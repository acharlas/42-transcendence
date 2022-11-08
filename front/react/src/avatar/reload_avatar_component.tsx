import defaultPicture from "../image/defaultPicture.png"

export default function ReloadAvatar(
  id: string,
  reload: number,
  classname: string = "profile_avatar",
) {
  return (
    <img
      className={classname}
      src={`http://localhost:3333/avatar/` + id + "?rld=" + reload}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // no looping
        currentTarget.src = defaultPicture;
      }}
      alt=""
    />
  )
}
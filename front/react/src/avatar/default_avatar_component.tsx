import defaultPicture from "../image/defaultPicture.png"

export default function DefaultAvatar(
  classname: string = "profile__avatar",
) {
  return (
    <img
      className={classname}
      src={defaultPicture}
      alt=""
    />
  )
}
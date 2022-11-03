import defaultPicture from "../image/defaultPicture.png"

// component to load an avatar or display the default one
// you can use the second parameter to use a specific css class

export default function Avatar(
  id: string,
  classname: string = "profile__avatar",
) {
  return (
    <img
      className={classname}
      src={`http://localhost:3333/avatar/` + id}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // no looping
        currentTarget.src = defaultPicture;
      }}
      alt=""
    />
  )
}
import { Dropdown } from "@components";
import ProfileButton from "./profile-button/ProfileButton";
import ProfileMenu from "./profile-menu/ProfileMenu";

export default function ProfileDropdown() {
  return <Dropdown dropdownButton={ProfileButton} dropdownMenu={ProfileMenu} />;
}

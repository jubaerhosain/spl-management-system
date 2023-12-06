import { Dropdown } from "@components";
import NotificationButton from "./notification-button/NotificationButton";
import NotificationMenu from "./notification-menu/NotificationMenu";

export default function NotificationDropdown() {
  return <Dropdown dropdownButton={NotificationButton} dropdownMenu={NotificationMenu} />;
}

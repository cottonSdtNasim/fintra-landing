import { redirect } from "next/navigation";

export default function NotFound() {
  // If a page does not exist, automatically redirect to the home page (/)
  redirect("/");
}

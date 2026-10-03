import { serverApiGet } from "@/lib/server-api";
import { DEFAULT_FOOTER_CONTACT, type FooterContactContent } from "@/lib/site-pages-content";
import { ContactClient } from "./contact-client";

export const metadata = { title: "İletişim" };

export default async function ContactPage() {
  const settings = await serverApiGet<Record<string, unknown>>("/settings", 60);
  const contact = (settings?.footer_contact_content as FooterContactContent | undefined) ?? DEFAULT_FOOTER_CONTACT;
  return <ContactClient contact={contact} />;
}

import { LeadForm } from "@/components/forms/LeadForm";
import { BrokerDisclosure } from "@/components/legal/BrokerDisclosure";
import { siteConfig } from "@/lib/site";
import {
  buildWhatsAppUrl,
  generalWhatsAppMessage,
} from "@/lib/whatsapp";

export const metadata = { title: "צור קשר" };

export default function ContactPage() {
  const wa = buildWhatsAppUrl(generalWhatsAppMessage());

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-accent">צור קשר</h1>
      <p className="mt-3 text-text-muted">
        שאלות כלליות שלא בהכרח קשורות לנכס ספציפי — כאן.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={`tel:${siteConfig.phoneTel}`} className="btn btn-ghost">
          התקשרות: {siteConfig.phone}
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          וואטסאפ
        </a>
      </div>
      <BrokerDisclosure className="mt-4" />

      <div className="mt-10 rounded border border-border bg-bg-elevated p-5">
        <LeadForm type="general" />
      </div>
    </div>
  );
}

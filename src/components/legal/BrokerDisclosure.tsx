import { brokerMarketingLine } from "@/lib/legal-display";

/** Compact broker disclosure for listings / contact (תקנות המתווכים — פרסום) */
export function BrokerDisclosure({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-xs leading-relaxed text-text-muted ${className}`.trim()}
      data-testid="broker-disclosure"
    >
      {brokerMarketingLine()}
    </p>
  );
}

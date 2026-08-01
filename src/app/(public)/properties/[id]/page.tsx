import { propertyStaticParams } from "@/lib/static-params";
import PropertyDetailClient from "./PropertyDetailClient";

export function generateStaticParams() {
  return propertyStaticParams();
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}

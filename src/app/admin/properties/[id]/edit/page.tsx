import { propertyStaticParams } from "@/lib/static-params";
import EditClient from "./EditClient";

export function generateStaticParams() {
  return propertyStaticParams();
}

export default function EditPropertyPage() {
  return <EditClient />;
}

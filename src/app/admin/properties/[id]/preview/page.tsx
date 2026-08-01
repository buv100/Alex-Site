import { propertyStaticParams } from "@/lib/static-params";
import PreviewClient from "./PreviewClient";

export function generateStaticParams() {
  return propertyStaticParams();
}

export default function PreviewPropertyPage() {
  return <PreviewClient />;
}

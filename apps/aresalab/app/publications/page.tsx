import { getPublicationsByCategory } from "../../lib/publications";
import { PublicationsPageClient } from "./PublicationsPageClient";

export default function PublicationsPage() {
  // Get all research publications (includes both static and dynamic from Cortex DB)
  const allPublications = getPublicationsByCategory('research');
  return <PublicationsPageClient publications={allPublications} />;
}

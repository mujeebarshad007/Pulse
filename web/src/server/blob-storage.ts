import "server-only";
import { getStore } from "@netlify/blobs";

// No public blob URLs: all reads pass through report ownership checks.
export function reportBlobs() {
  return getStore({ name: "pulse-private-reports", consistency: "strong" });
}

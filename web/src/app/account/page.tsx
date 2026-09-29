"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/features/pulse/provider";
import { homeFor } from "@/features/pulse/model";
export default function Account() {
  const { actor, loading } = useDemo();
  const router = useRouter();
  useEffect(() => {
    if (!loading) router.replace(actor ? homeFor(actor.role) : "/login");
  }, [actor, loading, router]);
  return (
    <main className="pulse-app p-error-page">
      <p role="status">Opening your workspace…</p>
    </main>
  );
}

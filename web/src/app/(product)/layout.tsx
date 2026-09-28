import { Workspace } from "@/components/pulse/shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Workspace>{children}</Workspace>;
}

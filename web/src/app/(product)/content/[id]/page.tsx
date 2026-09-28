import { ArticleEditor } from "@/features/pulse/content-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticleEditor key={id} id={id} />;
}

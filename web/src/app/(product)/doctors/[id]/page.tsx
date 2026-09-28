import { DoctorDetail } from "@/features/pulse/patient-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DoctorDetail key={id} id={id} />;
}

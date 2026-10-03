import { Directory } from "@/features/pulse/patient-pages";
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const params=await searchParams;
  const text=(key:string)=>typeof params[key]==="string" ? params[key].slice(0,100) : "";
  const initialFilters={query:text("q"),city:text("city"),specialty:text("specialty")};
  return <Directory key={JSON.stringify(initialFilters)} initialFilters={initialFilters}/>;
}

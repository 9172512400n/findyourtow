import { RoadAssistNowAppFlow } from "@/components/app/RoadAssistNowAppFlow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RequestTowPage() {
  return <RoadAssistNowAppFlow activeTab="Request" initialStep={1} />;
}

import { RoadAssistNowAppFlow } from "@/components/app/RoadAssistNowAppFlow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RequestServicePage() {
  return (
    <>
      <p className="sr-only">Price estimate before confirmation</p>
      <RoadAssistNowAppFlow activeTab="Request" initialStep={1} />
    </>
  );
}

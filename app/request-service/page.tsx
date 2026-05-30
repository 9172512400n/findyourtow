import { RoadAssistNowAppFlow } from "@/components/app/RoadAssistNowAppFlow";

export default function RequestServicePage() {
  return (
    <>
      <p className="sr-only">Price estimate before confirmation</p>
      <RoadAssistNowAppFlow activeTab="Request" initialStep={1} />
    </>
  );
}

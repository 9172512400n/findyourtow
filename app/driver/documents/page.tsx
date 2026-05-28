import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function DriverDocumentsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Provider documents" title="Documents" copy="License, insurance, registration, background check, and truck photos for admin review."><DemoSection title="Document checklist"><DemoList items={[{title:'Driver license', subtitle:'Expires 2029', right:'Approved', tone:'green'}, {title:'Insurance certificate', subtitle:'Commercial tow coverage', right:'Approved', tone:'green'}, {title:'Truck registration', subtitle:'Truck 204', right:'Approved', tone:'green'}, {title:'Background check', subtitle:'Screening partner review', right:'Pending', tone:'amber'}, {title:'Truck photos', subtitle:'Front, side, plate, equipment', right:'Uploaded'}]} /></DemoSection></DemoAppShell>;
}

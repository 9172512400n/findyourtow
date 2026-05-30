import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

const profileFields = [
  ['Full name', 'Maya Rosen'],
  ['Phone number', '+1 (516) 666-4941'],
  ['Email', 'maya@example.com'],
  ['Home address', '125-10 Queens Blvd, Queens, NY'],
  ['Emergency contact', 'Daniel Rosen · +1 (516) 555-0144'],
  ['Preferred language', 'English'],
];

export default function ProfilePage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Profile" title="Profile" copy="Customer profile screen for identity, contact, home address, and emergency contact details.">
      <div className="mx-auto max-w-2xl">
        <DemoSection title="Personal details">
          <div className="grid gap-3 sm:grid-cols-2">
            {profileFields.map(([label, value]) => (
              <label key={label} className="block text-sm font-black text-white/70">
                {label}
                <input defaultValue={value} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none focus:border-blue-300" />
              </label>
            ))}
          </div>
          <button className="mt-5 min-h-13 w-full rounded-full bg-blue-500 px-5 font-black text-white">Save profile</button>
        </DemoSection>
      </div>
    </DemoAppShell>
  );
}

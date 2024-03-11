import DashboardHeader from '@/components/layout/DashboardHeader/dash-board-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='flex-1 flex flex-col'>
      <div className='container my-6'>
        <DashboardHeader />
      </div>
      {children}
    </section>
  );
}

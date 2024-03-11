export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className=''>
      <header className='border-b container py-4'>
        <h2>Form Name:</h2>
        <p>formId:</p>
      </header>
      <section className='container'>{children}</section>
    </div>
  );
}

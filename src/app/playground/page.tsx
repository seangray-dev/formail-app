import { PlaygroundForm } from '@/components/playground/playground-form';

export default function PlaygroundPage() {
  const hardcodedData = {
    Name: 'John Doe',
    Email: 'john.doe@example.com',
    Message: 'This is a test message.',
  };

  return (
    <section className='container py-10'>
      <PlaygroundForm />
      <div className='mt-10'>
        <p>Email Template</p>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.4',
            color: '#fff',
            backgroundColor: '#0c0a09',
            border: '1px solid #a8a29e',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}>
          <header
            style={{
              borderBottom: '2px solid #a8a29e',
              paddingBottom: '10px',
              marginBottom: '20px',
            }}>
            <h2 style={{ margin: '0', color: '#fff' }}>New Submission</h2>
          </header>
          <div>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
              {Object.entries(hardcodedData).map(([key, value]) => (
                <li key={key} style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#a8a29e' }}>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
          <footer
            style={{
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid #a8a29e',
              fontSize: '12px',
              textAlign: 'center',
            }}>
            <a
              href='https://www.formail.dev/dashboard'
              target='_blank'
              rel='noopener noreferrer'
              style={{
                color: '#fff',
                textDecoration: 'underline',
                marginBottom: '10px',
              }}>
              View in Formail
            </a>
            <p style={{ margin: '5px 0', color: '#a8a29e' }}>
              This is an automated message. Please do not reply.
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}

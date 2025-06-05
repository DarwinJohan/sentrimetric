import { spawn } from 'child_process';

export async function POST(request) {
  const { text } = await request.json();

  return new Promise((resolve) => {
    const python = spawn('python', ['predict.py', text]);

    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error('Python Error:', data.toString());
    });

    python.on('close', () => {
      const trimmed = result.trim();
      const isHateSpeech = trimmed.trim() === 'HATE';
      const message = isHateSpeech ? "⚠️ Hate Speech Detected" : "✅ Not Hate Speech";


      resolve(
         new Response(
            JSON.stringify({ result: message, isHateSpeech }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );
    });
  });
}

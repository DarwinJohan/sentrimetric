import { spawn } from 'child_process';

export async function POST(request) {
  const { text } = await request.json();

  return new Promise((resolve) => {
    const python = spawn('python', ['model.py', text]);

    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error('Python Error:', data.toString());
    });

    python.on('close', () => {
      const trimmed = result.trim();
      const isHateSpeech = trimmed.trim() === '⚠️ Hate Speech Detected';

      resolve(
        new Response(
          JSON.stringify({ result: trimmed, isHateSpeech }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );
    });
  });
}

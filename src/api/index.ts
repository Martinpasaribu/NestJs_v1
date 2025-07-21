// api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import appPromise from '../main.vercel'; // Perhatikan: ini bukan 'main.ts'

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const app = await appPromise;
  app(req, res); // jalankan Express instance dari Nest
}

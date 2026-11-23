import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import leadHandler from './api/lead.ts';

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/lead', (req, res) => {
        let body = '';
        req.on('data', chunk => {
          if (body.length <= 32768) body += chunk.toString();
        });
        req.on('end', async () => {
          if (body.length > 32768) {
            res.statusCode = 413;
            res.end('Request too large');
            return;
          }
          // Use the production handler: dev must not bypass consent or verification.
          const response = Object.assign(res, {
            status(code: number) { res.statusCode = code; return response; },
            json(data: unknown) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return response;
            },
            send(data: string) { res.end(data); return response; },
          });
          await leadHandler(
            Object.assign(req, { body: body || '{}' }) as Parameters<typeof leadHandler>[0],
            response,
          );
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const cmsPassword = env.CMS_PASSWORD || env.VITE_CMS_PASSWORD || process.env.CMS_PASSWORD || process.env.VITE_CMS_PASSWORD || '';

  return {
    define: {
      'import.meta.env.CMS_PASSWORD': JSON.stringify(cmsPassword),
      'import.meta.env.VITE_CMS_PASSWORD': JSON.stringify(cmsPassword),
      'import.meta.env.TURNSTILE_SITE_KEY': JSON.stringify(
        env.TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || '',
      ),
    },
    plugins: [reactRouter(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

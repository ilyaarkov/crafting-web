import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/lead', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const token = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;

            let sentToTelegram = false;
            let telegramError = null;

            if (token && chatId) {
              try {
                const message = `🚀 <b>Новая заявка с сайта!</b>\n\n` +
                  `👤 <b>Имя:</b> ${data.name || 'Не указано'}\n` +
                  `📱 <b>Контакт:</b> ${data.contact || 'Не указано'}\n` +
                  `💼 <b>Тариф/Услуга:</b> ${data.tariff || data.service || 'Не выбран'}\n` +
                  `🔗 <b>Ссылка / Проект:</b> ${data.projectUrl || 'Нет'}\n` +
                  `📝 <b>Описание:</b>\n${data.message || 'Без описания'}\n\n` +
                  `🌐 <b>Язык сайта:</b> ${data.lang || 'ru'}\n` +
                  `🕒 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

                const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                  }),
                });

                const tgData = await tgRes.json();
                if (tgData.ok) {
                  sentToTelegram = true;
                } else {
                  telegramError = tgData.description;
                }
              } catch (err: any) {
                telegramError = err.message;
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              sentToTelegram,
              simulated: !token || !chatId,
              telegramError,
              leadId: 'lead_' + Date.now(),
            }));
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
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

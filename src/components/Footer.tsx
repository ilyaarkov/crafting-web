import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Send, Mail, Shield, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleTechStackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState({}, '', '/techstack');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <footer className="py-14 lg:py-20 border-t border-white/10 relative bg-[#040609]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          {/* Brand info */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xl font-bold text-white tracking-tight">
                {t.footer.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed [text-wrap:balance]">
              {t.footer.tagline}
            </p>
          </div>

          {/* Social and Action Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-300">
            <a
              href="https://t.me/ilyaarkovdotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>{t.footer.telegram}</span>
            </a>

            <a
              href="mailto:hello@ilyaarkov.com"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{t.footer.email}</span>
            </a>

            {/* Ссылка на отдельную страницу стека технологий /techstack */}
            <a
              href="/techstack"
              onClick={handleTechStackClick}
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer group"
            >
              <Code2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>{t.footer.techStack}</span>
            </a>

            <a
              href="/policy"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>{t.footer.privacy}</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{t.footer.copyright}</div>
          <div className="text-slate-600">
            {t.footer.name} &bull; Web Development
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

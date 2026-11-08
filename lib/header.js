// Hanzo's other header controls, as hanzo.ai shows them signed out (read 7 Nov 2026 with scripts/header-menus.mjs).
export const LOGIN = [
  { label: 'Hanzo', sub: 'Chat, Dev and Studio', href: '/login?next=%2Fchat' },
  { label: 'API Platform', sub: 'API keys, usage and billing', href: 'https://platform.hanzo.ai' },
];

// [flag, native name, English name, BCP 47 code]
export const LANGS = [
  ['🇸🇦', 'العربية', 'Arabic', 'ar'], ['🇪🇬', 'العربية (مصر)', 'Arabic (Egypt)', 'ar-EG'], ['🇱🇧', 'العربية (لبنان)', 'Arabic (Lebanon)', 'ar-LB'],
  ['🇸🇦', 'العربية (السعودية)', 'Arabic (Saudi Arabia)', 'ar-SA'], ['🇧🇩', 'বাংলা', 'Bangla', 'bn'], ['🇭🇰', '中文（香港）', 'Chinese (Hong Kong)', 'zh-HK'],
  ['🇨🇳', '中文（简体）', 'Chinese (Simplified)', 'zh-CN'], ['🇹🇼', '中文（繁體）', 'Chinese (Traditional)', 'zh-TW'], ['🇩🇰', 'dansk', 'Danish', 'da'],
  ['🇳🇱', 'Nederlands', 'Dutch', 'nl'], ['🇺🇸', 'English (United States)', 'English (United States)', 'en-US'], ['🇵🇭', 'Filipino', 'Filipino', 'fil'],
  ['🇫🇮', 'suomi', 'Finnish', 'fi'], ['🇨🇦', 'français (Canada)', 'French (Canada)', 'fr-CA'], ['🇫🇷', 'français (France)', 'French (France)', 'fr-FR'],
  ['🇩🇪', 'Deutsch (Deutschland)', 'German (Germany)', 'de-DE'], ['🇮🇳', 'ગુજરાતી', 'Gujarati', 'gu'], ['🇮🇱', 'עברית', 'Hebrew', 'he'],
  ['🇮🇳', 'हिन्दी (भारत)', 'Hindi (India)', 'hi-IN'], ['🇮🇩', 'Indonesia (Indonesia)', 'Indonesian (Indonesia)', 'id-ID'], ['🇮🇹', 'italiano (Italia)', 'Italian (Italy)', 'it-IT'],
  ['🇯🇵', '日本語 (日本)', 'Japanese (Japan)', 'ja-JP'], ['🇮🇳', 'ಕನ್ನಡ', 'Kannada', 'kn'], ['🇰🇷', '한국어(대한민국)', 'Korean (South Korea)', 'ko-KR'],
  ['🇲🇾', 'Melayu', 'Malay', 'ms'], ['🇮🇳', 'മലയാളം', 'Malayalam', 'ml'], ['🇮🇳', 'मराठी', 'Marathi', 'mr'], ['🇳🇴', 'norsk bokmål', 'Norwegian Bokmål', 'nb'],
  ['🇮🇷', 'فارسی', 'Persian', 'fa'], ['🇧🇷', 'português (Brasil)', 'Portuguese (Brazil)', 'pt-BR'], ['🇵🇹', 'português (Portugal)', 'Portuguese (Portugal)', 'pt-PT'],
  ['🇷🇺', 'русский', 'Russian', 'ru'], ['🇦🇷', 'español (Argentina)', 'Spanish (Argentina)', 'es-AR'], ['🌐', 'español (Latinoamérica)', 'Spanish (Latin America)', 'es-419'],
  ['🇲🇽', 'español (México)', 'Spanish (Mexico)', 'es-MX'], ['🇪🇸', 'español (España)', 'Spanish (Spain)', 'es-ES'], ['🇰🇪', 'Kiswahili', 'Swahili', 'sw'],
  ['🇸🇪', 'svenska', 'Swedish', 'sv'], ['🇮🇳', 'தமிழ்', 'Tamil', 'ta'], ['🇮🇳', 'తెలుగు', 'Telugu', 'te'], ['🇹🇭', 'ไทย', 'Thai', 'th'],
  ['🇹🇷', 'Türkçe', 'Turkish', 'tr'], ['🇺🇦', 'українська', 'Ukrainian', 'uk'], ['🇵🇰', 'اردو', 'Urdu', 'ur'], ['🇻🇳', 'Tiếng Việt', 'Vietnamese', 'vi'],
];
export const RTL = new Set(['ar', 'he', 'fa', 'ur']);

// The search palette's fixed groups (the "Pages" group is every page this site has, from content/pages.json)
export const SEARCH = [
  ['Open', [['Hanzo App', 'Build and ship apps', 'https://hanzo.app'], ['Hanzo Bot', 'Publish AI anywhere', '/bot'], ['Hanzo CLI', 'Hanzo from a terminal', '/cli'],
    ['Hanzo Dev', 'From the editor and terminal', '/dev'], ['Hanzo IDE', 'The workbench, on the web', '/ide'], ['Hanzo Platform', 'Deploy, observe, and operate', '/platform']]],
  ['Install', [['Desktop app', '', '/desktop'], ['Browser extension', '', '/extension'], ['SDKs', '', '/sdks'], ['All downloads', '', '/download']]],
  ['Research', [['Specifications', '', 'https://hips.hanzo.ai']]],
  ['Products', [['Hanzo App', '', 'https://hanzo.app'], ['Release notes', '', 'https://github.com/hanzoai/cli/releases']]],
  ['Developers', [['Developers', '', 'https://docs.hanzo.ai'], ['Open models', '', 'https://huggingface.co/zenlm'], ['API keys', '', 'https://platform.hanzo.ai/api-keys'],
    ['Claude Code, Codex, Cursor', '', 'https://platform.hanzo.ai/accelerate'], ['GitHub', '', 'https://github.com/hanzoai'], ['Status', '', 'https://status.hanzo.ai']]],
  ['Learn', [['Education', '', 'https://hanzo.university']]],
];

export const COOKIES = {
  notice: 'Essential cookies keep Hanzo running. With your OK, optional cookies help us measure performance and ads.',
  title: 'Cookie Preferences',
  body: 'We use cookies and similar technologies to provide our services, measure performance, and support advertising. Essential cookies are required for the site to work and cannot be turned off. You can allow or reject optional cookies below.',
  kinds: [['necessary', 'Strictly Necessary Cookies'], ['performance', 'Performance Cookies'], ['marketing', 'Marketing Cookies'], ['sale', 'Sell, Share, or Use Your Data for Targeted Advertising']],
};

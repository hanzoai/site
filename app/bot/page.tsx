// Signature: The org chart is the hero: a person mentions a bot, a packet runs down the chart to that bot and across to the teammate who verifies it, while the thread fills in beneath, ten channels in turn
// Beyond: How many bots do you need? Slide 1 to 10 and the smallest plan that includes that many resident bots lights up, from Hanzo's plan list
import Bot from '../../components/pages/Bot';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Hanzo Bot — AI teammates you can hand real work to — Hanzo AI', description: 'Give a bot a job. It has its own computer, signs in to your tools, and comes back when the work is done. On your machine, in our cloud, or both.' };

export default function Page() {
  return <><JsonLd route="/bot" /><Bot /></>;
}

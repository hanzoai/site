/* With JavaScript off (crawlers, agents, readers who block scripts), every word on the models pages is still shown:
   the entrance states motion writes into the server HTML are reset, and the pinned scenes lie flat. Written with the
   shared <NoJs> (a plain <style> scoped under html:not(.js)), never a <noscript>, so nothing can fail to hydrate. */
import NoJs from '../../NoJs';

const CSS = `
.xmo [style*="opacity:0"],.xmf [style*="opacity:0"]{opacity:1!important}
.xmo .x-line-in,.xmf .x-line-in,.xmo [style*="translateY"],.xmf [style*="translateY"]{transform:none!important}
.xmo-stage,.xmo-fam{height:auto!important}.xmo-pin,.xmo-fam-pin{position:static!important;height:auto!important}
.xmo-stage-g{padding:72px 0}.xmo-area{height:calc(100svh - 132px)}
.xmo-fam-bg{clip-path:none!important}.xmo-fam-g{display:block!important;padding:120px 0}
.xmo-fam-list{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;margin-top:56px}
.xmo-fam-c{position:static!important;display:block!important}.xmo-fam-film{height:auto!important;aspect-ratio:4/5;clip-path:none!important}
.xmo-fam-t{opacity:1!important;visibility:visible!important;transform:none!important;padding:24px 0 0!important}.xmo-fam-h span{opacity:1!important}
.xmo-bars i::after{transform:scaleX(var(--v))!important}.xmo-table tr[hidden]{display:table-row!important}
`;
export default function NoScript() {
  return <NoJs css={CSS} />;
}

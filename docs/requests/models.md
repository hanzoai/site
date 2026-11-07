# Requests from /models and the /models/* template (Models chat)

1. **Kit `Film`: a `play` prop and a page-wide budget of two playing films** (PLAN-COMPONENTS 2.10). The model pages need the page to say which film is live: the lit card, the active chapter, a hovered card. Until then `components/v2/ModelFilm.jsx` keeps the kit rules (poster first, near-screen loading, on-screen only, reduced motion and Save-Data) and adds `play`, the budget and `FilmPause`. Once kit `Film` has these, ModelFilm becomes a two-line wrapper.
2. **One `ModelCard` (MASTER.md part 15).** `components/pages/model/ModelCards.jsx` (Zen-names chat) and `components/v2/SpecCard.jsx` (mine) both draw the `SPEC.md` card. The kit owner could lift SpecCard's markup and `useSpecTilt` into the kit and have both use it.
3. **`DataTable` and `CodeBlock`.** /models has a price table and four code samples; model pages have spec tables and the quick start. They are page-local until the kit parts land.
4. **`lib/cta.js` and `lib/track.js`.** Primaries already carry `data-cta` (`models.hero`, `models.try`, `model.hero`, `model.local`, `model.band`, `maker.hero`, `maker.band`) and `data-thumb`.

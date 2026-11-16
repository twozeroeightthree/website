// Home page carousel. Without JS the rail is a plain horizontal scroller;
// this adds the arrows, page indicators and the "expanded" mode where the
// intro text makes room for the rail (reversible, kept in the URL).

const wide = matchMedia("(min-width: 56rem)");
const HASH = "#works";

export function initRail(root: HTMLElement) {
  const rail = root.querySelector<HTMLElement>(".rail")!;
  const controls = root.querySelector<HTMLElement>(".rail-controls")!;
  const prev = root.querySelector<HTMLButtonElement>(".rail-prev")!;
  const next = root.querySelector<HTMLButtonElement>(".rail-next")!;
  const pagesEl = root.querySelector<HTMLElement>(".rail-pages")!;
  const layout = root.closest<HTMLElement>(".layout")!;
  const about = layout.querySelector<HTMLButtonElement>(".about-toggle");
  const cards = [...rail.children] as HTMLElement[];

  const step = () => cards[0].offsetWidth + parseFloat(getComputedStyle(rail).columnGap || "0");
  const perPage = () => Math.max(1, Math.floor((rail.clientWidth + 1) / step()));
  const pageCount = () => Math.ceil(cards.length / perPage());
  const maxScroll = () => rail.scrollWidth - rail.clientWidth;
  const pageOffset = (i: number) => Math.min(i * perPage() * step(), maxScroll());
  const currentPage = () =>
    rail.scrollLeft >= maxScroll() - 1
      ? pageCount() - 1
      : Math.round(rail.scrollLeft / (perPage() * step()));
  const isExpanded = () => layout.hasAttribute("data-expanded");

  function saveState() {
    const url = isExpanded() ? HASH : location.pathname + location.search;
    history.replaceState({ ...history.state, rail: { x: rail.scrollLeft } }, "", url);
  }

  function setExpanded(on: boolean) {
    layout.toggleAttribute("data-expanded", on);
    if (about) about.hidden = !on;
    prev.hidden = !on;
    saveState();
  }

  let built = 0;
  function renderPages() {
    const n = pageCount();
    if (n !== built) {
      pagesEl.replaceChildren(
        ...Array.from({ length: n }, (_, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", `Page ${i + 1} of ${n}`);
          b.addEventListener("click", () => {
            if (!isExpanded()) setExpanded(true);
            // wait for the wider rail before measuring
            requestAnimationFrame(() => rail.scrollTo({ left: pageOffset(i) }));
          });
          return b;
        }),
      );
      built = n;
    }
    const active = currentPage();
    pagesEl.querySelectorAll("button").forEach((b, i) => {
      b.setAttribute("aria-current", String(i === active));
    });
  }

  next.addEventListener("click", () => {
    if (!isExpanded()) return setExpanded(true);
    const atEnd = rail.scrollLeft >= maxScroll() - 1;
    rail.scrollTo({ left: atEnd ? 0 : pageOffset(currentPage() + 1) });
  });

  prev.addEventListener("click", () => {
    if (rail.scrollLeft <= 1) return setExpanded(false);
    rail.scrollTo({ left: pageOffset(Math.max(0, currentPage() - 1)) });
  });

  about?.addEventListener("click", () => {
    setExpanded(false);
    rail.scrollTo({ left: 0 });
    layout.querySelector<HTMLElement>(".panel")?.focus();
  });

  let frame = 0;
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(renderPages);
  };
  rail.addEventListener("scroll", update, { passive: true });
  rail.addEventListener("scrollend", saveState);
  new ResizeObserver(update).observe(rail);

  // Coming back to the page (reload or history without bfcache)
  if (location.hash === HASH && wide.matches) {
    // read before setExpanded, which saves the current (still 0) position
    const x = history.state?.rail?.x ?? 0;
    layout.setAttribute("data-no-transition", "");
    setExpanded(true);
    rail.scrollLeft = x;
    requestAnimationFrame(() => layout.removeAttribute("data-no-transition"));
  } else {
    prev.hidden = true;
  }

  controls.hidden = false;
  renderPages();
}

/* Hanzo's own header and footer markup, rendered on the server only (no 'use client'). They used to be rendered by
   the client Chrome.jsx, which put all of content.js (375 KB: header, footer and the home page's data) into every
   page's JavaScript. Now the HTML arrives in the page and costs no JS; components/Chrome.jsx attaches the behaviour
   (scrolled hairline, dark rooms, menus, search, the footer wordmark) to it by selector. Mounted by app/layout.jsx. */
import C from '../content';

export function HeaderHTML() {
  return <div data-x-shell="header" style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: C.header }} />;
}

export function FooterHTML() {
  return <div data-x-shell="footer" style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: C.footer }} />;
}

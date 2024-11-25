import styled, { createGlobalStyle } from 'styled-components';
import { io } from 'socket.io-client';
import Router from './Router';
import { useEffect } from 'react';
import { initSocket } from './sockets/socket';

const GlobalStyle = createGlobalStyle`

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
    font-family: "Source Sans 3", sans-serif;
    width: 375px;
    height: 667px;
    border: 1px solid #dfdfdf;
    margin: 30px auto 0;
    position:relative;
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
    font-size: 10px; /** 10px === 1rem */
    font-family: Arial, Helvetica, sans-serif;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  #root-modal {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle></GlobalStyle>
      <Router></Router>
    </>
  );
}

export default App;

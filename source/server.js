import http from 'http';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter} from 'react-router-dom';
// import { ServerRouter, createServerRenderContext } from 'react-router';

import Pages from './pages/containers/Page.jsx';
import Layout from './pages/components/Layout.jsx';

function requestHandler(request, response) {
  const context = {};

  // let html = renderToString(<Provider store={store}>
  //     <IntlProvider locale={locale}messages={messages[locale]}>
  //       <StaticRouter location={request.url}context={context}>
  //         <Pages />
  //       </StaticRouter>
  //     </IntlProvider>
  //   </Provider>,);
  let html = renderToString(
    <StaticRouter location={request.url}context={context}>
      <Pages />
    </StaticRouter>
  );

  response.setHeader('Content-Type', 'text/html');

  if(context.redirect) {
    response.writeHead(301, {
      Location: result.redirect.pathname,
    });
    response.end();
  }

  if(context.url) {
    response.writeHead(301, {
      Location: context.url,
    });
    response.end();

    html = renderToString(
      <ServerRouter location={request.url} context={context}>
        <Pages />
      </ServerRouter>
    );
  }

  response.write(
    renderToStaticMarkup(
      <Layout
        title = "Aplicación"
        content = {html}
      />
    )
  );
  response.end();
}


const server = http.createServer(requestHandler);

server.listen(3000);

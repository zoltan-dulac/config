
/* eslint-disable no-console */

const jsTestLoader = (element, props) => {
  return new Promise((resolve, reject) =>
    require.ensure([], (require) => {
      const jsTest = require('./index').default;
      const renderReactComponent = require('utils/reactComponentLoader').default;
      let returnPromise;
      if (typeof element !== 'undefined' && typeof props !== 'undefined') {
        if (!element.hasAttribute('data-has-dynamically-rendered')) {
          // only try to render it once
          element.setAttribute('data-has-dynamically-rendered', '');

          // if (!props.hasOwnProperty('children')) {
          if (!Object.prototype.hasOwnProperty.call(props, 'children')) {
            props.children = element.getAttribute('title') || element.getAttribute('data-title');

            element.removeAttribute('title');
          }

          returnPromise = renderReactComponent(jsTest, element, props)
            .then(resolve)
            .catch(reject);
        } else {
          returnPromise = resolve();
        }
      } else {
        returnPromise = resolve(jsTest);
      }
      return returnPromise;
    }, 'LazyLoadingDemo')
  ).catch((err) => {
    console.log(err);
  });
};

export default jsTestLoader;

// src/jsx-runtime-fix.js
import React from 'react';
import * as runtime from 'react/jsx-runtime';

// Some environments/chunk combos can end up with missing or wrong exports.
// This shim guarantees jsx/jsxs exist and forwards to the real runtime.

const realJSX  = runtime.jsx  || (runtime.default && runtime.default.jsx);
const realJSXS = runtime.jsxs || (runtime.default && runtime.default.jsxs);

export const Fragment = runtime.Fragment || React.Fragment;
export const jsx  = realJSX  || ((type, props, key) => React.createElement(type, { ...props, key }));
export const jsxs = realJSXS || jsx;

export default { Fragment, jsx, jsxs };

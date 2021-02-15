# app-serve
Serve your app for production.

![Actions](https://github.com/jleeson/app-serve/workflows/build/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jleeson/app-serve/blob/master/LICENSE)
[![Donate](https://img.shields.io/badge/patreon-donate-green.svg)](https://www.patreon.com/outwalkstudios)

---

## Usage

```js
import serve from "app-serve";

/* serve a static directory */
serve("dist");

/* serve with options */
serve({
    contentBase: "dist",
    historyApiFallback: true
});
```

---

## Options

### verbose

Type: `boolean`
Default: `true`

Show server address in console.

### contentBase

Type: `string` or `string[]`
Default: ` `

Folder(s) to serve files from.

### historyApiFallback

Type: `boolean` or `string`
Default: `false`

Fallback to serving `index.html` or the path to fallback on.

### host

Type: `string`
Default: `localhost`

Server host.

### port

Type: `number`
Default: `3000`

Server port.

### https

Type: `HTTPSCert`
Default: `false`

certs to enable the server to use https, by default uses http.

### headers

Type: `Object<string, string>`
Default: `{}`

Set headers to be used with each request/response

### mimeTypes

Type: `Object<string, string>`
Default: `{}`

Additional mime types to recognize.

### onListening

Type: `Function`
Default: `null`

Execute a functino when the server starts.

---

## Why

When building an app with rollup, its common to use [rollup-plugin-serve](https://github.com/thgh/rollup-plugin-serve). This package aims to replicate its functionality outside of rollup for use in production builds. The benefit of this is that your development and production builds will be running in the same http server so you dont have to worry about inconsistancies with other http servers.

---

## Reporting Issues

If you are having trouble getting something to work with app-serve or run into any problems, you can create a new [Issue](https://github.com/jleeson/app-serve/issues).

If this package does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

---

## License

app-serve is licensed under the terms of the [**MIT**](https://github.com/jleeson/app-serve/blob/master/LICENSE) license.


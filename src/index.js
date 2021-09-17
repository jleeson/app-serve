import fs from "fs";
import https from "https";
import http from "http";
import path from "path";
import mime from "mime";

/* web server function */
export default function serve(options = { contentBase: "" }) {
    let server;

    if (Array.isArray(options) || typeof options == "string") {
        options = { contentBase: options };
    }

    /* initialize default options */
    options.contentBase = Array.isArray(options.contentBase) ? options.contentBase : [options.contentBase || ""];
    options.port = options.port || 3000;
    options.headers = options.headers || {};
    options.https = options.https || false;
    options.onListening = options.onListening || function noop() { };
    mime.default_type = "text/plain";

    if (options.mimeTypes) {
        mime.define(options.mimeTypes, true);
    }

    /* create the request listener */
    const requestListener = (request, response) => {
        const unsafePath = decodeURI(request.url.split("?")[0]);

        const urlPath = path.posix.normalize(unsafePath);

        const headers = Object.keys(options.headers);

        for(let header of headers) {
            response.setHeader(header, options.headers[header]);
        }

        readFileFromContentBase(options.contentBase, urlPath, (error, content, filePath) => {
            if (!error) {
                return found(response, filePath, content);
            }

            if (error.code !== "ENOENT") {
                response.writeHead(500);
                response.end(
                    "500 Internal Server Error" +
                    "\n\n" + filePath +
                    "\n\n" + Object.values(error).join("\n") +
                    "\n\n(app-serve)",
                    "utf8"
                );
                return;
            }

            /* if request was not found, but history fallback is enabled, respond with the history fallback */
            if (options.historyApiFallback) {
                const fallbackPath = typeof options.historyApiFallback == "string" ? options.historyApiFallback : "/index.html";
                readFileFromContentBase(options.contentBase, fallbackPath, (error, content, filePath) => {
                    if (error) {
                        notFound(response, filePath);
                    } else {
                        found(response, filePath, content);
                    }
                });
            } else {
                notFound(response, filePath);
            }
        });
    };

    /* release the server resources when the server is terminated */
    const terminationSignals = ["SIGINT", "SIGTERM", "SIGQUIT", "SIGHUP"];

    for(let signal of terminationSignals) {
        process.on(signal, () => {
            if (server) {
                server.close();
                process.exit();
            }
        });
    }

    /* create and start the http server */
    server = options.https
        ? https.createServer(options.https, requestListener)
        : http.createServer(requestListener);

    server.listen(options.port, options.host, () => options.onListening(server));

    /* handle error messages */
    const url = `${(options.https ? "https" : "http")}://${(options.host || "localhost")}:${options.port}`;

    server.on("error", (error) => {
        if (error.code == "EADDRINUSE") {
            console.error(`${url} is already in use, either stop the other server or use a different port.`);
            process.exit();
        } else {
            throw error;
        }
    });

    if (options.verbose) {
        for(let base of options.contentBase) {
            /* print the url as green */
            console.log(`\u001b[1m\u001b[32m${url}\u001b[39m\u001b[22m` + " -> " + path.resolve(base));
        }
    }
}

/* load a file from the content base */
function readFileFromContentBase(contentBase, urlPath, callback) {
    let filePath = path.resolve(contentBase[0] || ".", "." + urlPath);

    /* if the url is a directory, load the directory index.html */
    if(fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.resolve(filePath, "index.html");
    }

    fs.readFile(filePath, (error, content) => {
        if (error && contentBase.length > 1) {
            readFileFromContentBase(contentBase.slice(1), urlPath, callback);
        } else {
            callback(error, content, filePath);
        }
    });
}

/* response with a 404 */
function notFound(response, filePath) {
    response.writeHead(404);
    response.end(
        "404 Not Found" +
        "\n\n" + filePath +
        "\n\n(app-serve)",
        "utf8"
    );
}

/* respond with a 200 */
function found(response, filePath, content) {
    response.writeHead(200, { "Content-Type": mime.getType(filePath) });
    response.end(content, "utf8");
}
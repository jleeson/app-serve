declare interface HTTPSCert {
    key: string | Buffer;
    cert: string | Buffer;
    ca?: string | Buffer;
};

declare interface Options {
    verbose?: boolean;
    contentBase?: string | string[];
    historyApiFallback?: boolean | string;
    host?: string;
    port?: number;
    https?: HTTPSCert;
    headers?: Object<string, string>;
    mimeTypes?: Object<string, string>;
    onListening?: Function;
};

export default function (options?: Options | string): void;
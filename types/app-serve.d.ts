declare module "app-serve" {
    interface HTTPSCert {
        key: string | Buffer;
        cert: string | Buffer;
        ca?: string | Buffer;
    }

    interface StringMap {
        [key: string]: string;
    }

    interface Options {
        verbose?: boolean;
        contentBase?: string | string[];
        historyApiFallback?: boolean | string;
        host?: string;
        port?: number;
        https?: HTTPSCert;
        headers?: StringMap;
        mimeTypes?: StringMap;
        onListening?: Function;
    }

    export default function (options?: Options | string): void;
}
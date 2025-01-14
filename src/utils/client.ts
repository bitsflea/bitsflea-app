import jaysonPromiseBrowserClient from "jayson/promise/lib/client/browser";
// import fetch from 'node-fetch';
import config from "../data/config";

let client: jaysonPromiseBrowserClient;

const callServer = function (request: any) {
    const options = {
        method: 'POST',
        body: request,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    return fetch(config.apiRPC, options).then(res => res.text());
};

export const getClient = () => {
    if (!client) {
        client = new jaysonPromiseBrowserClient(callServer, {});
    }

    return client;
};

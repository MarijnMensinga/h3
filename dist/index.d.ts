import { QueryObject } from 'ufo';
import { IncomingMessage, ServerResponse, OutgoingMessage } from 'node:http';
export { IncomingMessage as NodeIncomingMessage, ServerResponse as NodeServerResponse } from 'node:http';
import { CookieSerializeOptions } from 'cookie-es';
import { SealOptions } from 'iron-webcrypto';
import { Readable } from 'node:stream';

type NodeListener = (req: IncomingMessage, res: ServerResponse) => void;
type NodePromisifiedHandler = (req: IncomingMessage, res: ServerResponse) => Promise<any>;
type NodeMiddleware = (req: IncomingMessage, res: ServerResponse, next: (err?: Error) => any) => any;
declare const defineNodeListener: (handler: NodeListener) => NodeListener;
declare const defineNodeMiddleware: (middleware: NodeMiddleware) => NodeMiddleware;
declare function fromNodeMiddleware(handler: NodeListener | NodeMiddleware): EventHandler;
declare function toNodeListener(app: App): NodeListener;
declare function promisifyNodeListener(handler: NodeListener | NodeMiddleware): NodePromisifiedHandler;
declare function callNodeListener(handler: NodeMiddleware, req: IncomingMessage, res: ServerResponse): Promise<unknown>;

interface NodeEventContext {
    req: IncomingMessage & {
        originalUrl?: string;
    };
    res: ServerResponse;
}
interface WebEventContext {
    request?: Request;
    url?: URL;
}
declare class H3Event<_RequestT extends EventHandlerRequest = EventHandlerRequest> implements Pick<FetchEvent, "respondWith"> {
    "__is_event__": boolean;
    node: NodeEventContext;
    web?: WebEventContext;
    context: H3EventContext;
    _method?: HTTPMethod;
    _path?: string;
    _headers?: Headers;
    _requestBody?: BodyInit;
    _handled: boolean;
    constructor(req: IncomingMessage, res: ServerResponse);
    get method(): HTTPMethod;
    get path(): string;
    get headers(): Headers;
    get handled(): boolean;
    respondWith(response: Response | PromiseLike<Response>): Promise<void>;
    toString(): string;
    toJSON(): string;
    /** @deprecated Please use `event.node.req` instead. **/
    get req(): IncomingMessage & {
        originalUrl?: string | undefined;
    };
    /** @deprecated Please use `event.node.res` instead. **/
    get res(): ServerResponse<IncomingMessage>;
}
declare function isEvent(input: any): input is H3Event;
declare function createEvent(req: IncomingMessage, res: ServerResponse): H3Event;

declare function defineEventHandler<Request extends EventHandlerRequest = EventHandlerRequest, Response = EventHandlerResponse>(handler: EventHandler<Request, Response> | EventHandlerObject<Request, Response>): EventHandler<Request, Response>;
declare function defineEventHandler<Request = EventHandlerRequest, Response = EventHandlerResponse>(handler: EventHandler<Request extends EventHandlerRequest ? Request : EventHandlerRequest, Request extends EventHandlerRequest ? Response : Request>): EventHandler<Request extends EventHandlerRequest ? Request : EventHandlerRequest, Request extends EventHandlerRequest ? Response : Request>;
declare const eventHandler: typeof defineEventHandler;
declare function defineRequestMiddleware<Request extends EventHandlerRequest = EventHandlerRequest>(fn: _RequestMiddleware<Request>): _RequestMiddleware<Request>;
declare function defineResponseMiddleware<Request extends EventHandlerRequest = EventHandlerRequest>(fn: _ResponseMiddleware<Request>): _ResponseMiddleware<Request>;
declare function isEventHandler(input: any): input is EventHandler;
declare function toEventHandler(input: any, _?: any, _route?: string): EventHandler;
interface DynamicEventHandler extends EventHandler {
    set: (handler: EventHandler) => void;
}
declare function dynamicEventHandler(initial?: EventHandler): DynamicEventHandler;
declare function defineLazyEventHandler<T extends LazyEventHandler>(factory: T): Awaited<ReturnType<T>>;
declare const lazyEventHandler: typeof defineLazyEventHandler;

/**
 * @deprecated Please use native web Headers
 * https://developer.mozilla.org/en-US/docs/Web/API/Headers
 */
declare class H3Headers implements Headers {
    _headers: Record<string, string>;
    constructor(init?: HeadersInit);
    [Symbol.iterator](): IterableIterator<[string, string]>;
    entries(): IterableIterator<[string, string]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callbackfn: (value: string, key: string, parent: Headers) => void): void;
}

/**
 * @deprecated Please use native web Response
 * https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
declare class H3Response implements Response {
    readonly headers: H3Headers;
    readonly status: number;
    readonly statusText: string;
    readonly redirected: boolean;
    readonly ok: boolean;
    readonly url: string;
    _body: string | ArrayBuffer | Uint8Array;
    readonly body: ReadableStream<Uint8Array> | null;
    readonly type: ResponseType;
    readonly bodyUsed = false;
    constructor(body?: BodyInit | EventHandlerResponse | null, init?: ResponseInit);
    clone(): H3Response;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json<T = any>(): Promise<T>;
    text(): Promise<string>;
}

type SessionDataT = Record<string, any>;
type SessionData<T extends SessionDataT = SessionDataT> = T;
interface Session<T extends SessionDataT = SessionDataT> {
    id: string;
    createdAt: number;
    data: SessionData<T>;
}
interface SessionConfig {
    /** Private key used to encrypt session tokens */
    password: string;
    /** Session expiration time in seconds */
    maxAge?: number;
    /** default is h3 */
    name?: string;
    /** Default is secure, httpOnly, / */
    cookie?: false | CookieSerializeOptions;
    /** Default is x-h3-session / x-{name}-session */
    sessionHeader?: false | string;
    seal?: SealOptions;
    crypto?: Crypto;
    /** Default is Crypto.randomUUID */
    generateId?: () => string;
}
declare function useSession<T extends SessionDataT = SessionDataT>(event: H3Event, config: SessionConfig): Promise<{
    readonly id: string | undefined;
    readonly data: T;
    update: (update: SessionUpdate<T>) => Promise<any>;
    clear: () => Promise<any>;
}>;
declare function getSession<T extends SessionDataT = SessionDataT>(event: H3Event, config: SessionConfig): Promise<Session<T>>;
type SessionUpdate<T extends SessionDataT = SessionDataT> = Partial<SessionData<T>> | ((oldData: SessionData<T>) => Partial<SessionData<T>> | undefined);
declare function updateSession<T extends SessionDataT = SessionDataT>(event: H3Event, config: SessionConfig, update?: SessionUpdate<T>): Promise<Session<T>>;
declare function sealSession<T extends SessionDataT = SessionDataT>(event: H3Event, config: SessionConfig): Promise<string>;
declare function unsealSession(_event: H3Event, config: SessionConfig, sealed: string): Promise<Partial<Session<SessionDataT>>>;
declare function clearSession(event: H3Event, config: Partial<SessionConfig>): Promise<void>;

type RouterMethod = Lowercase<HTTPMethod>;
type RouterUse = (path: string, handler: EventHandler, method?: RouterMethod | RouterMethod[]) => Router;
type AddRouteShortcuts = Record<RouterMethod, RouterUse>;
interface Router extends AddRouteShortcuts {
    add: RouterUse;
    use: RouterUse;
    handler: EventHandler;
}
interface RouteNode {
    handlers: Partial<Record<RouterMethod | "all", EventHandler>>;
    path: string;
}
interface CreateRouterOptions {
    /** @deprecated Please use `preemptive` instead. **/
    preemtive?: boolean;
    preemptive?: boolean;
}
declare function createRouter(opts?: CreateRouterOptions): Router;

type ValidateResult<T> = T | true | false | void;
type ValidateFunction<T> = (data: unknown) => ValidateResult<T> | Promise<ValidateResult<T>>;

type HTTPMethod = "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE";
type Encoding = false | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";
interface H3EventContext extends Record<string, any> {
    params?: Record<string, string>;
    /**
     * Matched router Node
     *
     * @experimental The object structure may change in non-major version.
     */
    matchedRoute?: RouteNode;
    sessions?: Record<string, Session>;
    clientAddress?: string;
}
type EventHandlerResponse<T = any> = T | Promise<T>;
interface EventHandlerRequest {
    body?: any;
    query?: QueryObject;
}
type InferEventInput<Key extends keyof EventHandlerRequest, Event extends H3Event, T> = void extends T ? (Event extends H3Event<infer E> ? E[Key] : never) : T;
interface EventHandler<Request extends EventHandlerRequest = EventHandlerRequest, Response extends EventHandlerResponse = EventHandlerResponse> {
    __is_handler__?: true;
    (event: H3Event<Request>): Response;
}
type _RequestMiddleware<Request extends EventHandlerRequest = EventHandlerRequest> = (event: H3Event<Request>) => void | Promise<void>;
type _ResponseMiddleware<Request extends EventHandlerRequest = EventHandlerRequest, Response extends EventHandlerResponse = EventHandlerResponse> = (event: H3Event<Request>, response: {
    body?: Awaited<Response>;
}) => void | Promise<void>;
type EventHandlerObject<Request extends EventHandlerRequest = EventHandlerRequest, Response extends EventHandlerResponse = EventHandlerResponse> = {
    onRequest?: _RequestMiddleware<Request> | _RequestMiddleware<Request>[];
    onBeforeResponse?: _ResponseMiddleware<Request, Response> | _ResponseMiddleware<Request, Response>[];
    handler: EventHandler<Request, Response>;
};
type LazyEventHandler = () => EventHandler | Promise<EventHandler>;
type RequestHeaders = {
    [name: string]: string | undefined;
};

interface Layer {
    route: string;
    match?: Matcher;
    handler: EventHandler;
}
type Stack = Layer[];
interface InputLayer {
    route?: string;
    match?: Matcher;
    handler: EventHandler;
    lazy?: boolean;
}
type InputStack = InputLayer[];
type Matcher = (url: string, event?: H3Event) => boolean;
interface AppUse {
    (route: string | string[], handler: EventHandler | EventHandler[], options?: Partial<InputLayer>): App;
    (handler: EventHandler | EventHandler[], options?: Partial<InputLayer>): App;
    (options: InputLayer): App;
}
interface AppOptions {
    debug?: boolean;
    onError?: (error: Error, event: H3Event) => any;
    onRequest?: (event: H3Event) => void | Promise<void>;
    onBeforeResponse?: (event: H3Event, response: {
        body?: unknown;
    }) => void | Promise<void>;
    onAfterResponse?: (event: H3Event, response?: {
        body?: unknown;
    }) => void | Promise<void>;
}
interface App {
    stack: Stack;
    handler: EventHandler;
    options: AppOptions;
    use: AppUse;
}
declare function createApp(options?: AppOptions): App;
declare function use(app: App, arg1: string | EventHandler | InputLayer | InputLayer[], arg2?: Partial<InputLayer> | EventHandler | EventHandler[], arg3?: Partial<InputLayer>): App;
declare function createAppEventHandler(stack: Stack, options: AppOptions): EventHandler<EventHandlerRequest, Promise<void>>;

/**
 * H3 Runtime Error
 * @class
 * @extends Error
 * @property {number} statusCode - An integer indicating the HTTP response status code.
 * @property {string} statusMessage - A string representing the HTTP status message.
 * @property {boolean} fatal - Indicates if the error is a fatal error.
 * @property {boolean} unhandled - Indicates if the error was unhandled and auto captured.
 * @property {any} data - An extra data that will be included in the response.
 *                         This can be used to pass additional information about the error.
 * @property {boolean} internal - Setting this property to `true` will mark the error as an internal error.
 */
declare class H3Error extends Error {
    static __h3_error__: boolean;
    statusCode: number;
    fatal: boolean;
    unhandled: boolean;
    statusMessage?: string;
    data?: any;
    cause?: unknown;
    constructor(message: string, opts?: {
        cause?: unknown;
    });
    toJSON(): Pick<H3Error, "data" | "statusCode" | "statusMessage" | "message">;
}
/**
 * Creates a new `Error` that can be used to handle both internal and runtime errors.
 *
 * @param input {string | (Partial<H3Error> & { status?: number; statusText?: string })} - The error message or an object containing error properties.
 * @return {H3Error} - An instance of H3Error.
 */
declare function createError(input: string | (Partial<H3Error> & {
    status?: number;
    statusText?: string;
})): H3Error;
/**
 * Receives an error and returns the corresponding response.
 * H3 internally uses this function to handle unhandled errors.
 * Note that calling this function will close the connection and no other data will be sent to the client afterwards.
 *
 * @param event {H3Event} - H3 event or req passed by h3 handler.
 * @param error {Error | H3Error} - The raised error.
 * @param debug {boolean} - Whether the application is in debug mode.
 * In the debug mode, the stack trace of errors will be returned in the response.
 */
declare function sendError(event: H3Event, error: Error | H3Error, debug?: boolean): void;
/**
 * Checks if the given input is an instance of H3Error.
 *
 * @param input {*} - The input to check.
 * @return {boolean} - Returns true if the input is an instance of H3Error, false otherwise.
 */
declare function isError(input: any): input is H3Error;

declare function useBase(base: string, handler: EventHandler): EventHandler;

interface MultiPartData {
    data: Buffer;
    name?: string;
    filename?: string;
    type?: string;
}

/**
 * Reads body of the request and returns encoded raw string (default), or `Buffer` if encoding is falsy.
 * @param event {H3Event} H3 event or req passed by h3 handler
 * @param encoding {Encoding} encoding="utf-8" - The character encoding to use.
 *
 * @return {String|Buffer} Encoded raw string or raw Buffer of the body
 */
declare function readRawBody<E extends Encoding = "utf8">(event: H3Event, encoding?: E): E extends false ? Promise<Buffer | undefined> : Promise<string | undefined>;
/**
 * Reads request body and tries to safely parse using [destr](https://github.com/unjs/destr).
 * @param event {H3Event} H3 event passed by h3 handler
 * @param encoding {Encoding} encoding="utf-8" - The character encoding to use.
 *
 * @return {*} The `Object`, `Array`, `String`, `Number`, `Boolean`, or `null` value corresponding to the request JSON body
 *
 * ```ts
 * const body = await readBody(event)
 * ```
 */
declare function readBody<T, Event extends H3Event = H3Event, _T = InferEventInput<"body", Event, T>>(event: Event, options?: {
    strict?: boolean;
}): Promise<_T>;
declare function readValidatedBody<T, Event extends H3Event = H3Event, _T = InferEventInput<"body", Event, T>>(event: Event, validate: ValidateFunction<_T>): Promise<_T>;
declare function readMultipartFormData(event: H3Event): Promise<MultiPartData[] | undefined>;
/**
 * Constructs a FormData object from an event.
 * @param event {H3Event}
 * @returns {FormData}
 *
 * ```ts
 * const eventHandler = event => {
 *   const formData = await readFormData(event)
 *   const email = formData.get("email")
 *   const password = formData.get("password")
 *  }
 * ```
 */
declare function readFormData(event: H3Event): Promise<FormData>;
declare function getRequestWebStream(event: H3Event): undefined | ReadableStream;

interface CacheConditions {
    modifiedTime?: string | Date;
    maxAge?: number;
    etag?: string;
    cacheControls?: string[];
}
/**
 * Check request caching headers (`If-Modified-Since`) and add caching headers (Last-Modified, Cache-Control)
 * Note: `public` cache control will be added by default
 * @returns `true` when cache headers are matching. When `true` is returned, no reponse should be sent anymore
 */
declare function handleCacheHeaders(event: H3Event, opts: CacheConditions): boolean;

declare const MIMES: {
    html: string;
    json: string;
};

interface H3CorsOptions {
    origin?: "*" | "null" | (string | RegExp)[] | ((origin: string) => boolean);
    methods?: "*" | HTTPMethod[];
    allowHeaders?: "*" | string[];
    exposeHeaders?: "*" | string[];
    credentials?: boolean;
    maxAge?: string | false;
    preflight?: {
        statusCode?: number;
    };
}

declare function handleCors(event: H3Event, options: H3CorsOptions): boolean;

declare function getQuery<T, Event extends H3Event = H3Event, _T = Exclude<InferEventInput<"query", Event, T>, undefined>>(event: Event): _T;
declare function getValidatedQuery<T, Event extends H3Event = H3Event, _T = InferEventInput<"query", Event, T>>(event: Event, validate: ValidateFunction<_T>): Promise<_T>;
declare function getRouterParams(event: H3Event): NonNullable<H3Event["context"]["params"]>;
declare function getRouterParam(event: H3Event, name: string): string | undefined;
/**
 * @deprecated Directly use `event.method` instead.
 */
declare function getMethod(event: H3Event, defaultMethod?: HTTPMethod): HTTPMethod;
declare function isMethod(event: H3Event, expected: HTTPMethod | HTTPMethod[], allowHead?: boolean): boolean;
declare function assertMethod(event: H3Event, expected: HTTPMethod | HTTPMethod[], allowHead?: boolean): void;
declare function getRequestHeaders(event: H3Event): RequestHeaders;
declare const getHeaders: typeof getRequestHeaders;
declare function getRequestHeader(event: H3Event, name: string): RequestHeaders[string];
declare const getHeader: typeof getRequestHeader;
declare function getRequestHost(event: H3Event, opts?: {
    xForwardedHost?: boolean;
}): string;
declare function getRequestProtocol(event: H3Event, opts?: {
    xForwardedProto?: boolean;
}): "https" | "http";
/** @deprecated Use `event.path` instead */
declare function getRequestPath(event: H3Event): string;
declare function getRequestURL(event: H3Event, opts?: {
    xForwardedHost?: boolean;
    xForwardedProto?: boolean;
}): URL;
declare function toWebRequest(event: H3Event): Request;
declare function getRequestIP(event: H3Event, opts?: {
    /**
     * Use the X-Forwarded-For HTTP header set by proxies.
     *
     * Note: Make sure that this header can be trusted (your application running behind a CDN or reverse proxy) before enabling.
     */
    xForwardedFor?: boolean;
}): string | undefined;

declare function isPreflightRequest(event: H3Event): boolean;
declare function isCorsOriginAllowed(origin: ReturnType<typeof getRequestHeaders>["origin"], options: H3CorsOptions): boolean;
declare function appendCorsPreflightHeaders(event: H3Event, options: H3CorsOptions): void;
declare function appendCorsHeaders(event: H3Event, options: H3CorsOptions): void;

/**
 * Parse the request to get HTTP Cookie header string and returning an object of all cookie name-value pairs.
 * @param event {H3Event} H3 event or req passed by h3 handler
 * @returns Object of cookie name-value pairs
 * ```ts
 * const cookies = parseCookies(event)
 * ```
 */
declare function parseCookies(event: H3Event): Record<string, string>;
/**
 * Get a cookie value by name.
 * @param event {H3Event} H3 event or req passed by h3 handler
 * @param name Name of the cookie to get
 * @returns {*} Value of the cookie (String or undefined)
 * ```ts
 * const authorization = getCookie(request, 'Authorization')
 * ```
 */
declare function getCookie(event: H3Event, name: string): string | undefined;
/**
 * Set a cookie value by name.
 * @param event {H3Event} H3 event or res passed by h3 handler
 * @param name Name of the cookie to set
 * @param value Value of the cookie to set
 * @param serializeOptions {CookieSerializeOptions} Options for serializing the cookie
 * ```ts
 * setCookie(res, 'Authorization', '1234567')
 * ```
 */
declare function setCookie(event: H3Event, name: string, value: string, serializeOptions?: CookieSerializeOptions): void;
/**
 * Remove a cookie by name.
 * @param event {H3Event} H3 event or res passed by h3 handler
 * @param name Name of the cookie to delete
 * @param serializeOptions {CookieSerializeOptions} Cookie options
 * ```ts
 * deleteCookie(res, 'SessionId')
 * ```
 */
declare function deleteCookie(event: H3Event, name: string, serializeOptions?: CookieSerializeOptions): void;
/**
 * Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
 * that are within a single set-cookie field-value, such as in the Expires portion.
 * This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
 * Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
 * Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
 * Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
 * @source https://github.com/nfriedly/set-cookie-parser/blob/3eab8b7d5d12c8ed87832532861c1a35520cf5b3/lib/set-cookie.js#L144
 */
declare function splitCookiesString(cookiesString: string | string[]): string[];

type Duplex = "half" | "full";
interface ProxyOptions {
    headers?: RequestHeaders | HeadersInit;
    fetchOptions?: RequestInit & {
        duplex?: Duplex;
    } & {
        ignoreResponseError?: boolean;
    };
    fetch?: typeof fetch;
    sendStream?: boolean;
    streamRequest?: boolean;
    cookieDomainRewrite?: string | Record<string, string>;
    cookiePathRewrite?: string | Record<string, string>;
    onResponse?: (event: H3Event, response: Response) => void;
}
declare function proxyRequest(event: H3Event, target: string, opts?: ProxyOptions): Promise<any>;
declare function sendProxy(event: H3Event, target: string, opts?: ProxyOptions): Promise<any>;
declare function getProxyRequestHeaders(event: H3Event): any;
declare function fetchWithEvent<T = unknown, _R = any, F extends (req: RequestInfo | URL, opts?: any) => any = typeof fetch>(event: H3Event, req: RequestInfo | URL, init?: RequestInit & {
    context?: H3EventContext;
}, options?: {
    fetch: F;
}): unknown extends T ? ReturnType<F> : T;

declare function send(event: H3Event, data?: any, type?: string): Promise<void>;
/**
 * Respond with an empty payload.<br>
 * Note that calling this function will close the connection and no other data can be sent to the client afterwards.
 *
 * @param event H3 event
 * @param code status code to be send. By default, it is `204 No Content`.
 */
declare function sendNoContent(event: H3Event, code?: number): void;
declare function setResponseStatus(event: H3Event, code?: number, text?: string): void;
declare function getResponseStatus(event: H3Event): number;
declare function getResponseStatusText(event: H3Event): string;
declare function defaultContentType(event: H3Event, type?: string): void;
declare function sendRedirect(event: H3Event, location: string, code?: number): Promise<void>;
declare function getResponseHeaders(event: H3Event): ReturnType<H3Event["res"]["getHeaders"]>;
declare function getResponseHeader(event: H3Event, name: string): ReturnType<H3Event["res"]["getHeader"]>;
declare function setResponseHeaders(event: H3Event, headers: Record<string, Parameters<OutgoingMessage["setHeader"]>[1]>): void;
declare const setHeaders: typeof setResponseHeaders;
declare function setResponseHeader(event: H3Event, name: string, value: Parameters<OutgoingMessage["setHeader"]>[1]): void;
declare const setHeader: typeof setResponseHeader;
declare function appendResponseHeaders(event: H3Event, headers: Record<string, string>): void;
declare const appendHeaders: typeof appendResponseHeaders;
declare function appendResponseHeader(event: H3Event, name: string, value: string): void;
declare const appendHeader: typeof appendResponseHeader;
/**
 * Remove all response headers, or only those specified in the headerNames array.
 * @param event H3 event
 * @param headerNames Array of header names to remove
 */
declare function clearResponseHeaders(event: H3Event, headerNames?: string[]): void;
declare function removeResponseHeader(event: H3Event, name: string): void;
declare function isStream(data: any): data is Readable | ReadableStream;
declare function isWebResponse(data: any): data is Response;
declare function sendStream(event: H3Event, stream: Readable | ReadableStream): Promise<void>;
declare function writeEarlyHints(event: H3Event, hints: string | string[] | Record<string, string | string[]>, cb?: () => void): void;
declare function sendWebResponse(event: H3Event, response: Response): void | Promise<void>;

declare function sanitizeStatusMessage(statusMessage?: string): string;
declare function sanitizeStatusCode(statusCode?: string | number, defaultStatusCode?: number): number;

interface StaticAssetMeta {
    type?: string;
    etag?: string;
    mtime?: number | string | Date;
    path?: string;
    size?: number;
    encoding?: string;
}
interface ServeStaticOptions {
    /**
     * This function should resolve asset meta
     */
    getMeta: (id: string) => StaticAssetMeta | undefined | Promise<StaticAssetMeta | undefined>;
    /**
     * This function should resolve asset content
     */
    getContents: (id: string) => unknown | Promise<unknown>;
    /**
     * Map of supported encodings (compressions) and their file extensions.
     *
     * Each extension will be appended to the asset path to find the compressed version of the asset.
     *
     * @example { gzip: ".gz", br: ".br" }
     */
    encodings?: Record<string, string>;
    /**
     * Default index file to serve when the path is a directory
     *
     * @default ["/index.html"]
     */
    indexNames?: string[];
    /**
     * When set to true, the function will not throw 404 error when the asset meta is not found or meta validation failed
     */
    fallthrough?: boolean;
}
declare function serveStatic(event: H3Event, options: ServeStaticOptions): Promise<void | false>;

/** @experimental */
type WebHandler = (request: Request, context?: Record<string, unknown>) => Promise<Response>;
/** @experimental */
declare function toWebHandler(app: App): WebHandler;
/** @experimental */
declare function fromWebHandler(handler: WebHandler): EventHandler<EventHandlerRequest, Promise<Response>>;

interface PlainRequest {
    _eventOverrides?: Partial<H3Event>;
    context?: Record<string, unknown>;
    method: string;
    path: string;
    headers: HeadersInit;
    body?: null | BodyInit;
}
interface PlainResponse {
    status: number;
    statusText: string;
    headers: [string, string][];
    body?: unknown;
}
type PlainHandler = (request: PlainRequest) => Promise<PlainResponse>;
/** @experimental */
declare function toPlainHandler(app: App): PlainHandler;
/** @experimental */
declare function fromPlainHandler(handler: PlainHandler): EventHandler<EventHandlerRequest, Promise<unknown>>;

export { AddRouteShortcuts, App, AppOptions, AppUse, CacheConditions, CreateRouterOptions, Duplex, DynamicEventHandler, Encoding, EventHandler, EventHandlerObject, EventHandlerRequest, EventHandlerResponse, H3CorsOptions, H3Error, H3Event, H3EventContext, H3Headers, H3Response, HTTPMethod, InferEventInput, InputLayer, InputStack, Layer, LazyEventHandler, MIMES, Matcher, MultiPartData, NodeEventContext, NodeListener, NodeMiddleware, NodePromisifiedHandler, PlainHandler, PlainRequest, PlainResponse, ProxyOptions, RequestHeaders, RouteNode, Router, RouterMethod, RouterUse, ServeStaticOptions, Session, SessionConfig, SessionData, Stack, StaticAssetMeta, ValidateFunction, ValidateResult, WebEventContext, WebHandler, _RequestMiddleware, _ResponseMiddleware, appendCorsHeaders, appendCorsPreflightHeaders, appendHeader, appendHeaders, appendResponseHeader, appendResponseHeaders, assertMethod, callNodeListener, clearResponseHeaders, clearSession, createApp, createAppEventHandler, createError, createEvent, createRouter, defaultContentType, defineEventHandler, defineLazyEventHandler, defineNodeListener, defineNodeMiddleware, defineRequestMiddleware, defineResponseMiddleware, deleteCookie, dynamicEventHandler, eventHandler, fetchWithEvent, fromNodeMiddleware, fromPlainHandler, fromWebHandler, getCookie, getHeader, getHeaders, getMethod, getProxyRequestHeaders, getQuery, getRequestHeader, getRequestHeaders, getRequestHost, getRequestIP, getRequestPath, getRequestProtocol, getRequestURL, getRequestWebStream, getResponseHeader, getResponseHeaders, getResponseStatus, getResponseStatusText, getRouterParam, getRouterParams, getSession, getValidatedQuery, handleCacheHeaders, handleCors, isCorsOriginAllowed, isError, isEvent, isEventHandler, isMethod, isPreflightRequest, isStream, isWebResponse, lazyEventHandler, parseCookies, promisifyNodeListener, proxyRequest, readBody, readFormData, readMultipartFormData, readRawBody, readValidatedBody, removeResponseHeader, sanitizeStatusCode, sanitizeStatusMessage, sealSession, send, sendError, sendNoContent, sendProxy, sendRedirect, sendStream, sendWebResponse, serveStatic, setCookie, setHeader, setHeaders, setResponseHeader, setResponseHeaders, setResponseStatus, splitCookiesString, toEventHandler, toNodeListener, toPlainHandler, toWebHandler, toWebRequest, unsealSession, updateSession, use, useBase, useSession, writeEarlyHints };

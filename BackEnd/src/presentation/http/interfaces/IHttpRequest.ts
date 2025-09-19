export interface IHttpRequest<B = any, H = any, P = any, Q = any> {
    body?: B;
    headers?: H;
    params?: P;
    query?: Q;
}

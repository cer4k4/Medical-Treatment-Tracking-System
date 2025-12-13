export interface IResponse<T> {
    successfully: boolean,
    data: T,
    statusCode: number,
    message: string,
}
export default class CustomError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = this.constructor.name;
        this.status = status ? status : 400;
        this.data = data;
    }
}

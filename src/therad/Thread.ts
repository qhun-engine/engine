/**
 * represent a thread in the webworker context
 */
export class Thread {

    /**
     * the currently active worker
     */
    private worker!: Worker;

    /**
     * @param sourcecode the code to run in another thread
     */
    constructor(
        private sourcecode: string,
        private parameterNames: string[]
    ) { }

    /**
     * starts the thread
     */
    public start<R = any>(): Promise<R> {

        // wrap with a promise
        return new Promise<R>((resolve, reject) => {

            // create the worker instance and provide the source code
            this.worker = new Worker(
                URL.createObjectURL(new Blob([this.wrapExistingCode(this.sourcecode)]))
            );

            // add error and reject handler
            this.worker.onerror = reject;

            // add on message
            this.worker.onmessage = msg => resolve(msg.data);
        });
    }

    /**
     * set the arguments for the sourcecode function. only relevant for isFunction types
     * @param args the arguments to pass to the worker
     */
    public setArguments(...args: any[]): void {

        // send to the worker
        this.worker.postMessage([...args]);
    }

    /**
     * get aditional source code based on the source code type
     */
    private wrapExistingCode(code: string): string {

        // define function context when given code is not a function
        code = `(${this.parameterNames.join(",")}) => {${code}}`;

        // define the code that runs in the worker
        const newCode: string[] = [
            // set awaiter context
            "const __awaiter = (ctx,a,b,fktn) => fktn();",
            // bind the given function
            "const fktn = ", code, ";",
            // save worker context
            "const worker = self;",
            // wait for argument arive
            "worker.onmessage = msg => {",
            /**/ // set new this arg
            /**/"const thisArg = msg.data.splice(0,1);",
            /**/ // call the function with given arguments and context
            /**/"const result = fktn.apply(thisArg, msg.data);",
            /**/ // send the result back
            /**/"postMessage(result)",
            /**/ // close the worker
            /**/"worker.close()",
            "};"
        ];

        return newCode.join("\n");
    }
}

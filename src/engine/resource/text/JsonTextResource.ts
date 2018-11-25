import { TextResource } from "./TextResource";

export class JsonTextResource<T extends object> extends TextResource<T> {

    /**
     * @param data the json data in string form
     */
    constructor(
        data: string
    ) {

        // call parent constructor with parsed data
        super(JSON.parse(data));
    }
}

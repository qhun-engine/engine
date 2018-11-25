import { TextResource } from "./TextResource";

export class JsonTextResource<T extends object> extends TextResource<T> {

    /**
     * @inheritdoc
     */
    public async process(data: string): Promise<T> {

        return JSON.parse(data);
    }
}

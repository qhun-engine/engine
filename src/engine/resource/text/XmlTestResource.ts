import { TextResource } from "./TextResource";
import * as xml from "fast-xml-parser";
import { ResourceError } from "../../exception/ResourceError";

export class XmlTextResource<T extends object> extends TextResource<T> {

    /**
     * @inheritdoc
     */
    public async process(data: string): Promise<T> {

        // declare parsing options
        const xmlOptions: Partial<xml.X2jOptions> = {
            allowBooleanAttributes: true,
            parseAttributeValue: true,
            ignoreAttributes: false,
            attributeNamePrefix: "__"
        };

        // validate first
        const validationResult = xml.validate(data, xmlOptions);
        if (validationResult === true) {

            // ok, convert to javascript object
            const traversal = xml.getTraversalObj(data, xmlOptions);
            return xml.convertToJson(traversal, {
                allowBooleanAttributes: true
            });
        }

        // throw an error
        throw new ResourceError(`The XML resource is malformed. Validation error was: ${validationResult}`);
    }
}

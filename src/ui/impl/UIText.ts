import { UIElementBase } from "./UIElementBase";

export class UIText extends UIElementBase {

    /**
     * the current text content of this button
     */
    protected text: string = "";

    /**
     * @inheritdoc
     */
    public getText(): string {

        return this.text;
    }

    /**
     * @inheritdoc
     */
    public setText(text: string): this {

        this.text = text;
        return this;
    }
}

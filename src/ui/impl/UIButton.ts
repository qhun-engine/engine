import { UIElementBase } from "./UIElementBase";
import { InteractiveUIElement } from "../InteractiveUIElement";
import { Pointer } from "../../input/Pointer";
import { UIHasText } from "../constraint/HasText";

export abstract class UIButton extends UIElementBase implements InteractiveUIElement, UIHasText {

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

    /**
     * @inheritdoc
     */
    public abstract onPointerEnter?(event: Pointer): void;

    /**
     * @inheritdoc
     */
    public abstract onPointerLeave(event: Pointer): void;

    /**
     * @inheritdoc
     */
    public abstract onPointerClick(event: Pointer): void;

    /**
     * @inheritdoc
     */
    public abstract onPointerDown(event: Pointer): void;

    /**
     * @inheritdoc
     */
    public abstract onPointerUp(event: Pointer): void;
}

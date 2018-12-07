import { UIElement } from "../UIElement";
import { UIAnchor } from "../UIAnchor";
import { Vector } from "../../math/Vector";

export abstract class UIElementBase implements UIElement {

    /**
     * contains all children of this element
     */
    protected children: UIElement[] = [];

    /**
     * contains the optional parent of this element
     */
    protected parent!: UIElement | void;

    /**
     * the current anchor of this ui element
     */
    protected anchor: UIAnchor = UIAnchor.TOPLEFT;

    /**
     * the current position/offset from anchor for this element
     */
    protected position: Vector = Vector.ZERO;

    /**
     * the current size of the element
     */
    protected size: Vector = Vector.ZERO;

    /**
     * the current layer of this ui element
     */
    protected layer: number = 0;

    /**
     * @inheritdoc
     */
    public getAnchor(): UIAnchor {

        return this.anchor;
    }

    /**
     * @inheritdoc
     */
    public getParent(): UIElement | void {

        return this.parent;
    }

    /**
     * @inheritdoc
     */
    public getChildren(): UIElement[] {

        return this.children;
    }

    /**
     * @inheritdoc
     */
    public getPosition(): Vector {

        return this.position;
    }

    /**
     * @inheritdoc
     */
    public setPosition(position: Vector): this {

        this.position = position;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getSize(): Vector {

        return this.size;
    }

    /**
     * @inheritdoc
     */
    public setSize(size: Vector): this {

        this.size = size;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getLayer(): number {

        return this.layer;
    }

    /**
     * @inheritdoc
     */
    public setLayer(layer: number): this {

        this.layer = layer;
        return this;
    }
}

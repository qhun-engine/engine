/**
 * a ui constraint interface indicating that the ui element has text
 */
export interface UIHasText {

    /**
     * get the text of this object
     */
    getText(): string;

    /**
     * set the text of this object
     * @param text the new text
     */
    setText(text: string): ThisType<UIHasText>;
}

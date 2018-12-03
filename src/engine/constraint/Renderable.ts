export interface Renderable {

    /**
     * get the current texture of the entity
     */
    getTexture(): HTMLImageElement;

    /**
     * set the texture for this entity
     * @param texture the texture for this entity
     */
    setTexture(texture: HTMLImageElement): ThisType<Renderable>;

}

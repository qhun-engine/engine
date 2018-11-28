import { ImageResource } from "../resource/sprite/ImageResource";

export interface Renderable {

    /**
     * get the current texture of the entity
     */
    getTexture(): ImageResource;

    /**
     * set the texture for this entity
     * @param texture the texture for this entity
     */
    setTexture(texture: ImageResource): ThisType<Renderable>;

}

import { BaseResource } from "../BaseResource";

export class ImageResource<T = HTMLImageElement> extends BaseResource<T> {

    /**
     * @inheritdoc
     */
    public async process(data: Blob): Promise<T> {

        return new Promise<T>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img as any);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(data);
        });
    }
}

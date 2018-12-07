/**
 * a constraint interface that indicates that the implementing object has a numeric layer number
 */
export interface HasLayer {

    /**
     * get the current layer number of the object. a higher layer will be drawn over objects with a lower layer.
     */
    getLayer(): number;

    /**
     * set the new layer number
     * @param layer the new layer
     */
    setLayer(layer: number): ThisType<HasLayer>;
}

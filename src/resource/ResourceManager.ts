import { Injectable } from "@qhun-engine/base";

import { Resource } from "./Resource";

declare type DeclaredResourceLoader = {
    resolve: (resource: any) => void,
    reject: (reason: any) => void,
    loader: () => Promise<Resource>
};

/**
 * The resource manager stores resources, group resources and load resources when
 * the game needs them
 */
@Injectable()
export class ResourceManager {

    /**
     * the storage of all declared resources
     */
    private declaredResources: DeclaredResourceLoader[] = [];

    /**
     * add the given loader function to the declared resource stack
     * @param loader the loader function to add
     */
    public addDeclaredResourceLoader(declaration: DeclaredResourceLoader): void {

        this.declaredResources.push(declaration);
    }

    /**
     * load all resources that has been declared to load in the asset
     * loading phase
     */
    public async loadDeclaredResources(): Promise<void[]> {

        const promiseStack: Promise<void>[] = [];

        // iterate over all declared resources
        this.declaredResources.forEach(resourceLoader => {

            // call the actual loader
            promiseStack.push(resourceLoader.loader().then(resourceLoader.resolve, resourceLoader.reject));
        });

        // wait for all promises to be resolved
        return Promise.all(promiseStack);
    }
}

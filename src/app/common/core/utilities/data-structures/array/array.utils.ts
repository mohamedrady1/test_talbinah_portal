export function createListOfObjects<TObject>(itemCount: number, objectFactory: (index: number) => TObject): TObject[] {
    return Array.from({ length: itemCount }, (_, itemIndex) => objectFactory(itemIndex));
}

export const arrayUtils = {
    createListOfObjects
};

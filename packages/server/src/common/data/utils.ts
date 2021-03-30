export function renameProp(oldProp: string, newProp: string, { [oldProp]: old, ...others }) {
    return {
        [newProp]: old,
        ...others,
    };
}

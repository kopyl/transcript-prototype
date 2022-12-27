export const removeSpacesFromArray = (
    inputArray: Array<string>
): Array<string> => {
    return inputArray.filter((item) => item !== "")
}

export const removeSpecialCharacters = (fromText: string): string => {
    return fromText.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, "")
}

export const ltrim = (str) => {
    if (!str) return str
    return str.replace(/^\s+/g, "")
}

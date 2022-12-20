export const removeSpacesFromArray = (
  inputArray: Array<string>
): Array<string> => {
  return inputArray.filter((item) => item !== "");
};

export const removeSpecialCharacters = (fromText: string): string => {
  return fromText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
};

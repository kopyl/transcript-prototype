import { getSuggestion, UserEnteringText, PossibleTranscript } from "App";
import { transcriptPlaceholderForTest } from "text";
import { specialCharactersExceptOpenBraces } from "tests/utils";

const testGetSuggestion = (
  input: string,
  possibleTranscript: string,
  expectedSuggestion: string
) => {
  test(`getSuggestion should return the correct suggestion`, () => {
    const userEnteringText = new UserEnteringText(input);
    const suggestion = getSuggestion(
      userEnteringText,
      new PossibleTranscript(possibleTranscript, userEnteringText)
    );
    expect(suggestion).toBe(expectedSuggestion);
  });
};

testGetSuggestion("", "Hello, world!", "Hello");
testGetSuggestion("", transcriptPlaceholderForTest, "Уявіть");
testGetSuggestion("Уявіть", transcriptPlaceholderForTest, "Уявіть що");
testGetSuggestion("Уявіть що", transcriptPlaceholderForTest, "Уявіть що в");
testGetSuggestion("Уявіть ", transcriptPlaceholderForTest, "Уявіть що");
testGetSuggestion("Уявіть,", transcriptPlaceholderForTest, "Уявіть, що");
testGetSuggestion("Уявіть, ", transcriptPlaceholderForTest, "Уявіть, що");
testGetSuggestion("У", transcriptPlaceholderForTest, "Уявіть");
testGetSuggestion("у", transcriptPlaceholderForTest, "уявіть");

testGetSuggestion("(", transcriptPlaceholderForTest, "(Уявіть");
testGetSuggestion("Уявіть [", transcriptPlaceholderForTest, "Уявіть [що");
testGetSuggestion("Уявіть (", transcriptPlaceholderForTest, "Уявіть (що");
testGetSuggestion("Уявіть {", transcriptPlaceholderForTest, "Уявіть {що");

testGetSuggestion("дереві", transcriptPlaceholderForTest, "дереві");

for (let character of specialCharactersExceptOpenBraces) {
  testGetSuggestion(
    `Уявіть ${character}`,
    transcriptPlaceholderForTest,
    `Уявіть ${character} що`
  );
}

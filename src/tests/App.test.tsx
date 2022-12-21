import { getSuggestion, UserEnteringText, PossibleTranscript } from "App"
import { transcriptPlaceholderForTest } from "tests/utils"
import { specialCharactersExceptOpenBraces } from "tests/utils"

const text = transcriptPlaceholderForTest

const testGetSuggestion = (
  input: string,
  possibleTranscript: string,
  expectedSuggestion: string,
  description: string = "getSuggestion should return the correct suggestion"
) => {
  test(description, () => {
    const userEnteringText = new UserEnteringText(input)
    const suggestion = getSuggestion(
      userEnteringText,
      new PossibleTranscript(possibleTranscript, userEnteringText)
    )
    expect(suggestion).toBe(expectedSuggestion)
  })
}

testGetSuggestion("", "Hello, world!", "Hello")
testGetSuggestion("", text, "Уявіть")
testGetSuggestion("Уявіть", text, "Уявіть що")
testGetSuggestion("Уявіть що", text, "Уявіть що в")
testGetSuggestion("Уявіть ", text, "Уявіть що")
testGetSuggestion("Уявіть,", text, "Уявіть, що")
testGetSuggestion("Уявіть, ", text, "Уявіть, що")
testGetSuggestion("У", text, "Уявіть")
testGetSuggestion("у", text, "уявіть")

testGetSuggestion("(", text, "(Уявіть")
testGetSuggestion("Уявіть [", text, "Уявіть [що")
testGetSuggestion("Уявіть (", text, "Уявіть (що")
testGetSuggestion("Уявіть {", text, "Уявіть {що")

testGetSuggestion("дереві", text, "дереві")

for (let character of specialCharactersExceptOpenBraces) {
  testGetSuggestion(
    `Уявіть ${character}`,
    text,
    `Уявіть ${character} що`,
    `
      Suggestion should have space after
      special characters except open braces
    `
  )
}

for (let character of specialCharactersExceptOpenBraces) {
  testGetSuggestion(
    `Уявіт${character}`,
    text,
    `Уявіт${character}`,
    `
      No suggestion should be given if
      the last word is not in the transcript
      and the last character is a special
      character or an open brace.
      
      Wrong suggestion: "Уявіт,ь"
      Right suggestion: "Уявіт,"

      solved by condition:
      if (userEnteringText.endsWithSpecialCharacter)
        return withInput(" ", possibleTranscript.nextPossibleWord);
    `
  )
}

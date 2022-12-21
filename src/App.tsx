import React, { useEffect, useState } from "react"
import "./App.css"
import { removeSpacesFromArray, removeSpecialCharacters } from "./utils"
import { transcriptPlaceholder } from "./text"

class Text {
  private contentWithoutSpecialChars: string

  constructor(public content: string) {
    this.contentWithoutSpecialChars = removeSpecialCharacters(this.content)
  }

  public get array(): string[] | [] {
    const array = this.contentWithoutSpecialChars
      .replace("\n", " ")
      .split(" ")
    return removeSpacesFromArray(array) ?? []
  }

  public get firstWord(): string {
    return this.array[0] ?? ""
  }

  public get lastWord(): string {
    const array = this.array
    return array[array.length - 1] ?? ""
  }
}

export class UserEnteringText extends Text {
  get isEmpty(): boolean {
    return this.content === ""
  }

  get hasOnlyOneCharacter(): boolean {
    return this.content.length === 1
  }

  get endsWithSpace(): boolean {
    return this.content.endsWith(" ")
  }

  get endsWithSpecialCharacter(): boolean {
    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    return format.test(this.content.slice(-1))
  }

  get endsWithOpenBracketOrSpace(): boolean {
    const format = /[ (\[{]/
    return format.test(this.content.slice(-1))
  }
}

export class PossibleTranscript extends Text {
  constructor(
    content: string,
    private userEnteringText: UserEnteringText
  ) {
    super(content)
  }

  get endingOfLastEnteredWord(): string {
    const enteringTextLastWord = this.userEnteringText.lastWord
    const lastEnteredWord = enteringTextLastWord.toLowerCase()
    return (
      this.array
        .find((word) => word.toLowerCase().startsWith(lastEnteredWord))
        ?.slice(enteringTextLastWord.length) || ""
    )
  }

  get nextPossibleWord(): string {
    const array = this.array
    const lastEnteredWord = this.userEnteringText.lastWord.toLowerCase()
    for (let wordCount in array) {
      if (array[wordCount].toLowerCase() === lastEnteredWord)
        return array[parseInt(wordCount) + 1] ?? ""
    }
    if (this.userEnteringText.isEmpty) {
      return this.firstWord
    }
    if (
      this.userEnteringText.endsWithOpenBracketOrSpace &&
      this.userEnteringText.hasOnlyOneCharacter
    ) {
      return this.firstWord
    }
    return ""
  }
}

export const getSuggestion = (
  userEnteringText: InstanceType<typeof UserEnteringText>,
  possibleTranscript: InstanceType<typeof PossibleTranscript>
): string => {
  // need to suggest words which were already used less frequently
  // where suggestion ends with possibleTranscript.nextPossibleWord

  const withInput = (...args: string[]) =>
    [userEnteringText.content, ...args].join("").trim()

  if (userEnteringText.endsWithOpenBracketOrSpace)
    return withInput(possibleTranscript.nextPossibleWord)

  if (userEnteringText.endsWithSpecialCharacter)
    return withInput(" ", possibleTranscript.nextPossibleWord)

  if (possibleTranscript.endingOfLastEnteredWord)
    return withInput(possibleTranscript.endingOfLastEnteredWord)

  return withInput(" ", possibleTranscript.nextPossibleWord)
}

const setSuggestion = (
  suggestionFormTextSetter: React.Dispatch<React.SetStateAction<string>>,
  _possibleTranscript: string,
  _userEnteringText: string = ""
) => {
  const userEnteringText = new UserEnteringText(_userEnteringText)
  const possibleTranscript = new PossibleTranscript(
    _possibleTranscript,
    userEnteringText
  )

  const suggestion = getSuggestion(userEnteringText, possibleTranscript)
  suggestionFormTextSetter(suggestion)
}

function App() {
  const [userEnteringText, setUserEnteringText] = useState("")
  const [suggestionText, setSuggestionText] = useState("")

  const [transcript, _] = useState(transcriptPlaceholder)

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const enteredText = event.target.value
    setUserEnteringText(enteredText)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return
    event.preventDefault()
    autoComplete()
  }

  const autoComplete = () => {
    const textToBeEntered = suggestionText + " "
    setUserEnteringText(textToBeEntered)
  }

  useEffect(() => {
    setSuggestion(setSuggestionText, transcript, userEnteringText)
  }, [userEnteringText, transcript])

  return (
    <div className="App">
      <div className="textarea">
        <textarea
          value={userEnteringText}
          className="main"
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <textarea className="overlay" defaultValue={suggestionText} />
      </div>
    </div>
  )
}

export default App

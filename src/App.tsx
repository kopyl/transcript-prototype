import React, { useEffect, useState } from "react";
import "./App.css";
import { removeSpacesFromArray, removeSpecialCharacters } from "./utils";
import { transcriptPlaceholder } from "./text";

class Text {
  private contentWithoutSpecialChars: string;

  constructor(public content: string) {
    this.contentWithoutSpecialChars = removeSpecialCharacters(this.content);
  }

  public get array() {
    const array = this.contentWithoutSpecialChars.replace("\n", " ").split(" ");
    return removeSpacesFromArray(array) ?? [];
  }

  public get firstWord() {
    return this.array[0];
  }

  public get lastWord() {
    const array = this.array;
    return array[array.length - 1] ?? "";
  }
}

class UserEnteringText extends Text {
  get isEmpty() {
    return this.content === "";
  }

  get hasOnlyOneCharacter() {
    return this.content.length === 1;
  }

  get endsWithSpace() {
    return this.content.endsWith(" ");
  }

  get endsWithSpecialCharacterExceptOpenBracket() {
    const format = /[`!@#$%^&*)_+\-={};':"\\|,.<>\/?~]/;
    return format.test(this.content.slice(-1));
  }

  get endsWithOpenBracket() {
    const format = /[(\[{]/;
    return format.test(this.content.slice(-1));
  }
}

class PossibleTranscript extends Text {
  constructor(content: string, private userEnteringText: Text) {
    super(content);
  }

  get endingWhichStartWithLastEnteredWord() {
    const enteringTextLastWord = this.userEnteringText.lastWord;
    const lastEnteredWord = enteringTextLastWord.toLowerCase();
    return (
      this.array
        .find((word) => word.toLowerCase().startsWith(lastEnteredWord))
        ?.slice(enteringTextLastWord.length) || ""
    );
  }

  get nextPossibleWord() {
    const array = this.array;
    const lastEnteredWord = this.userEnteringText.lastWord.toLowerCase();
    for (let wordCount in array) {
      if (array[wordCount].toLowerCase() === lastEnteredWord)
        return array[parseInt(wordCount) + 1] ?? "";
    }
    return this.firstWord;
  }
}

const _setSuggestion = (
  _possibleTranscript: string,
  suggestionFormTextSetter: Function,
  _userEnteringText: string = ""
) => {
  const userEnteringText = new UserEnteringText(_userEnteringText);
  const possibleTranscript = new PossibleTranscript(
    _possibleTranscript,
    userEnteringText
  );

  // need to suggest words which were already used less frequently
  // where suggestion ends with possibleTranscript.nextPossibleWord

  if (userEnteringText.endsWithOpenBracket) {
    if (userEnteringText.hasOnlyOneCharacter) {
      return suggestionFormTextSetter(
        _userEnteringText + possibleTranscript.firstWord
      );
    }

    return suggestionFormTextSetter(
      _userEnteringText + possibleTranscript.nextPossibleWord
    );
  }

  if (userEnteringText.endsWithSpecialCharacterExceptOpenBracket) {
    return suggestionFormTextSetter(
      _userEnteringText + " " + possibleTranscript.nextPossibleWord
    );
  }

  if (userEnteringText.endsWithSpace) {
    return suggestionFormTextSetter(
      _userEnteringText + possibleTranscript.nextPossibleWord
    );
  }

  if (userEnteringText.isEmpty) {
    return suggestionFormTextSetter(
      _userEnteringText + possibleTranscript.firstWord
    );
  }

  suggestionFormTextSetter(
    _userEnteringText + possibleTranscript.endingWhichStartWithLastEnteredWord
  );
};

function App() {
  const [userEnteringText, setUserEnteringText] = useState("");
  const [suggestionText, setSuggestionText] = useState("");

  const [transcript, _] = useState(transcriptPlaceholder);

  const setSuggestion = _setSuggestion.bind("", transcript, setSuggestionText);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const enteredText = event.target.value;
    setUserEnteringText(enteredText);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    autoComplete();
  };

  const autoComplete = () => {
    const textToBeEntered = suggestionText + " ";
    setUserEnteringText(textToBeEntered);
  };

  useEffect(() => {
    setSuggestion(userEnteringText);
  }, [userEnteringText, transcript]);

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
  );
}

export default App;

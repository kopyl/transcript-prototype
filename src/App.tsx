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

export class UserEnteringText extends Text {
  get isEmpty() {
    return this.content === "";
  }

  get hasOnlyOneCharacter() {
    return this.content.length === 1;
  }

  get endsWithSpace() {
    return this.content.endsWith(" ");
  }

  get endsWithSpecialCharacter() {
    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return format.test(this.content.slice(-1));
  }

  get endsWithOpenBracketOrSpace() {
    const format = /[ (\[{]/;
    return format.test(this.content.slice(-1));
  }
}

export class PossibleTranscript extends Text {
  constructor(content: string, private userEnteringText: UserEnteringText) {
    super(content);
  }

  get endingOfLastEnteredWord() {
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
    if (this.userEnteringText.isEmpty) {
      return this.firstWord;
    }
    if (this.userEnteringText.endsWithOpenBracketOrSpace) {
      return this.firstWord;
    }
    return "";
  }
}

export const getSuggestion = (
  userEnteringText: InstanceType<typeof UserEnteringText>,
  possibleTranscript: InstanceType<typeof PossibleTranscript>
) => {
  // need to suggest words which were already used less frequently
  // where suggestion ends with possibleTranscript.nextPossibleWord

  if (userEnteringText.endsWithOpenBracketOrSpace)
    return userEnteringText.content + possibleTranscript.nextPossibleWord;

  if (userEnteringText.endsWithSpecialCharacter)
    return userEnteringText.content + " " + possibleTranscript.nextPossibleWord;

  if (possibleTranscript.endingOfLastEnteredWord)
    return (
      userEnteringText.content + possibleTranscript.endingOfLastEnteredWord
    );
  return (
    userEnteringText.content +
    " " +
    possibleTranscript.nextPossibleWord
  ).trim();
};

const _setSuggestion = (
  _possibleTranscript: string,
  suggestionFormTextSetter: React.Dispatch<React.SetStateAction<string>>,
  _userEnteringText: string = ""
) => {
  const userEnteringText = new UserEnteringText(_userEnteringText);
  const possibleTranscript = new PossibleTranscript(
    _possibleTranscript,
    userEnteringText
  );

  const suggestion = getSuggestion(userEnteringText, possibleTranscript);
  suggestionFormTextSetter(suggestion);
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

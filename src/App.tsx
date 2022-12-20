import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "./App.css";
import { text } from "./text";
import { removeSpacesFromArray, removeSpecialCharacters } from "./utils";

class Text {
  protected originalContent: string;

  constructor(public content: string) {
    this.originalContent = content;
    this.content = removeSpecialCharacters(this.content);
  }

  public get array() {
    const array = this.content.replace("\n", " ").split(" ");
    return removeSpacesFromArray(array);
  }

  public get firstWord() {
    return this.array[0];
  }

  public get lastWord() {
    return this.array[this.array.length - 1];
  }
}

class UserEnteringText extends Text {
  get isEmpty() {
    return this.originalContent === "";
  }

  get endsWithSpace() {
    return this.originalContent.endsWith(" ");
  }
}

class PossibleTranscript extends Text {
  constructor(content: string, private userEnteringText: Text) {
    super(content);
  }

  get endingWhichStartWithLastEnteredWord() {
    const enteringText = this.userEnteringText;
    return (
      this.array
        .find((word) =>
          word.toLowerCase().startsWith(enteringText.lastWord.toLowerCase())
        )
        ?.slice(enteringText.lastWord.length) || ""
    );
  }

  get nextPossibleWord() {
    for (let wordCount in this.array) {
      if (this.array[wordCount] === this.userEnteringText.lastWord)
        return this.array[parseInt(wordCount) + 1] ?? "";
    }
    return "";
  }
}

const setupSuggestions = (
  _possibleTranscript: string,
  formSetter: Function
) => {
  const setSuggestion = (_userEnteringText: string) => {
    const userEnteringText = new UserEnteringText(_userEnteringText);
    const possibleTranscript = new PossibleTranscript(
      _possibleTranscript,
      userEnteringText
    );

    // or if ends with special character
    // need to suggest words which were already used less frequently
    if (userEnteringText.endsWithSpace) {
      return formSetter(
        _userEnteringText + possibleTranscript.nextPossibleWord
      );
    }

    if (userEnteringText.isEmpty) {
      return formSetter(_userEnteringText + possibleTranscript.firstWord);
    }

    // need to suggest words which were already used less frequently
    formSetter(
      _userEnteringText + possibleTranscript.endingWhichStartWithLastEnteredWord
    );
  };

  return setSuggestion;
};

function App() {
  const textareamain = useRef() as MutableRefObject<HTMLTextAreaElement>;
  const textaresecondary = useRef() as MutableRefObject<HTMLTextAreaElement>;

  const [textareamainvalue, settextareamainvalue] = useState("");
  const [textaresecondaryvalue, settextaresecondaryvalue] = useState("");

  const setSuggestion = setupSuggestions(text, settextaresecondaryvalue);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const enteredText = event.target.value;
    settextareamainvalue(enteredText);
    setSuggestion(enteredText);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    autoComplete();
  };

  const autoComplete = () => {
    const textToBeEntered = textaresecondaryvalue + " ";
    settextareamainvalue(textToBeEntered);
    setSuggestion(textToBeEntered);
  };

  useEffect(() => {
    setSuggestion("");
  }, []);

  return (
    <div className="App">
      <div className="textarea">
        <textarea
          value={textareamainvalue}
          ref={textareamain}
          className="main"
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <textarea
          ref={textaresecondary}
          className="overlay"
          defaultValue={textaresecondaryvalue}
        />
      </div>
    </div>
  );
}

export default App;

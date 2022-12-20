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

class Suggestion {
  private suggestion: string = "";

  private userEnteringText: UserEnteringText;
  private possibleTranscript: PossibleTranscript;

  constructor(
    private _possibleTranscript: string,
    private _userEnteringText: string,
    private formSetter: Function
  ) {
    this.userEnteringText = new UserEnteringText(_userEnteringText);
    this.possibleTranscript = new PossibleTranscript(
      _possibleTranscript,
      this.userEnteringText
    );
    this.make();
    console.log(this._userEnteringText);
  }

  make() {
    // or if ends with special character
    // need to suggest words which were already used less frequently
    if (this.userEnteringText.endsWithSpace) {
      return (this.suggestion = this.possibleTranscript.nextPossibleWord);
    }

    if (this.userEnteringText.isEmpty) {
      return (this.suggestion = this.possibleTranscript.firstWord);
    }

    // need to suggest words which were already used less frequently
    this.suggestion =
      this.possibleTranscript.endingWhichStartWithLastEnteredWord;
  }

  set() {
    this.formSetter(this._userEnteringText + this.suggestion);
  }
}

function App() {
  const textareamain = useRef() as MutableRefObject<HTMLTextAreaElement>;
  const textaresecondary = useRef() as MutableRefObject<HTMLTextAreaElement>;

  const [textareamainvalue, settextareamainvalue] = useState("");
  const [textaresecondaryvalue, settextaresecondaryvalue] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    settextareamainvalue(newValue);

    const suggestion = new Suggestion(text, newValue, settextaresecondaryvalue);
    suggestion.set();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    autoComplete();
  };

  const autoComplete = () => {
    const newValue = textaresecondaryvalue + " ";
    settextareamainvalue(newValue);

    const suggestion = new Suggestion(text, newValue, settextaresecondaryvalue);
    suggestion.set();
  };

  useEffect(() => {
    const suggestion = new Suggestion(text, "", settextaresecondaryvalue);
    suggestion.set();
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

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
    const array = this.content.split(" ");
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
    return (
      this.array
        .find((word) => word.startsWith(this.userEnteringText.lastWord))
        ?.slice(this.userEnteringText.lastWord.length) || ""
    );
  }
}

const makeSuggestion = (
  _possibleTranscript: string,
  _userEnteringText: string
): string => {
  let userEnteringText = new UserEnteringText(_userEnteringText);
  let possibleTranscript = new PossibleTranscript(
    _possibleTranscript,
    userEnteringText
  );

  if (userEnteringText.endsWithSpace) {
    return ""; // placeholder. or if ends with special character -> suggest a new word
  }

  if (userEnteringText.isEmpty) {
    return possibleTranscript.firstWord;
  }

  // need to suggest words which were already used less frequently
  return possibleTranscript.endingWhichStartWithLastEnteredWord;
};

function App() {
  const textareamain = useRef() as MutableRefObject<HTMLTextAreaElement>;
  const textaresecondary = useRef() as MutableRefObject<HTMLTextAreaElement>;

  const [textareamainvalue, settextareamainvalue] = useState("");
  const [textaresecondaryvalue, settextaresecondaryvalue] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    settextareamainvalue(event.target.value);

    const suggestion = makeSuggestion(text, event.target.value);
    settextaresecondaryvalue(event.target.value + suggestion);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    autoComplete();
  };

  const autoComplete = () => {
    settextareamainvalue(textaresecondaryvalue + " ");
  };

  useEffect(() => {
    const suggestion = makeSuggestion(text, "");
    settextaresecondaryvalue(suggestion);
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

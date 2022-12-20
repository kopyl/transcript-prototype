export const textWithoutLastWord = (text: string) => {
  const array = text.split(" ");
  return array.slice(0, array.length - 1).join(" ");
};

// export const makeSuggestion = (
//   fromPossibleTranscript: string,
//   basedOnText: string
// ): Suggestion => {
//   let fromWords = removeSpecialCharacters(fromPossibleTranscript).split(" ");
//   let basedOnWords = removeSpecialCharacters(basedOnText).split(" ");
//   fromWords = removeSpacesFromArray(fromWords);
//   basedOnWords = removeSpacesFromArray(basedOnWords);

//   const lastWord = basedOnWords[basedOnWords.length - 1];
//   const lastWordIndex = fromWords.indexOf(lastWord);

//   const currentWord = fromWords.find((e) => e.startsWith(lastWord)) || null;

//   if (!basedOnWords.length) {
//     return {
//       currentWord: fromWords[0],
//       nextWord: null,
//     };
//   }

//   const nextWord = fromWords[lastWordIndex + 1];

//   if (nextWord === currentWord) {
//     return {
//       nextWord: null,
//       currentWord,
//     };
//   } else {
//     return {
//       currentWord: null,
//       nextWord,
//     };
//   }
// };

// function App() {
//   const textareamain = useRef() as MutableRefObject<HTMLTextAreaElement>;
//   const textaresecondary = useRef() as MutableRefObject<HTMLTextAreaElement>;

//   const [textareamainvalue, settextareamainvalue] = useState("");
//   const [textaresecondaryvalue, settextaresecondaryvalue] = useState("");

//   const onChange = (value: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newVal = value.target.value.replace(/\s\s+/g, " ");
//     // replace multiple spaces with one
//     settextareamainvalue(newVal);

//     // const suggestion = makeSuggestion(text, value.target.value);

//     // if (suggestion.currentWord) {
//     //   settextaresecondaryvalue(`${suggestion.currentWord}`.replace("  ", " "));
//     // } else {
//     //   settextaresecondaryvalue(
//     //     (newVal + ` ${suggestion.nextWord}`).replace("  ", " ")
//     //   );
//     // }
//   };

//   const autoComplete = () => {
//     // settextareamainvalue(textaresecondaryvalue);
//     // const suggestion = makeSuggestion(text, textaresecondaryvalue);
//     // if (suggestion.currentWord) {
//     //   settextaresecondaryvalue(`${suggestion.currentWord}`);
//     // } else {
//     //   settextaresecondaryvalue(
//     //     textaresecondaryvalue + ` ${suggestion.nextWord}`
//     //   );
//     // }
//   };

//   const onkeydown = (value: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (value.key !== "Tab") return;
//     value.preventDefault();
//     autoComplete();

//     console.log(value.key);
//   };

//   return (
//     <div className="App">
//       <div className="textarea">
//         <textarea
//           value={textareamainvalue}
//           ref={textareamain}
//           className="main"
//           onChange={onChange}
//           onKeyDown={onkeydown}
//         />
//         <textarea
//           ref={textaresecondary}
//           className="overlay"
//           defaultValue={textaresecondaryvalue}
//         />
//       </div>
//     </div>
//   );
// }

// replace multiple spaces with one
// const newVal = value.target.value.replace(/\s\s+/g, " ");

// const onFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
// const suggestion = makeSuggestion(text, event.target.value);
// settextaresecondaryvalue(suggestion);
// };

// function App() {
//   const textareamain = useRef() as MutableRefObject<HTMLTextAreaElement>;
//   const textaresecondary = useRef() as MutableRefObject<HTMLTextAreaElement>;

//   const [textareamainvalue, settextareamainvalue] = useState("");
//   const [textaresecondaryvalue, settextaresecondaryvalue] = useState("");

//   const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//     settextareamainvalue(event.target.value);

//     const suggestion = makeSuggestion(text, event.target.value);
//     settextaresecondaryvalue(event.target.value + suggestion);
//   };

//   const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (event.key !== "Tab") return;
//     event.preventDefault();
//     autoComplete();
//   };

//   const autoComplete = () => {
//     const newValue = textaresecondaryvalue + " ";
//     settextareamainvalue(newValue);
//     const suggestion = makeSuggestion(text, newValue);
//     settextaresecondaryvalue(newValue + suggestion);
//   };

//   useEffect(() => {
//     const suggestion = makeSuggestion(text, "");
//     settextaresecondaryvalue(suggestion);
//   }, []);

//     class Suggestion {
//   private suggestion: string = "";

//   private userEnteringText: UserEnteringText;
//   private possibleTranscript: PossibleTranscript;

//   constructor(
//     private _possibleTranscript: string,
//     private _userEnteringText: string,
//     private formSetter: Function
//   ) {
//     this.userEnteringText = new UserEnteringText(_userEnteringText);
//     this.possibleTranscript = new PossibleTranscript(
//       _possibleTranscript,
//       this.userEnteringText
//     );
//     this.make();
//     console.log(this._userEnteringText);
//   }

//   make() {
//     // or if ends with special character
//     // need to suggest words which were already used less frequently
//     if (this.userEnteringText.endsWithSpace) {
//       this.suggestion = this.possibleTranscript.nextPossibleWord;
//     }

//     if (this.userEnteringText.isEmpty) {
//       this.suggestion = this.possibleTranscript.firstWord;
//     }

//     // need to suggest words which were already used less frequently
//     this.suggestion =
//       this.possibleTranscript.endingWhichStartWithLastEnteredWord;
//   }

//   set() {
//     this.formSetter(this._userEnteringText + this.suggestion);
//   }
// }

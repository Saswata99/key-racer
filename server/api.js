import fetch from "node-fetch";

const createWordsArray = (text) => {
  const arr = text.split(" ");
  const modifiedArr = arr.map((word, index) => {
    return index === arr.length - 1 ? word : word + " ";
  });
  return modifiedArr;
};

export default async function fetchQuotes() {
  // const response = await fetch(
  //   "https://api.quotable.io/random?minLength=100&maxLength=140"
  // );
  // const data = await response.json();
  // const arr = createWordsArray(data.content);
  
  const text = "this is test text"
  const arr = createWordsArray(text);
  return arr;
}

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

  const text = 
      "The obj variable is an object with the same key-value pairs on each re-render, but it points to a different location in memory every time, so it would fail the equality check and cause an infinite re-render loop.";

  const arr = createWordsArray(text);

  return arr;
}

'use client'; // Error-Seiten müssen Client-Komponenten sein

// https://nextjs.org/docs/app/api-reference/file-conventions/error
type Props = {
  error: Error;
  reset: () => void;
};
export default function ErrorPage({ error, reset }: Props) {
  return (
    <main className="default-layout">
      <h1>Es gab leider ein Problem.</h1>
      <p>{error.message}</p>
      {/* 
reset ist eine Funktion, mit der man die selbe Aktion nochmal probieren kann.
*/}
      <button onClick={reset}>Nochmal versuchen</button>
    </main>
  );
}

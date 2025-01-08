export default function PetitionForm() {
  return (
    <form className="petition-form">
      <div className="inputs">
        <div className="inputWrapper">
          <label htmlFor="name">Name (optional)</label>
          <input id="name" name="name" maxLength={100} autoComplete="name" />
        </div>
        <div className="inputWrapper">
          <label htmlFor="email">E-Mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <label>
        <input type="checkbox" name="privacy" value="accept" required />
        Ich stimme den Datenschutzbedingungen zu
      </label>

      <strong className="message">Status</strong>
    </form>
  );
}

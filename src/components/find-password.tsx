import { useState } from "react";
import { Button, Error, Form, Input } from "./auth-components";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Modal = () => {
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    name === "findEmail" ? setEmail(value) : null;
    console.log(email);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    auth.languageCode = "ko";
    console.log(email);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmail("");
        setErr("Email is Sended");
      })
      .catch((error) => {
        setErr(error.message);
      });
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="findEmail"
          type="email"
          value={email}
          placeholder="Enter your Email"
          required
        />
        <Input type="submit" value="Find" />
      </Form>
      {err !== "" ? <Error>{err}</Error> : null}
    </>
  );
};

export default function FindPassword() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {isOpen ? null : (
        <Button onClick={() => setIsOpen(!isOpen)}>Find Password</Button>
      )}
      {isOpen ? <Modal></Modal> : null}
    </div>
  );
}

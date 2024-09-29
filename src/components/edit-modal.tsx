import ReactModal from "react-modal";
import { User } from "firebase/auth";
import { useState } from "react";
import {
  AttachFileInput,
  CloseButton,
  SubmitButton,
  TextArea,
  AttachFileButton,
  Form,
} from "./auth-components";
import { db, storage } from "../firebase";
import { doc, runTransaction, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

const ModalStyle: ReactModal.Styles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "black",
    width: "700px",
    height: "350px",
    zIndex: "200",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "30px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
  },
};

interface IModal {
  isOpen: boolean;
  Id: string;
  user: User | null;
  tweet: string;
  photo: string;
}

export default function EditModal(props: IModal) {
  const [modalHandle, setModalHandle] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [tweet, setTweet] = useState(props.tweet);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size < 1024 * 1024) {
        //10 * 1024 * 1024 = 10mb
        //size가 안되면 render
        setFile(files[0]);
      } else {
        alert("File size must be less than 10MB");
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(e.currentTarget.onformdata);
    if (file) {
      const photoRef = ref(storage, `tweets/${props.user?.uid}/${props.Id}`);
      console.log(photoRef);
      try {
        await deleteObject(photoRef);
      } catch (err) {
        console.log(err);
      }
      const result = await uploadBytes(photoRef, file);
      const url = await getDownloadURL(result.ref);
      await updateDoc(doc(db, "tweets", props.Id), {
        photo: url,
      });
    }

    try {
      await runTransaction(db, async (t) => {
        t.update(doc(db, "tweets", props.Id), {
          tweet: tweet,
        });
      });
    } catch (err) {
      console.log(err);
    }
    tweet.length > 4
      ? setModalHandle(false)
      : alert("should write over 5 charactor");
  };

  return (
    <ReactModal
      isOpen={modalHandle}
      ariaHideApp={false}
      style={ModalStyle}
      shouldCloseOnOverlayClick={true}
    >
      <Form onSubmit={onSubmit}>
        <TextArea
          onChange={(e) => {
            setTweet(e.target.value);
          }}
          defaultValue={props.tweet}
          rows={5}
          maxLength={180}
          required
        ></TextArea>
        <AttachFileButton htmlFor="editFile">
          {file ? "Photo added" : "Edit photo"}
        </AttachFileButton>
        <AttachFileInput
          onChange={onFileChange}
          type="file"
          id="editFile"
          accept="image/*"
        />
        <SubmitButton type="submit" value="Edit Tweet" />
        <CloseButton onClick={() => setModalHandle(false)}>Close</CloseButton>
      </Form>
    </ReactModal>
  );
}

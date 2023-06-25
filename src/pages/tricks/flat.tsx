import React, { useCallback, useState } from "react";
import Link from "next/link";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "skatemap_new/utils/api";
import Modal from "skatemap_new/components/modal/Modal";
import Player from "skatemap_new/components/player/Player";
import UploadProgress from "skatemap_new/components/uploadProgress";
import UploadPreview from "skatemap_new/components/uploadPreview";
import { isDragActive } from "framer-motion";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import initFirebase from "skatemap_new/lib/firebaseInit";

interface MyObject {
  userId: string;
  trickId: number;
}
initFirebase();

const storage = getStorage();

const storageRef = ref(storage, new Date().toISOString());

type Image = {
  imageFile: Blob;
};

const Flat: NextPage = () => {
  const { data: session } = useSession();
  const email = session?.user.email;
  const user = api.user.getById.useQuery({ email: email as string });
  const { data: tricks } = api.user.getTricks.useQuery({ id: user.data?.id! });
  const { data: flat } = api.trick.getFlat.useQuery();
  const [modalActive, setModalActive] = useState(false)
  const [index, setIndex] = useState<number>(0)
  let [progress, setProgress] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {mutate} = api.video.sendVideo.useMutation()
  const [index2, setIndex2] = useState<number>(0)

  const checkArray = (arr: MyObject[], search: MyObject) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.userId === search.userId && arr[i]?.trickId === search.trickId) {
        return true;
      }
    }
    return false;
  };

  const uploadImage = async ({ imageFile }: Image) => {
    try {
      setLoading(true);

      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            setLoading(false);
            setSuccess(true);
          });
        }
      );
    } catch (e: any) {
      console.log(e.message);
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: any[]) => {
    // Upload files to storage
    const file = acceptedFiles[0];
    uploadImage({ imageFile: file });
  }, []);
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "image/png": [".mov", ".mp4", ".gif"],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const sendFunc = () => {
    if(imageUrl != ''){
      setModalActive(false);
      mutate({
        userId: user.data?.id!,
        video: imageUrl,
        trickId: index2,
      })
    }
    else
    alert('Проверьте данные и повторите попытку')
  }

  return (
    <>
      <div className="flex flex-grow">
        <Link className="m-auto mt-[2%] text-5xl" href={`/`}>
          Skate Map
        </Link>
        {session?.user && (
          <Link
            className="absolute top-[3%] right-[2%] border-2 h-12 w-12 border-gray-800 rounded-full m-auto"
            href={`/profiles/${session?.user.id}`}
          >
            <img
              className="rounded-full h-11"
              src={user.data?.image!}
              alt="user avatar"
            ></img>
          </Link>
        )}
      </div>
      <nav className="flex items-center m-[2%]">
        <Link className="a" href={`/`}>
          Карта спотов
        </Link>
        <Link className="a" href={`/school`}>
          Школа трюков
        </Link>
        <Link className="a" href={`/blog`}>
          Блог
        </Link>
        <a className="a">Правила скейтпарков</a>
      </nav>
      <div className="flex flex-col items-center m-auto">
        {flat?.map((item, i) => (
          <>
          <Modal active={modalActive} setActive={setModalActive}>
            <div className="flex flex-col items-center h-[550px] overflow-hidden overflow-y-scroll">
              <h1 className=" text-3xl mb-5 font-bold">{flat?.[index]!.name}</h1>
              <div className="max-w-[60%]">
                    <Player src={flat?.[index]!.video}/>
              </div>
              <div className="m-5 text-left">{flat?.[index]!.tutor}</div>
              <>
                <div>
                    {!success && (
                    <div
                        className={` ${
                        loading ? "hidden" : ""
                        } flex w-full justify-center`}
                    >
                        <div className="dropzone">
                        <div {...getRootProps()} className="drag_drop_wrapper">
                            <input hidden {...getInputProps()} />

                            {isDragActive ? (
                            <p>Перетащите фото сюда</p>
                            ) : (
                            <>
                                <p>Перетащите фото сюда</p>
                            </>
                            )}
                        </div>
                        <p className="mt-9 m-5">или</p>
                        <div className="flex p-1 w-28 justify-center mt-7 ">
                            <button className="border-2 border-black hover:border-gray-200 rounded-lg" onClick={open}>выберете файл</button>
                        </div>
                        </div>
                    </div>
                    )}
                </div>

                {loading && <UploadProgress progress={progress} />}
                
                {success && <UploadPreview imageUrl={imageUrl} />}   
                </>
                {!loading && <button 
                className="border-2 border-gray-800 hover:border-gray-200 flex items-center justify-center rounded-md p-1 w-[30%]"
                onClick={()=>{sendFunc()}}>Отправить</button> }
            </div>
          </Modal>
          <div
            key={item.id}
            className="flex flex-row items-center m-5 w-[80%] h-[150px] border-2 border-black rounded-3xl cursor-pointer"
            onClick={() => {setIndex(i), setIndex2(item.id), setModalActive(true)}}
          >
            <div className="flex w-[70%] flex-col m-5 items-center">
              <h1 className="text-center text-2xl">{item.name}</h1>
              <h1 className="text-center text-lg">{item.description}</h1>
            </div>
            <div className="flex flex-col items-end w-[30%]">
              <div className="flex flex-row border-2 border-black rounded-2xl mr-5">
                <div className="border-2 w-5 h-5 m-2 bg-red-400 border-black rounded-full"></div>
                {item.hard === 2 || item.hard === 3 ? (
                  <div className="border-2 w-5 h-5 m-2 bg-red-400 border-black rounded-full"></div>
                ) : (
                  <div className="border-2 w-5 h-5 m-2 border-black rounded-full"></div>
                )}
                {item.hard === 3 ? (
                  <div className="border-2 w-5 h-5 m-2 bg-red-400 border-black rounded-full"></div>
                ) : (
                  <div className="border-2 w-5 h-5 m-2 border-black rounded-full"></div>
                )}
              </div>
              {checkArray(tricks!,  {userId: user.data?.id!, trickId: item.id }) ? (
                <div className="border-2 w-10 h-10 m-5 bg-green-400 border-black rounded-full border-dashed"></div>
              ) : 
              (<div className="border-2 w-10 h-10 m-5 border-black rounded-full border-dashed"></div>)}
            </div>
          </div>
          </>
        ))}
      </div>
    </>
  );
};

export default Flat;
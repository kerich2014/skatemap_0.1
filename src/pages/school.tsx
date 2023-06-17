import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "skatemap_new/utils/api";
import { date } from "zod";
import Modal from "skatemap_new/components/modal/Modal";
import { Flex } from "@chakra-ui/react";
import Player from "skatemap_new/components/player/Player";

 const School: NextPage = () => {
  const {data: session} = useSession()
  const email = session?.user.email
  const {data: videos, refetch} = api.video.getAll.useQuery()
  const user = api.user.getById.useQuery({email: email as string})
  const [modalActive, setModalActive] = useState(false)
  const {mutate} = api.video.changeAccept.useMutation()
  const [accept, setAccept] = useState(true)
  const [videoId, setVideoId] = useState(-1)

  const acceptVideo = () => {
    
      mutate({id: videoId, accept: accept})
  }

    return (
      <>
        <div className="flex flex-grow">
          <Link className="m-auto mt-[2%] text-5xl" href = {`/`}>Skate Map</Link>
          {session?.user && (<Link className="absolute top-[3%] right-[2%] border-2 h-12 w-12 border-gray-800 rounded-full m-auto" href={`/profiles/${session?.user.id}`}><img className="rounded-full h-11" src={session.user.image!}></img></Link>)}
        </div>
        <nav className="flex items-center m-[2%]">
            <Link className="a" href = {`/`}>Карта спотов</Link>
            <Link className="a" href = {`/school`}>Школа трюков</Link>
            <Link className="a" href = {`/blog`}>Блог</Link>
            <a className="a">Правила скейтпарков</a>
        </nav>
        {(user.data?.role == 'expert' || user.data?.role == 'admin') && (<button className='addState' onClick={() => {setModalActive(true)}}>Патруль</button>)}
        <div>
          <Modal active={modalActive} setActive={setModalActive}>
          <div className="h-[600px] overflow-hidden overflow-y-scroll">
            {videos?.map((item) => (
                <div className="flex flex-col items-center m-5">
                <div className="flex w-[90%] h-[500px] flex-row items-center border-2 border-black rounded-3xl p-5">
                  <button className="w-full h-[450px] m-3 text-xl rounded-3xl hover:bg-red-100" onClick={
                    () => {
                      setVideoId(item.id),
                      setAccept(false),
                      acceptVideo(),
                      refetch();
                    }
                  }>
                    Отклонить
                    </button>
                  <div className="flex flex-row h-[450px] w-full overflow-hidden items-center m-0">
                    <Player src={item.video}/>
                  </div>
                  <button className="w-full h-[450px] hover:bg-green-100 rounded-3xl m-3 text-xl" onClick={
                    () => {
                      setVideoId(item.id),
                      setAccept(true),
                      acceptVideo(),
                      refetch();
                    }
                  }>
                    Принять
                    </button>
                </div>
              </div>
            ))}
          </div>
          </Modal>
        </div>
      </>
    );
  }

  export default School
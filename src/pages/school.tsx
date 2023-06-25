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
  const {data: trick} = api.user.getTricks.useQuery({id: user.data?.id!})
  const [modalActive, setModalActive] = useState(false)
  const {mutate} = api.video.changeAccept.useMutation()
  const [accept, setAccept] = useState(true)
  const [videoId, setVideoId] = useState(-1)
  const {mutate: mutateLvl} = api.user.updateLvl.useMutation()
  const [userId, setUserId] = useState<string>('')
  const userLvl = api.user.getLvl.useQuery({id: userId})
  const {mutate: mutateSend} = api.userTrick.sendNode.useMutation()
  const [trickId, setTrickId] = useState<number>(0)

  const acceptVideo = () => {
    
      mutate({id: videoId, accept: accept})
  }

  const updateLvl = () => {
    let lvl = userLvl.data?.lvl! + 5
    mutateLvl({id: userId, lvl: lvl})
  }

  const sendData = () => {
    mutateSend({userId: userId, trickId: trickId})
  }

  const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();
  
    return (
      <Link href="/signup">

        <button
          className="absolute top-[4%] right-[7%] border-2 border-white rounded-full bg-white/10 px-10 py-3 no-underline transition hover:border-black"
          
        >
          {sessionData ? "Выйти" : "Войти"}
        </button>
        </Link>
    );
  }

    return (
      <>
        <div className="flex flex-grow">
          <Link className="m-auto mt-[2%] text-5xl" href = {`/`}>Skate Map</Link>
          {session?.user && (<Link className="absolute top-[3%] right-[2%] border-2 h-12 w-12 border-gray-800 rounded-full m-auto" href={`/profiles/${session?.user.id}`}><img className="rounded-full h-11" src={user.data?.image!}></img></Link>)}
          <AuthShowcase />
        </div>
        <nav className="flex items-center m-[2%]">
            <Link className="a" href = {`/`}>Карта спотов</Link>
            <Link className="a" href = {`/school`}>Школа трюков</Link>
            <Link className="a" href = {`/blog`}>Блог</Link>
            <Link className="a" href = {`/rules`}>Правила скейтпарков</Link>
        </nav>
        {(user.data?.role == 'expert' || user.data?.role == 'admin') && (<button className='addState' onClick={() => {setModalActive(true)}}>Патруль</button>)}
        <div>
          <Modal active={modalActive} setActive={setModalActive}>
          <div className="h-[600px] overflow-hidden overflow-y-scroll">
            {videos?.map((item) => (
                <div className="flex flex-col items-center m-5">
                <div className="flex w-[90%] h-[500px] flex-row items-center border-2 border-black rounded-3xl p-5" onMouseUp={() => {setVideoId(item.id), setTrickId(item.trickId as number), setUserId(item.userId as string)}}>
                  <button className="w-full h-[450px] m-3 text-xl rounded-3xl hover:bg-red-100" onClick={
                    () => {
                      setVideoId(item.id),
                      acceptVideo(),
                      refetch();
                      alert('Видео отклонено')
                    }
                  }
                  onMouseUp={() => {
                    setAccept(false),
                    console.log("текущий",accept)
                  }}>
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
                      updateLvl(),
                      sendData(),
                      refetch();
                      alert('Видео одобрено')
                    }
                  }
                  onMouseUp={() => {
                    setAccept(true),
                    console.log("текущий",accept)
                  }}>
                    Принять
                    </button>
                </div>
              </div>
            ))}
          </div>
          </Modal>
        </div>
        <div>
          <div className="flex w-[100%] mb-5 items-center flex-row">
            <Link className="flex flex-row w-[40%] m-auto h-[250px]" href={`/tricks/flat`}>
              <div className="flex flex-row w-[100%] m-auto h-[250px] border-2 border-black hover:border-none cursor-pointer rounded-3xl items-center text-5xl">
                <h1 className="m-auto">ФЛЭТ</h1>
              </div>
            </Link>
            <Link className="flex flex-row w-[40%] m-auto h-[250px]" href={`/tricks/slides`}>
              <div className="flex flex-row w-[100%] m-auto h-[250px] border-2 border-black hover:border-none cursor-pointer rounded-3xl items-center text-5xl">
                <h1 className="m-auto">СКОЛЬЖЕНИЯ</h1>
              </div>
            </Link>
          </div>
          <Link href={`/tricks/radius`}>
            <div className="flex flex-row w-[40%] m-auto h-[250px] border-2 border-black hover:border-none cursor-pointer rounded-3xl items-center text-5xl">
              <h1 className="m-auto">РАДИУС</h1>
            </div>
          </Link>
        </div>
      </>
    );
  }

  export default School
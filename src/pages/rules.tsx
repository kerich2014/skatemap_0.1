import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "skatemap_new/utils/api";
import { date } from "zod";
import Modal from "skatemap_new/components/modal/Modal";
import { Flex } from "@chakra-ui/react";
import Player from "skatemap_new/components/player/Player";

 const Rules: NextPage = () => {
  const {data: session} = useSession()
  const email = session?.user.email
  const user = api.user.getById.useQuery({email: email as string})

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
        <div className="m-auto w-[55%]">
            <img src="https://legendame.ru/uploads/images/blog/impa20owpwc.jpg"></img>
        </div>
      </>
    );
  }

  export default Rules
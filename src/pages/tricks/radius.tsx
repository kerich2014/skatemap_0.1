import React from "react";
import Link from "next/link";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "skatemap_new/utils/api";

 const Radius: NextPage = () => {
  const {data: session} = useSession()
  const email = session?.user.email
  const user = api.user.getById.useQuery({email: email as string})


    return (
      <>
        <div className="flex flex-grow">
          <Link className="m-auto mt-[2%] text-5xl" href = {`/`}>Skate Map</Link>
          {session?.user && (<Link className="absolute top-[3%] right-[2%] border-2 h-12 w-12 border-gray-800 rounded-full m-auto" href={`/profiles/${session?.user.id}`}><img className="rounded-full h-11" src={user.data?.image!}></img></Link>)}
        </div>
        <nav className="flex items-center m-[2%]">
            <Link className="a" href = {`/`}>Карта спотов</Link>
            <Link className="a" href = {`/school`}>Школа трюков</Link>
            <Link className="a" href = {`/blog`}>Блог</Link>
            <a className="a">Правила скейтпарков</a>
        </nav>
      </>
    );
  }

  export default Radius
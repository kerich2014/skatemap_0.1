import React from "react";
import Link from "next/link";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "skatemap_new/utils/api";

interface MyObject {
  userId: string;
  trickId: number;
}

const Flat: NextPage = () => {
  const { data: session } = useSession();
  const email = session?.user.email;
  const user = api.user.getById.useQuery({ email: email as string });
  const { data: tricks } = api.user.getTricks.useQuery({ id: user.data?.id! });
  const { data: flat } = api.trick.getFlat.useQuery();

  const checkArray = (arr: MyObject[], search: MyObject) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.userId === search.userId && arr[i]?.trickId === search.trickId) {
        return true;
      }
    }
    return false;
  };

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
          <div
            key={item.id}
            className="flex flex-row items-center m-5 w-[80%] h-[150px] border-2 border-black rounded-3xl"
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
        ))}
      </div>
    </>
  );
};

export default Flat;
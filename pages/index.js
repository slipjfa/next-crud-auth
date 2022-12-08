import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { BiUserPlus, BiX, BiCheck } from "react-icons/bi";
import Table from "../components/table";
import Form from "../components/form";
import { useSelector, useDispatch } from "react-redux";
import { toggleChangeAction, deleteAction } from "../redux/reducer";
import { deleteUser, getUsers } from "../lib/helper";
import { useQueryClient } from "react-query";
import { useSession, getSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next - CRUD - Auth</title>
      </Head>
      {session ? User({ session, handleSignOut }) : Guest()}
    </div>
  );
}

function Guest() {
  return (
    <main className="container mx-auto text-center py-20">
      <h3 className="text-4xl font-bold">Guest Homepage</h3>
      <Table />
      <div className="flex justify-center">
        <Link
          href={"/login"}
          className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray"
        >
          Sing In
        </Link>
      </div>
    </main>
  );
}

function solution(number){
  let i = 0;
  let j = [];
  if (number < 0) {
    return 0;
  } else {
    while (number > i) {
      if ( i % 3 == 0 || i % 5 == 0) j.push(i);
      i++;
    }
    const sumAll = j.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sumAll;
  }  
}

export function Dashboard() {
  const visible = useSelector((state) => state.app.client.toggleForm);
  const deleteId = useSelector((state) => state.app.client.deleteId);
  const queryclient = useQueryClient();
  const dispatch = useDispatch();
  const handler = () => {
    dispatch(toggleChangeAction());
  };
  const deleteHandler = async () => {
    if (deleteId) {
      await deleteUser(deleteId);
      await queryclient.prefetchQuery("users", getUsers);
      await dispatch(deleteAction(null));
    }
  };
  const cancelHandler = async () => {
    await dispatch(deleteAction(null));
  };
  return (
    <section>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-5">
        <h1 className="text-xl md:text-5xl text-center font-bold py-10">
          Employee Management
        </h1>
        <div className="container mx-auto flex justify-between py-5">
          <div className="left flex gap-3">
            <button
              onClick={handler}
              className="flex bg-indigo-500 text-white px-4 py-2 border 
            rounded-md hover:bg-gray-50 hover:border-indigo-500 hover:text-gray-800"
            >
              Add Employee{" "}
              <span className="px-1">
                <BiUserPlus size={23}></BiUserPlus>
              </span>
            </button>
          </div>
          {deleteId ? DeleteComponent({ deleteHandler, cancelHandler }) : <></>}
        </div>

        {visible ? <Form/> : <></>}

        <div className="container mx-auto">
          <Table/>
        </div>
      </main>
    </section>
  );
}

function DeleteComponent({ deleteHandler, cancelHandler }) {
  return (
    <div className="flex gap-5">
      <button>Are you sure?</button>
      <button
        onClick={deleteHandler}
        className="flex bg-red-500 text-white px-4 py-2 border rounded-md hover:bg-rose-500 hover:border-red-500 hover:text-gray-500"
      >
        Yes{" "}
        <span className="px-1">
          <BiX color="rbg(255 255 255)" size={25} />
        </span>
      </button>
      <button
        onClick={cancelHandler}
        className="flex bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-green-500 hover:border-green-500 hover:text-gray-500"
      >
        No{" "}
        <span className="px-1">
          <BiCheck color="rbg(255 255 255)" size={25} />
        </span>
      </button>
    </div>
  );
}

function User({ session, handleSignOut }) {
  return (
    <main className="container mx-auto text-center py-2">
      <div className="container flex gap-2">
        <div className="flex-none pwd basis-1/4">
          <h3 className="text-base py-3 font-bold">
            Authorized User Homepage
          </h3>
        </div>
        
        <div className="details flex-auto basis-1/2">
          <h5>{session.user.name}</h5>
          <h5>{session.user.email}</h5>
        </div>

        <div className="profile flex-none py-3 mx-auto">
          <Link
            href={"/profile"}
            className="px-3 py-1 rounded-lg border text-gray-50 bg-indigo-500 
            hover:bg-gray-50 hover:border hover:border-indigo-500 hover:text-indigo-500">
            Profile Page
          </Link>
        </div>

        <div className="signout flex-none py-2">
          <button
            onClick={handleSignOut}
            className="px-3 py-1 rounded-lg border text-gray-50 bg-indigo-500 
            hover:bg-gray-50 hover:border hover:border-indigo-500 hover:text-indigo-500">
            Sign Out
          </button>
        </div>

      </div>
      <Dashboard />
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

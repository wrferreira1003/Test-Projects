"use client";
import { db } from "@/database/firebase";
import { updateDoc, collection, doc } from "firebase/firestore";
import { Switch } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

// update user data in firestore ( hideme value )
const updateUserData = async (uid: string, hideMe: Boolean) => {
  const userDoc = doc(db, "users", uid);
  await updateDoc(userDoc, {
    hideMe,
  });
};

const Settings = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [hideMe, setHideMe] = useState<boolean>(false);
  useEffect(() => {
    setHideMe(currentUser.hideMe);
  }, [currentUser]);

  const handleHideMeChange = async (value: boolean) => {
    setHideMe(value);
    await updateUserData(currentUser.uid, value);
  };

  return (
    <div className="w-full p-4 flex  flex-col space-y-2">
      <div className="flex flex-row items-center justify-between w-full border p-4 rounded-2xl ">
        <div className=" flex flex-col space-y-2">
          <h1 className="text-xl ">Hide me</h1>
          <p className="text-gray-500 text-sm">
            Do not show me in the list of users
          </p>
        </div>
        <Switch isSelected={hideMe} onValueChange={handleHideMeChange} />
      </div>
        <div onClick={logout} className="flex bg-red-50 text-red-700 flex-row cursor-pointer items-center justify-between w-fit border p-4 border-red-200 rounded-2xl ">
        <h1 className="text-xl ">Logout</h1>
      </div>
    </div>
  );
};

export default Settings;

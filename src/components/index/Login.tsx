"use client";

import { Button, Select, SelectItem, User } from "@heroui/react";
import { users } from "@/libs/staticData";
import { UserTypes } from "@/libs/d";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

interface Props {
  callbackContent: (content: "login" | "main") => void;
}

const Login = ({ callbackContent }: Props) => {
  const [user, setUser] = useState<UserTypes | null>(null);
  const { setUser: setUserGlobal } = useUser();
  return (
    <div className="bg-background rounded-large p-6 w-[400px]">
      <p className="text-default-500 text-center mb-2">Seleccione una cuenta</p>
      <div className="flex flex-col items-center justify-center gap-3">
        <Select
          placeholder="Seleccione una cuenta"
          onChange={(e) =>
            users.find((user) => user.id === e.target.value)
              ? setUser(
                  users.find((user) => user.id === e.target.value) || null
                )
              : null
          }
        >
          {users.map((user) => (
            <SelectItem key={user.id} textValue={user.name}>
              <User name={user.name} description={user.alias} />
            </SelectItem>
          ))}
        </Select>
        <Button
          color="primary"
          isDisabled={!user}
          onPress={() => {
            if (user) setUserGlobal(user);
            callbackContent("main");
          }}
        >
          Ingresar
        </Button>
      </div>
    </div>
  );
};

export default Login;

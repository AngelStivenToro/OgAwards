"use client";

import { Button, Divider } from "@heroui/react";
import { useUser } from "@/context/UserContext";
import { options } from "@/libs/staticData";
import { useRouter } from "next/navigation";

const IndexMain = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full gap-3">
      <div className="flex flex-col items-center bg-background rounded-large p-4">
        <div className="flex items-center gap-2">
          <i className="bi bi-person-fill text-2xl" />
          <p className="font-bold text-xl">{user?.name}</p>
        </div>
        <p className="text-default-500">{user?.alias}</p>
      </div>
      <p className="text-default-500">Seleccione una opción</p>
      <Divider className="w-[95%] mx-auto" />
      <div className="flex flex-col md:flex-row items-center w-full gap-3">
        {options.map((option, i) => (
          <section
            key={i}
            className="flex flex-col items-center gap-3 bg-background w-full rounded-large p-4"
          >
            <div className="flex items-center justify-between gap-3 w-full">
              <div>
                <p className="font-bold text-xl">
                  <i className={option.icon} /> {option.name}
                </p>
                <p className="text-sm text-default-500">{option.descripcion}</p>
              </div>
              <Button
                color="primary"
                onPress={() => router.push(option.route || "")}
              >
                {option.textButton}
              </Button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default IndexMain;

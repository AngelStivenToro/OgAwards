"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button as ButtonNextUI } from "@heroui/react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import { stringIncludes } from "@/utils/functionsStrings";

interface Props {
  text?: string;
  ref?: React.Ref<HTMLButtonElement | null>;
  animate?: boolean;
  icon?: string | React.ReactNode;
  iconR?: string | React.ReactNode;
  color?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "green"
    | "blue"
    | "gray"
    | "red";
  target?: string;
  title?: string;
  form?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: any;
  noSubmit?: boolean;
  onDoubleClick?: any;
}

const Button = ({
  text,
  ref,
  icon,
  iconR,
  color = "primary",
  target,
  title,
  animate,
  form,
  loading = false,
  disabled = false,
  className,
  onClick,
  noSubmit,
  onDoubleClick,
}: Props) => {
  const router = useRouter();

  const handleClick = () => {
    if (target) return router.push(target);
    return null;
  };

  const enableButton = {
    hidden: {
      scale: 1,
    },
    visible: {
      scale: [1.07, 1],
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <>
      {animate && (
        <motion.div
          initial="hidden"
          animate="visible"
          className="mx-auto"
          variants={!disabled ? enableButton : undefined}
        >
          <ButtonNextUI
            ref={ref}
            // @ts-ignore
            color={
              stringIncludes(color, [
                "primary",
                "secondary",
                "danger",
                "success",
              ])
                ? color
                : "primary"
            }
            startContent={
              icon ? (
                typeof icon === "string" ? (
                  <Icon icon={icon} />
                ) : (
                  icon
                )
              ) : undefined
            }
            endContent={
              iconR ? (
                typeof iconR === "string" ? (
                  <Icon icon={iconR} />
                ) : (
                  iconR
                )
              ) : undefined
            }
            disabled={disabled}
            title={title}
            form={form}
            className={cn(
              "w-full text-base font-medium",
              {
                "bg-gray cursor-not-allowed brightness-75": disabled,
                "bg-green": color === "green" && !disabled,
                "bg-blue": color === "blue" && !disabled,
                "bg-red": color === "red" && !disabled,
                "bg-gray": color === "gray" && !disabled,
              },
              className,
            )}
            onClick={onClick ? onClick : handleClick}
            onDoubleClick={onDoubleClick}
            isLoading={loading}
            type={noSubmit || target || onClick ? "button" : "submit"}
            isIconOnly={!text}
          >
            {text && text}
          </ButtonNextUI>
        </motion.div>
      )}
      {!animate && (
        <ButtonNextUI
          // @ts-ignore
          color={
            stringIncludes(color, ["primary", "secondary", "danger", "success"])
              ? color
              : "primary"
          }
          ref={ref}
          startContent={
            icon ? (
              typeof icon === "string" ? (
                <Icon icon={icon} />
              ) : (
                icon
              )
            ) : undefined
          }
          endContent={
            iconR ? (
              typeof iconR === "string" ? (
                <Icon icon={iconR} />
              ) : (
                iconR
              )
            ) : undefined
          }
          disabled={disabled}
          title={title}
          form={form}
          className={cn(
            "w-full text-base font-medium",
            {
              "bg-gray cursor-not-allowed brightness-75": disabled,
              "bg-green": color === "green" && !disabled,
              "bg-blue": color === "blue" && !disabled,
              "bg-red": color === "red" && !disabled,
              "bg-gray": color === "gray" && !disabled,
            },
            className,
          )}
          onClick={onClick ? onClick : handleClick}
          onDoubleClick={onDoubleClick}
          isLoading={loading}
          type={noSubmit || target || onClick ? "button" : "submit"}
          isIconOnly={!text}
        >
          {text && text}
        </ButtonNextUI>
      )}
    </>
  );
};

export default Button;

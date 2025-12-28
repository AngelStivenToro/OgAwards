"use client";

import React, { MutableRefObject, useRef } from "react";

interface Props {
  children: React.ReactNode[];
  closeDisabled?: boolean;
  ref: MutableRefObject<null>;
}

const DragContainerModal = ({ children, ref, closeDisabled }: Props) => {
  if (children && children.filter((i) => i).length > 0)
    return (
      <div
        ref={ref}
        className="fixed top-0 left-0 w-full pointer-events-none h-screen z-30"
      >
        {children}
      </div>
    );
};

export default DragContainerModal;

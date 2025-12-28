"use client";

import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import React, { useState, useEffect, useRef } from "react";

interface Props {
  urlApi?: string;
  classContainer?: string;
  data?: { items: any[]; renderSize: number };
  renderItem: (item: any, index: number) => React.ReactNode;
}

const InfiniteScroll = ({
  data,
  urlApi,
  renderItem,
  classContainer,
}: Props) => {
  const [items, setItems] = useState<any[]>([]);

  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const [countPage, setCountPage] = useState<number>(1);

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const lastItemHelper = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const getData = async (page: number): Promise<any[]> => {
    if (!urlApi || isLoading) return [];

    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + urlApi + page, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      if (!res.ok || !response.results) {
        setIsCompleted(true);
        return [];
      }

      setItems((prevItems) => [...prevItems, ...response.results]);
      return response.results;
    } catch (e) {
      console.error("Error al cargar los datos:", e);
      setIsCompleted(true);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreItems = async () => {
    if (isLoading) return;

    const nextIndex = visibleItems.length;
    const nextBatch = !data
      ? isCompleted
        ? []
        : await getData(countPage + 1)
      : data.items.slice(nextIndex, nextIndex + data.renderSize);

    if (nextBatch.length > 0) {
      setVisibleItems((prevItems) => [...prevItems, ...nextBatch]);
      setCountPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (isMounted) return;

    if (data) {
      setVisibleItems(data.items.slice(0, data.renderSize));
      setItems(data.items);
    } else {
      if (!isCompleted) {
        getData(countPage).then((newItems) => {
          setVisibleItems(newItems);
        });
      }
    }

    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !lastItemHelper || !lastItemHelper.current) return;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          loadMoreItems();
        }
      },
      { threshold: 1.0 }
    );

    observer.current.observe(lastItemHelper.current);

    return () => {
      if (observer.current && lastItemHelper.current) {
        observer.current.unobserve(lastItemHelper.current);
      }
    };
  }, [isMounted, visibleItems, items, data, isLoading]);

  return (
    <div className={cn("overflow-x-hidden", classContainer)}>
      {visibleItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
      <div ref={lastItemHelper} className="flex justify-center items-center">
        {isLoading && !isCompleted && (
          <Spinner className="m-4" color="primary" size="md" />
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll;

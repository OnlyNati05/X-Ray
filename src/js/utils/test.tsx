import { useEffect, useState } from "react";
import { evalTS } from "../lib/utils/bolt";

export default function Test() {
  const [data, setData] = useState();

  useEffect(() => {
    let isMounted = true;

    async function getData() {
      try {
        const value = await evalTS("compName");
        if (isMounted) {
          setData(value);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching TS data:", error);
        }
      }
    }

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  return <h1>{data}</h1>;
}

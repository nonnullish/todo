import { useEffect, useState } from "react";
import { useTitle } from "react-use";
import dayjs from "dayjs";

import "./index.css";

const Date = () => {
  const [date, setDate] = useState(dayjs());

  useEffect(() => {
    const clock = setInterval(() => {
      setDate(dayjs());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  useTitle(date.format("HH:mm"));

  return (
    <hgroup>
      <h1>{date.format("HH:mm")}</h1>
      <h3>{date.format("dddd, DD MMMM YYYY")}</h3>
    </hgroup>
  );
};

export default Date;

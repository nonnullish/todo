import { useBattery } from "react-use";
import { Zap } from "react-feather";

import "./index.css";

const Battery = () => {
  const battery = useBattery() as any;
  const charge = Number((battery?.level * 100).toFixed(0));
  const colors = ["#e23838", "#f78200", "#5ebd3e"];
  const style = {
    "--charge": `${charge}%`,
    "--color": colors[Math.round((charge * 2) / 100)],
  } as React.CSSProperties;

  return (
    <>
      {battery.charging && <Zap size={16} color="#222222" />}

      <div id="battery" style={style}>
        <div id="charge" />
      </div>

      <p> {charge}% </p>
    </>
  );
};

export default Battery;

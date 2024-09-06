import { useState, useEffect } from "react";
import RangeCard from "./RangeCard";

const Monitoring = (props) => {
    const ranges = [
        {
            name: "2.4 Ггц",
            data: Array(82).fill(10),
            max: 50
        },
        {
            name: "915 Мгц",
            data: Array(101).fill(15),
            max: 100
        },
        {
            name: "5.8 Ггц",
            data: Array(301).fill(20),
            max: 120
        },
    ]
    return <div className="det_mon">
        {ranges.map((item, index) => {
            return <RangeCard key={index}
                name={item.name}
                data={item.data}
                max={item.max}
            />
        })}
    </div>
}

export default Monitoring
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import GraphSingle from "./GraphSingle";

const GraphMultX3 = (props) => {
    const ticks_2400 = new Array(82).fill(0).map((_, index) => {return index+2401})
    const ticks_915 = new Array(101).fill(0).map((_, index) => {return index+820})
    const ticks_5800 = new Array(301).fill(0).map((_, index) => {return index+5645})
    return <div className="graph_multX3">
        <Swiper
            navigation={true}
            modules={[Navigation]}
            loop={true}
            className="swiper_det"
        >
            <SwiperSlide className="swiper_item">
                <GraphSingle name="2.4 ГГц"xticks={ticks_2400} data={props.freq_arr_2400} max={50} min={0}/>
            </SwiperSlide>
            <SwiperSlide className="swiper_item">
                <GraphSingle name="915 МГц"xticks={ticks_915} data={props.freq_arr_915} max={100} min={0}/>
            </SwiperSlide>
            <SwiperSlide className="swiper_item">
                <GraphSingle name="5.8 ГГц"xticks={ticks_5800} data={props.freq_arr_5800} max={120} min={0}/>
            </SwiperSlide>
        </Swiper>
    </div>
}

export default GraphMultX3
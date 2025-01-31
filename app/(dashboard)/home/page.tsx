import CountChart from "@/components/count-chart";
import FaturamentoChart from "@/components/faturamento-chart";
import HomeCard from "@/components/home-card";
import Notificacoes from "@/components/notificacoes";
import ShowsCalendar from "@/components/shows-calendar";
import ShowsChart from "@/components/shows-chart";

const HomePage = () => {
  return (
    <div className="flex gap-4 flex-col md:flex-row mb-2">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* HOME CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <HomeCard type="faturamento" />
          <HomeCard type="shows" />
          <HomeCard type="musicos" />
          <HomeCard type="contratantes" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* SHOWS CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <ShowsChart />
          </div>
        </div>
        {/* BOTTOM CHARTS */}
        <div className="w-full h-[450px]">
          <FaturamentoChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <ShowsCalendar />
        <Notificacoes />
      </div>
    </div>
  );
};

export default HomePage;

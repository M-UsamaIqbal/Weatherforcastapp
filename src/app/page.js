import Head from "next/head";
import WeatherDashboard from "./components/WeatherDashboard";
export default function Home() {
  return (
    <div>
      <Head>
        <title>Weather Dashboard</title>
        <meta name="description" content="Responsive weather dashboard " />
      </Head>

      <main
        className=" flex flex-col items-center justify-center min-h-screen py-2 bg-cover bg-center"
        style={{ backgroundColor: "white"  }}
      >
        <WeatherDashboard />
      </main>
    </div>
  );
}

"use client";
import ReportsCard from '@/components/reports/ReportsCard';
import { apiInfo } from '@/lib/apiInfo';
import { useEffect, useState } from 'react';
import { MdInfo } from 'react-icons/md';


interface SurvivorStatistics {
  totalInfectedSurvivors: number;
  totalNonInfectedSurvivors: number;
  percentageOfInfectedSurvivors: number;
  percentageOfNonInfectedSurvivors: number;
  percentageChangeHealthy: string;
  percentageChangeInfected: string;
  averageResourcesPerSurvivor: { itemId: number; quantity: number }[];
  campGrowthPercentage: string;
}


export default function Home() {
  const [reports, setReports] = useState<SurvivorStatistics>();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
     const fetchData = async () => {
       try {
         setLoading(true);
         const response = await fetch(
           `${apiInfo.apiurl}${apiInfo.routes.reports}`
         );
         const data = await response.json();
         setReports(data);

         // Handling nested fetches with Promise.all
         if (data.averageResourcesPerSurvivor) {
           const itemFetches = data.averageResourcesPerSurvivor.map(
             async (item : { itemId: number; quantity: number }) => {
               const itemResponse = await fetch(
                 `${apiInfo.apiurl}${apiInfo.routes.items(
                   item.itemId
                 )}`
               );
               const itemData = await itemResponse.json();
               return { ...itemData, quantity: item.quantity };
             }
           );

           const itemsData = await Promise.all(itemFetches);
           setItems(itemsData as any);
         }
       } catch (error) {
         console.error('Failed to fetch data:', error);
       } finally {
         setLoading(false);
       }
     };

     fetchData();
   }, []); 

   console.log(items)

  return (
    <main className="px-4 lg:px-28 lg:py-10 py-2.5">
      <div className="px-4 mb-3">
        <h1 className="text-2xl font-semibold text-nexus-appmain">
          Reports
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-gray-400 font-medium">
            Your camp has grows{' '}
            <mark className="text-emerald-500 bg-white">5%</mark> this
            month
          </p>
          <MdInfo size={20} className="text-gray-500" />
        </div>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <ReportsCard
          up={true}
          title="Number of Healthy Survivors"
          data={reports?.totalNonInfectedSurvivors ?? 0}
          subTitle="Last 30 days"
          percentage={reports?.percentageOfNonInfectedSurvivors ?? 0}
          show={true}
          loading={loading}
        />
        <ReportsCard
          up={false}
          title="Number of Infected Survivors"
          data={reports?.totalInfectedSurvivors ?? 0}
          subTitle="Last 30 days"
          percentage={reports?.percentageOfInfectedSurvivors ?? 0}
          show={true}
          loading={loading}
        />
        {items.length > 0 &&
          items.map((item: { itemId: number; quantity: number, name :string }, index) => (
            <div key={index}>
              <ReportsCard
                title="Average Resources Available"
                data={item.name}
                subTitle={`${item.quantity} ${item.name} for each survivor`}
                show={false}
                loading={loading}
              />
            </div>
          ))}
      </div>
    </main>
  );
}

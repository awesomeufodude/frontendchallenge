'use client';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { SurvivorsTable } from '@/components/survivors/SurvivorsTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiInfo } from '@/lib/apiInfo';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import { MdInfo } from 'react-icons/md';

interface ItemDetail {
  id: number;
  name: string;
  description: string;
}

interface InventoryEntry {
  id: number;
  survivorId: number;
  itemId: number;
  quantity: number;
  Item: ItemDetail;
}

interface Inventories {
  [key: string]: InventoryEntry[]; // Mapping from survivor's ID to their inventory entries
}

interface Survivor {
  id: string;
  name: string;
  age: number;
  gender: string;
  infected: boolean;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [survivors, setSurvivors] = useState([]);
  const [inventories, setInventories] = useState<Inventories>({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [infected, setInfected] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${apiInfo.apiurl}${apiInfo.routes.getAllSurvivors}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        response.status === 401 && router.push('/login');
        const data = await response.json();

        setSurvivors(data);
        // Fetch inventory for each survivor
        const inventoryData: Inventories = {};
        await Promise.all(
          data.map(async (survivor: Survivor) => {
            const id = survivor.id.toString();
            const inventoryResponse = await fetch(
              `${apiInfo.apiurl}${apiInfo.routes.getInventory(id)}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            const inventory: InventoryEntry[] =
              await inventoryResponse.json(); // Ensure this matches the expected type
            inventoryData[survivor.id] = inventory;
          })
        );
        setInventories(inventoryData);

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataUpdated]);


  const tableData = useMemo(() => {
    if (Array.isArray(survivors)) { // Check if survivors is indeed an array
    return survivors.map(
      (survivor: Survivor) => ({
        id: survivor.id,
        name: survivor.name,
        age: survivor.age,
        gender: survivor.gender,
        infected: survivor.infected,
        dateAdded: survivor.createdAt,
        inventory: inventories[survivor.id],
      })
    );
  }
  return []; 
  }, [survivors, inventories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <main className="px-4 lg:px-28 lg:py-10 py-2.5">
      <div className="flex items-center justify-between">
        <div className="px-4 mb-3">
          <h1 className="text-2xl font-semibold text-nexus-appmain">
            List of Survivors
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-400 font-medium">
              You have {survivors.length} healthy survivors
            </p>
            <MdInfo size={20} className="text-gray-500" />
          </div>
        </div>
        {/* Dialog and other components omitted for brevity */}
      </div>
      <div className="p-4">
        <InventoryTable data={tableData} />
      </div>
    </main>
  );
}

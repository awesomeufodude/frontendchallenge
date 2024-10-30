"use client";
import { SurvivorsTable } from '@/components/survivors/SurvivorsTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiInfo } from '@/lib/apiInfo';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import { MdInfo } from 'react-icons/md';

export default function Home() {

  const router = useRouter();
  const { toast } = useToast();
  const [survivors, setSurvivors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);


  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [infected, setInfected] = useState(false);

  const handleAddSurvivor = async () => {
    setLoadingCreate(true);
    const token = sessionStorage.getItem('token');

    try {

      if (!token) {
        router.push('/login');
        return;
      }
      const payload = {
        name,
        age,
        gender,
        infected,
        lastLatitude: 34.0522,
        lastLongitude: -118.2437,
      };

      const response = await fetch(
        `${apiInfo.apiurl}${apiInfo.routes.createSurvivors}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      response.status === 401 && router.push('/login');
      const data = await response.json();

      if (data) {
        setDataUpdated(true);
        setName('');
        setAge(0);
        setGender('');
        setInfected(false);
        setLoadingCreate(false);
        toast({
          title: 'Survivor added successfully',
          description: 'The survivor has been added successfully.',
          variant: 'default',
          duration: 4000,
        });
        setIsOpen(false);
      }
    } catch (error) {
      setDataUpdated(false);
      setLoadingCreate(false);
      console.error('Error adding survivor:', error);
    }
  };


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
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        response.status === 401 && router.push('/login');
        const data = await response.json();

        
        setSurvivors(data);
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
    return survivors.map((survivor : {id : string, name : string, age : number, gender : string, infected : boolean, createdAt : string, lastLatitude : number, lastLongitude : number, updatedAt : string}) => ({
      id: survivor.id,
      name: survivor.name,
      age: survivor.age,
      gender: survivor.gender,
      infected: survivor.infected,
      dateAdded: survivor.createdAt,
    }));
  }
  return []; 
  }, [survivors]);

  if(loading){
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
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
              You have 12345 healthy survivors
            </p>
            <MdInfo size={20} className="text-gray-500" />
          </div>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild onClick={() => setIsOpen(true)}>
            <Button
              variant="outline"
              className="font-semibold text-nexus-appmain"
            >
              <IoMdAddCircle />
              Add Survivor
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Add Survivor</DialogTitle>
              <DialogDescription>
                Add a new survivor to the list
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 w-full">
              <div className="w-full">
                <Label>Full name of Survivor</Label>
                <Input
                  id="name"
                  className="mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Label className="font-medium text-nexus-appmain">
                  Age
                </Label>
                <Input
                  id="age"
                  className="mt-2"
                  type="number"
                  min={1}
                  value={age}
                  onChange={(e) => setAge(e.target.valueAsNumber)}
                />
              </div>
              <div className="w-full">
                <Select onValueChange={setGender}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="MALE">MALE</SelectItem>
                      <SelectItem value="FEMALE">FEMALE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <Select
                  onValueChange={(value) =>
                    setInfected(value === 'true')
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="SelectInfected Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Infected</SelectLabel>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-nexus-appmain"
                disabled={loadingCreate}
                onClick={handleAddSurvivor}
              >
                {loadingCreate ? 'Adding...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-4">
        <SurvivorsTable data={tableData} />
      </div>
    </main>
  );
}

import { FC, use, useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { apiInfo } from '@/lib/apiInfo';
import { toast } from '@/hooks/use-toast';

interface ItemDetail {
  id: number;
  name: string;
  description: string;
}

// Interface for an inventory entry associated with a survivor
interface InventoryEntry {
  id: number;
  survivorId: number;
  itemId: number;
  quantity: number;
  Item: ItemDetail;
}

// Interface for a survivor, including their inventory
interface Inventory {
  id: string;
  name: string;
  age: number;
  gender: string;
  infected: boolean;
  dateAdded: string;
  inventory: InventoryEntry[];
}

interface InventoryDialogProps {
  row: any;
  survivorId: string;
}

const InventoryDialog: FC<InventoryDialogProps> = ({ row, survivorId }) => {
  const [loading, setLoading] = useState(false);

  const [tradeLoading, setTradeLoading] = useState(false);
  const [itemId1, setItemId1] = useState(0);
  const [itemId2, setItemId2] = useState(0);
  const [quantity1, setQuantity1] = useState(0);
  const [quantity2, setQuantity2] = useState(0);

  const [survivorId2, setSurvivorId2] = useState(0);

  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiInfo.apiurl}${apiInfo.routes.getItems}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      if (data) {
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
  ) => {
    setTradeLoading(true);
    const token = sessionStorage.getItem('token');

    try {
      
      const payload = { 
        survivorId1: survivorId,
        survivorId2: survivorId2,
        itemId1: itemId1,
        itemId2: itemId2,
        quantity1: quantity1,
        quantity2: quantity2
      };

      
      const response = await fetch(
        `${apiInfo.apiurl}${apiInfo.routes.trade}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        setTradeLoading(false);
          toast({
            title: 'Success',
            description: 'Item requested successfully',
            variant:"default"
          });
        } else {
          setTradeLoading(false);
          toast({
            title: 'Error',
            description: `${data.message}`,
            variant:"destructive"
          });
        }
      } catch (error) {
        setTradeLoading(false);
      console.error('Failed to fetch data:', error);
    } 
  };

  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="font-semibold text-nexus-appmain"
        >
          Request Item
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Request Item </DialogTitle>
          <DialogDescription>
            from {row.getValue('name')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 w-full">
          <div className="w-full">
            <Select
              name="item"
              onValueChange={(e) => setItemId1(Number(e))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an Item for Request" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Items</SelectLabel>
                  {items.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Input
              type="number"
              name="quantity1"
              placeholder="Quantity for Request"
              onChange={(e) => setQuantity1(Number(e.target.value))}
            />
          </div>
          <div className="w-full">
            <Select
              name="item 2"
              onValueChange={(e) => setItemId2(Number(e))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an Item for Exchange" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Items</SelectLabel>
                  {items.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Input
              type="number"
              name="quantity"
              placeholder="Quantity for Exchange"
              onChange={(e) => setQuantity2(Number(e.target.value))}
            />
          </div>
          <div className="w-full">
            <Input
              type="number"
              name="survivor"
              placeholder="Survivor ID for Request"
              onChange={(e) => setSurvivorId2(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="bg-nexus-appmain" disabled={tradeLoading} onClick={handleSubmit}>
            Request Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryDialog;

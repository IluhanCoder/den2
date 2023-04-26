import { Types } from "mongoose";

export default interface IProduct {
  _id?: Types.ObjectId,
  num?: number;
  name: string;
  desc: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
}

export async function propertiesExists(data: Object): Promise<boolean> {
  const temp: IProduct = {
    name: "",
    desc: "",
    category: "",
    price: 0,
    quantity: 0,
    status: ""
  };

  return Object.keys(data).some((key: string) => {
    return temp[key] !== undefined
  })
}

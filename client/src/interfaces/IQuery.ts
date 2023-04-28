export default interface IQuery {
  _id?: string;
  name?: object;
  nameString?: string;
  desc?: object;
  descString?: string;
  category?: string;
  priceStart?: number;
  priceEnd?: number;
  quantityStart?: number;
  quantityEnd?: number;
  status?: string;
  price?: object;
  quantity?: object;
}

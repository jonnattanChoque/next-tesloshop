// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { initialDataProducts } from '../../src/db/seeds/products'
import { db } from '../../src/db'
import { ProductModel, UserModel } from '../../src/models'
import { initialDataUsers } from '../../src/db/seeds/users'

type Data = {
  message: string
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data>) {
  if(process.env.NODE_ENV === 'production') {
    res.status(401).json({ message: 'Not allowed' })
  };

  await db.connect()

  // await UserModel.deleteMany();
  // await UserModel.insertMany(initialDataUsers.users);

  await ProductModel.deleteMany();
  await ProductModel.insertMany(initialDataProducts.products);
  
  await db.disconnect()
  res.status(200).json({ message: 'Seeds loaded' })
}

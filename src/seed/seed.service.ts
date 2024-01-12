import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/auth/entities/auth.entity";
import { Product } from "src/product/entities/product.entity";
import { Shipment } from "src/shipment/entities/shipment.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Shipment.name) private readonly shipmentModel: Model<Shipment>,
  ) {}

  async executeSeed() {
    await this.cleanAllCollections();
    const users = await this.insertUsers();
    const products = await this.insertProducts(users);
    await this.insertShipments(users, products);
    return 'Seed ejecutado con éxito!';
  }

  private async cleanAllCollections() {
    await this.userModel.deleteMany({});
    await this.productModel.deleteMany({});
    await this.shipmentModel.deleteMany({});
  }

  private async insertUsers(): Promise<User[]> {
    const passwordHashed = bcrypt.hashSync('Ab12345678', 10);


    const usersData = [
      { name: 'Alice', email: 'alice@mail.com', password: passwordHashed, roles: ['admin', 'vendedor',], isActive: true },
      { name: 'Bob', email: 'bob@mail.com', password: passwordHashed, roles: ['vendedor', 'cliente'], isActive: true },
    ];
    return await this.userModel.insertMany(usersData);
  }

  private async insertProducts(users: User[]): Promise<Product[]> {
    const productsData = users.map(user => ({
      name: 'Producto de ' + user.name,
      description: 'Descripción para ' + user.name,
      price: Math.random() * 100,
      stock: Math.floor(Math.random() * 100),
      user: user._id,
    }));
  
    const products = await this.productModel.insertMany(productsData);
  
    // Actualizar usuarios con los productos creados
    for (const user of users) {
      const userProducts = products.filter(p => p.user.toString() === user._id.toString());
      await this.userModel.findByIdAndUpdate(user._id, {
        $set: { products: userProducts.map(p => p._id) }
      });
    }
  
    return products;
  }
  
  private async insertShipments(users: User[], products: Product[]) {
    const shipmentsData = products.map((product, index) => {
      const userId = this.ensureObjectId(product.user);
      const recipientId = this.getRandomUserId(users, userId);
  
      return {
        trackingNumber: 'TN' + index.toString().padStart(3, '0'),
        products: [product._id],
        sender: userId,
        recipient: recipientId,
        status: 'In transit',
      };
    });
  
    const shipments = await this.shipmentModel.insertMany(shipmentsData);
  
    // Actualizar usuarios con los envíos creados
    for (const shipment of shipments) {
      await this.userModel.findByIdAndUpdate(shipment.sender, {
        $push: { shipments: shipment._id }
      });
      await this.userModel.findByIdAndUpdate(shipment.recipient, {
        $push: { shipments: shipment._id }
      });
    }
  }
  
  
  private ensureObjectId(value: Types.ObjectId | User): Types.ObjectId {
    if (value instanceof Types.ObjectId) {
      return value;
    } else if (value instanceof User) {
      return value._id;
    } else {
      throw new Error('Invalid type, expected ObjectId or User');
    }
  }
  
  private getRandomUserId(users: User[], excludeId: Types.ObjectId): Types.ObjectId {
    let randomUser = users[Math.floor(Math.random() * users.length)];
    while (randomUser._id.equals(excludeId)) {
      randomUser = users[Math.floor(Math.random() * users.length)];
    }
    return randomUser._id;
  }
}

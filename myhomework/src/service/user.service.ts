import { Provide } from '@midwayjs/core';
import { IUserOptions } from '../interface';
import { CreateUserDto } from '../controller/api.controller';
const mysql = require('mysql2/promise');

@Provide()
export class UserService {
  private dbPool: any; 

  async onInit() {
    this.dbPool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'Shule543279448',
      database: 'username',
    });
  }

  async getUser(options: IUserOptions): Promise<any> {
    try {
      const [rows] = await this.dbPool.execute('SELECT * FROM users WHERE uid = ?', [options.uid]);
      return rows && rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Database error in getUser:', error);
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const [metadata] = await this.dbPool.execute(
        'INSERT INTO users (username) VALUES (?)',
        [createUserDto.username]
      );

      return { uid: metadata.insertId, username: createUserDto.username };
    } catch (error) {
      console.error('Database error in createUser:', error);
      throw error;
    }
  }

  async onDestroy() {
    if (this.dbPool) {
      await this.dbPool.end();
    }
  }
}
